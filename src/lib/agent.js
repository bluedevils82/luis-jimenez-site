// Assistant brain glue: builds the app context the chat model reasons over
// (straight from the live registries, so it can never go stale), parses the
// model's plan blocks, and provides a deterministic local planner that takes
// over when the AI chat backend cannot be reached.
import { t2iModels, i2iModels, t2vModels, i2vModels, lipsyncModels } from './models.js';
import { fitModels, fitInfo, VIDEO_STYLES, IMAGE_STYLES, joinPrompt } from './modelStyles.js';
import { getVideoSpec, advancedFieldsFor } from './videoSpecs.js';
import { CAMERA_PRESETS, RESTYLE_PRESETS } from './presets.js';

const uniq = (list) => [...new Map(list.map(m => [m.id, m])).values()];

// ---- Live prices ------------------------------------------------------------
// Prices live server-side (netlify/functions/models.js: published Kie rates,
// replaced by measured averages from real runs) and are served with the model
// list at /.netlify/functions/models. Fetched once per session and cached;
// every consumer degrades gracefully to "no price" when the fetch fails.
let pricingCache = null;
export async function fetchModelPricing() {
    if (pricingCache) return pricingCache;
    try {
        const res = await fetch('/.netlify/functions/models', { credentials: 'include' });
        const data = await res.json();
        const list = Array.isArray(data) ? data : (data.models || []);
        const map = {};
        for (const m of list) if (m?.id && m.pricing) map[m.id] = m.pricing;
        pricingCache = map;
    } catch { pricingCache = {}; }
    return pricingCache;
}

const fmtCr = (n) => (Math.round(n * 10) / 10).toLocaleString('en-US');
const fmtUsd = (cr) => `$${(cr * 0.005).toFixed(2)}`;

// "from 2.4 cr/sec (≈ $0.012/sec)" / "250 cr/video (≈ $1.25; 720p 250 · 1080p 255)"
export function priceText(p) {
    if (!p?.credits) return '';
    const unit = String(p.unit || 'cr/video').replace('cr/', '');
    let s = `${p.from ? 'from ' : ''}${fmtCr(p.credits)} cr/${unit} (≈ ${fmtUsd(p.credits)}${unit === 'sec' ? '/sec' : ''})`;
    if (p.byResolution) {
        const tiers = Object.entries(p.byResolution).map(([r, v]) => `${r} ${fmtCr(v.credits)}`).join(' · ');
        if (tiers) s += ` — by resolution: ${tiers} cr`;
    }
    if (p.source === 'measured') s += ' (measured from real runs)';
    return s;
}

// Estimated total for one planned generation, or null when unpriced.
export function estimateCost(p, plan) {
    if (!p?.credits || !plan) return null;
    let credits = p.credits, unit = p.unit || 'cr/video';
    const resTier = plan.resolution && p.byResolution?.[plan.resolution];
    if (resTier?.credits) { credits = resTier.credits; unit = resTier.unit || unit; }
    let total = credits;
    if (unit === 'cr/sec' && plan.kind === 'video') total = credits * (Number(plan.duration) || 5);
    return { credits: total, usd: total * 0.005, from: !!p.from, unit, perSec: unit === 'cr/sec' ? credits : null };
}

export function costLabel(est) {
    if (!est) return '';
    return `${est.from ? 'from ' : ''}≈ ${fmtCr(est.credits)} credits (~${fmtUsd(est.credits)})`;
}

// Typical generation time for a plan, as a { min, max } range in seconds.
// Queue time on Kie varies, so this is an honest range by model family and
// tier — shown to the user BEFORE the job starts, never as a promise.
export function estimateTime(plan) {
    if (!plan) return null;
    if (plan.kind === 'image') {
        const tier = fitInfo(plan.model)?.tier;
        if (tier === 'premium') return { min: 45, max: 120 };
        if (tier === 'budget') return { min: 15, max: 45 };
        return { min: 30, max: 90 };
    }
    const id = String(plan.model || '');
    const d = Number(plan.duration) || 5;
    if (id.startsWith('veo')) return { min: 60, max: 150 };
    if (id.startsWith('bytedance/seedance')) return { min: 90 + d * 6, max: 180 + d * 12 };
    if (id.startsWith('kling')) return { min: 120, max: 300 };
    if (id.startsWith('wan')) return { min: 90, max: 240 };
    if (id.includes('happyhorse')) return { min: 90, max: 240 };
    return { min: 90, max: 300 };
}

export function timeLabel(t) {
    if (!t) return '';
    if (t.max <= 75) return `~${Math.round(t.min / 5) * 5}–${Math.round(t.max / 5) * 5} sec`;
    const lo = Math.max(1, Math.round(t.min / 60));
    const hi = Math.max(lo, Math.round(t.max / 60));
    return lo === hi ? `~${lo} min` : `~${lo}–${hi} min`;
}

function modelLine(m, kind, pricing) {
    const fit = fitInfo(m.id);
    const parts = [`${m.id} — ${m.name || m.label || m.id} (${kind})`];
    const pt = priceText(pricing?.[m.id]);
    if (pt) parts.push(`price: ${pt}`);
    if (fit?.note) parts.push(fit.note);
    if (fit) parts.push(`tier: ${fit.tier}, reference photos: ${fit.refs || 0}${fit.voice ? ', takes a voiceover' : ''}`);
    if (m.aspects?.length) parts.push(`aspect ratios: ${m.aspects.join(', ')}`);
    if (m.resolutions?.length) parts.push(`resolutions: ${m.resolutions.join(', ')}`);
    if (kind === 'video') {
        const spec = getVideoSpec(m.id);
        const durations = spec?.durations || m.durations;
        if (durations?.length) parts.push(`durations (sec): ${durations.join(', ')}`);
        const adv = advancedFieldsFor(m.id, false).concat(advancedFieldsFor(m.id, true)).map(f => f.key);
        if (adv.length) parts.push(`extra settings: ${[...new Set(adv)].join(', ')}`);
    }
    if (m.images) parts.push(m.images.required ? 'REQUIRES a reference/start image' : 'accepts an optional reference/start image');
    return '- ' + parts.join(' · ');
}

// Compact, current picture of the whole app for the chat model. Built at
// runtime from the same registries the studios use.
export function buildAgentContext(prices = {}) {
    const lines = [];
    lines.push('IMAGE MODELS (text-to-image / image edit):');
    uniq([...t2iModels, ...i2iModels]).forEach(m => lines.push(modelLine(m, 'image', prices)));
    lines.push('VIDEO MODELS (text-to-video / image-to-video):');
    uniq([...t2vModels, ...i2vModels]).forEach(m => lines.push(modelLine(m, 'video', prices)));
    if (lipsyncModels.length) {
        lines.push('LIP-SYNC / TALKING MODELS (portrait + audio -> talking video, in the Lip Sync tool):');
        lipsyncModels.forEach(m => lines.push(modelLine(m, 'talk', prices)));
    }
    lines.push('PRICES: Model prices above are in Kie credits (1 credit ≈ $0.005); "from" prices are the cheapest option for that model and the real cost depends on the settings (per-second models cost rate × duration; some models price per resolution — those tiers are listed). You know every model\'s price and specs: when the user asks what something costs, or mentions a budget, compare models on price and state the estimated total for the planned settings in your plan note (e.g. "about 41 credits (~$0.21) for 10s at 720p"). Two models have no published per-generation price: ElevenLabs voiceover bills per character (~12 credits per 1,000 characters; cloned voices use the user\'s own ElevenLabs plan), and HappyHorse video edit is unpriced.');
    lines.push(`VIDEO LOOKS: ${VIDEO_STYLES.map(s => `${s.id} (${s.label})`).join(', ')}`);
    lines.push(`IMAGE LOOKS: ${IMAGE_STYLES.map(s => `${s.id} (${s.label})`).join(', ')}`);
    lines.push(`CAMERA PRESETS for video: ${CAMERA_PRESETS.filter(p => p.id !== 'none').map(p => p.label).join(', ')}`);
    lines.push(`RESTYLE LOOKS (Remix video edit): ${RESTYLE_PRESETS.map(p => p.label).join(', ')}`);
    lines.push('WORKFLOWS / TOOLS IN THE APP: Create image (text or photos -> image, with look + character/item locks), Create video (text or image -> video, camera presets, sound: model audio / ElevenLabs voiceover / silent), Cinema still (film camera, lens, lighting controls), Lip sync / talking (photo or video + audio), Motion transfer (a character performs a source video\'s moves), Character swap and Item swap / edit (Remix), Content factory (one brief -> a batch of video scenes), Characters (save a person once, lock them into generations), Library (every generation is saved there automatically; any item can be animated, edited or redone).');
    lines.push('RULES: Generation runs only after the user approves a plan. Results are saved to the Library automatically.');
    lines.push('ATTACHMENTS & LOCKS: The user can attach files (images, videos, audio) and lock characters/items with reference photos using the panel above the chat box. A user message may end with an [Attached files: ...] manifest listing what is attached and locked — treat those files as available to the generation. Locked character/item photos and attached files are sent automatically with the generation once the user approves the plan, so write plans assuming they are included; when reference photos are attached or locked, prefer models whose reference-photo count is above 0.');
    return lines.join('\n');
}

// ---- Selection fit (intent / workflow gates) --------------------------------
const isSeedance = (id) => String(id || '').startsWith('bytedance/seedance');
const voiceCapable = (id) => !!fitInfo(id)?.voice || isSeedance(id);

// Does this model take image inputs at all (start frame / references)?
// Video: i2v-capable registry entries (m.images) or a reference-photo count.
// Image: image-to-image registry entries or a reference-photo count.
export function modelAcceptsImages(id, kind) {
    if ((fitInfo(id)?.refs || 0) > 0) return true;
    if (kind === 'video') return i2vModels.some(m => m.id === id);
    if (kind === 'image') return i2iModels.some(m => m.id === id);
    return false;
}

function planFitsSelection(plan, sel) {
    if (sel.intent && plan.kind !== sel.intent) return false;
    switch (sel.workflow) {
        case 'scratch': return !modelById(plan.model)?.images?.required;
        case 'edit': return plan.kind === 'image' && modelAcceptsImages(plan.model, 'image');
        case 'animate': return plan.kind === 'video' && modelAcceptsImages(plan.model, 'video');
        case 'refs': return (fitInfo(plan.model)?.refs || 0) > 0;
        case 'talking': return plan.kind === 'video' && voiceCapable(plan.model);
        default: return true;
    }
}

// If the chat model's plan breaks the user's intent/workflow selection,
// re-pick a same-kind, workflow-fitting model with the local planner and
// keep the AI's optimized prompt.
function coercePlan(plan, sel) {
    if (planFitsSelection(plan, sel)) return plan;
    const repick = localPlan(plan.prompt, { kind: sel.intent || plan.kind, intent: sel.intent, workflow: sel.workflow });
    if (!repick.plan) return plan;
    return { ...repick.plan, prompt: plan.prompt, generate_audio: plan.generate_audio };
}

// ---- Plan blocks ------------------------------------------------------------
export function parsePlan(text, sel = {}) {
    const match = String(text || '').match(/```plan\s*([\s\S]*?)```/);
    if (!match) return { cleanText: String(text || '').trim(), plan: null };
    let plan = null;
    try {
        const raw = JSON.parse(match[1].trim());
        const all = uniq([...t2iModels, ...i2iModels, ...t2vModels, ...i2vModels, ...lipsyncModels]);
        const model = all.find(m => m.id === raw.model);
        if (model && (raw.kind === 'image' || raw.kind === 'video') && typeof raw.prompt === 'string' && raw.prompt.trim()) {
            plan = {
                kind: raw.kind,
                model: model.id,
                modelName: model.name || model.label || model.id,
                prompt: raw.prompt.trim(),
                aspect_ratio: model.aspects?.includes(raw.aspect_ratio) ? raw.aspect_ratio : (model.aspects?.[0] || '16:9'),
                resolution: model.resolutions?.includes(raw.resolution) ? raw.resolution : (model.resolutionDefault || model.resolutions?.[0] || ''),
                duration: Number(raw.duration) || null,
                generate_audio: raw.generate_audio !== false,
            };
            if (plan.kind === 'video') {
                const durations = getVideoSpec(model.id)?.durations || model.durations || [];
                plan.duration = durations.includes(plan.duration) ? plan.duration : (getVideoSpec(model.id)?.durationDefault || durations[0] || 5);
            }
        }
    } catch { /* malformed plan -> plain chat reply */ }
    if (plan && (sel.intent || sel.workflow)) plan = coercePlan(plan, sel);
    return { cleanText: String(text).replace(match[0], '').trim(), plan };
}

// ---- AI chat call -----------------------------------------------------------
const WORKFLOW_GUIDANCE = {
    scratch: 'from scratch — text only, no image inputs; choose models that need no image',
    edit: 'edit the user\'s photo — choose image models that accept image input / reference photos',
    animate: 'animate a photo (image-to-video) — choose models that accept a start image',
    refs: 'keep a character / product identical — choose models whose reference-photo count is above 0',
    talking: 'talking / voiceover — choose models that take a voiceover, or Seedance family models',
};

// sel = { intent: 'image'|'video'|null, workflow: string|null } — the user's
// current gate selection. It rides inside the context string, which the
// agent-chat function appends verbatim to its system prompt.
export async function chatWithAgent(history, sel = {}) {
    const prices = await fetchModelPricing();
    let context = buildAgentContext(prices);
    if (sel.intent) {
        const wf = sel.workflow && WORKFLOW_GUIDANCE[sel.workflow]
            ? ` Workflow: ${sel.workflow} (${WORKFLOW_GUIDANCE[sel.workflow]}).`
            : ' No specific workflow picked yet — any model of this kind is fine.';
        context += `\n\nCURRENT SELECTION: User intent: ${sel.intent.toUpperCase()}.${wf} Only propose plans with kind "${sel.intent}"${sel.workflow ? ' that fit this workflow' : ''}.`;
    }
    const response = await fetch('/.netlify/functions/agent-chat', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            context,
            messages: history.map(m => ({ role: m.role, content: m.text })),
        }),
    });
    let data = {};
    try { data = await response.json(); } catch { /* empty */ }
    if (!response.ok || !data.reply) throw new Error(data.error || `Assistant chat failed (${response.status})`);
    return data.reply;
}

// ---- Deterministic local planner (fallback) ---------------------------------
const VIDEO_WORDS = /\b(video|clip|animate|animation|motion|reel|tiktok|shorts|film|movie|footage)\b/i;
const IMAGE_WORDS = /\b(image|photo|picture|poster|thumbnail|logo|portrait|still|drawing|artwork|headshot)\b/i;

const STYLE_KEYWORDS = [
    ['cinematic', /\bcinematic|film look|movie\b/i],
    ['ugc', /\bugc|selfie|tiktok style|handheld phone\b/i],
    ['cartoon', /\bcartoon|anime|animated style|pixar\b/i],
    ['product', /\bproduct|ad\b|advert|commercial|promo\b/i],
    ['realistic', /\brealistic|photoreal|real life|lifelike\b/i],
    ['design', /\bposter|graphic|typography|text\b/i],
];

const CAMERA_KEYWORDS = [
    ['orbit', /\borbit|360|around\b/i],
    ['dolly-in', /\bdolly in|push[- ]?in|zoom in slowly\b/i],
    ['dolly-out', /\bdolly out|pull back|reveal\b/i],
    ['aerial', /\baerial|drone|from above\b/i],
    ['fpv', /\bfpv\b/i],
    ['handheld', /\bhandheld\b/i],
    ['tracking', /\btracking|follow the\b/i],
    ['static', /\bstatic|locked|no movement|still camera\b/i],
    ['crane-up', /\bcrane up|rising shot\b/i],
    ['low-angle', /\blow angle|hero shot\b/i],
];

export function detectKind(text) {
    if (VIDEO_WORDS.test(text)) return 'video';
    if (IMAGE_WORDS.test(text)) return 'image';
    return null;
}

// Returns { question } when one essential is missing, otherwise { plan, note }.
export function localPlan(brief, known = {}) {
    const text = String(brief || '').trim();
    const kind = known.kind || known.intent || detectKind(text);
    if (!kind) {
        return { question: 'Happy to make that. Do you want an image or a video?', needs: 'kind' };
    }
    const styles = kind === 'video' ? VIDEO_STYLES : IMAGE_STYLES;
    const styleId = (STYLE_KEYWORDS.find(([id, re]) => styles.some(s => s.id === id) && re.test(text)) || ['any'])[0];
    const style = styles.find(s => s.id === styleId) || styles[0];

    // Candidate pool, narrowed by the workflow gate when one is picked:
    // scratch = text-only models, edit = image-input models, animate =
    // i2v-capable models, refs = reference-capable models, talking =
    // voice-capable or Seedance models.
    let list = kind === 'video' ? uniq([...t2vModels, ...i2vModels]) : uniq([...t2iModels, ...i2iModels]);
    const wf = known.workflow || null;
    if (wf === 'scratch') list = kind === 'video' ? t2vModels.filter(m => !m.images?.required) : [...t2iModels];
    else if (wf === 'edit' && kind === 'image') list = uniq([...i2iModels, ...t2iModels.filter(m => (fitInfo(m.id)?.refs || 0) > 0)]);
    else if (wf === 'animate' && kind === 'video') list = [...i2vModels];
    else if (wf === 'refs') list = list.filter(m => (fitInfo(m.id)?.refs || 0) > 0);
    else if (wf === 'talking' && kind === 'video') list = list.filter(m => voiceCapable(m.id));
    if (!list.length) list = kind === 'video' ? uniq([...t2vModels, ...i2vModels]) : uniq([...t2iModels, ...i2iModels]);
    const best = fitModels(list, { style: styleId, locks: wf === 'refs' })[0]?.model || list[0];
    if (!best) return { question: 'No model in the app fits that right now. Try describing it a little differently.', needs: null };

    let prompt = text.replace(/\b(make|create|generate|please|an?\s+image\s+of|an?\s+video\s+of)\b/gi, '').trim() || text;
    prompt = prompt.charAt(0).toUpperCase() + prompt.slice(1);
    const extras = [];
    if (style.hint) extras.push(style.hint);
    let camera = null;
    if (kind === 'video') {
        const hit = CAMERA_KEYWORDS.find(([, re]) => re.test(text));
        camera = CAMERA_PRESETS.find(p => p.id === (hit ? hit[0] : 'dolly-in'));
        if (camera?.text) extras.push(camera.text);
        extras.push('Smooth, continuous motion, consistent subject throughout, no flicker or warping.');
    } else {
        extras.push('Sharp detail, clean composition, no artifacts or distorted text.');
    }
    const optimized = joinPrompt(prompt.endsWith('.') ? prompt : `${prompt}.`, ...extras);

    const durations = kind === 'video' ? (getVideoSpec(best.id)?.durations || best.durations || [5]) : [];
    let duration = kind === 'video' ? (getVideoSpec(best.id)?.durationDefault || durations[0] || 5) : null;
    const dm = text.match(/(\d{1,2})\s*(?:s|sec|seconds)\b/i);
    if (kind === 'video' && dm) {
        const want = Number(dm[1]);
        duration = durations.reduce((a, b) => (Math.abs(b - want) < Math.abs(a - want) ? b : a), durations[0]);
    }
    const ar = /vertical|9:16|tiktok|reel|portrait orientation|portrait mode/i.test(text) ? '9:16' : /square|1:1/i.test(text) ? '1:1' : '16:9';

    return {
        plan: {
            kind,
            model: best.id,
            modelName: best.name || best.label || best.id,
            prompt: optimized,
            aspect_ratio: best.aspects?.includes(ar) ? ar : (best.aspects?.[0] || '16:9'),
            resolution: best.resolutionDefault || best.resolutions?.[0] || '',
            duration,
            generate_audio: true,
        },
        note: `Here's my plan — ${best.name || best.label} for a ${style.label.toLowerCase()} ${kind}. You can edit the prompt or settings before it runs.`,
    };
}

export function modelById(id) {
    return uniq([...t2iModels, ...i2iModels, ...t2vModels, ...i2vModels, ...lipsyncModels]).find(m => m.id === id) || null;
}
