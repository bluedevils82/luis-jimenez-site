// Assistant: a chat agent that plans generations with the app's own models,
// presets and workflows, optimizes the prompt, and — once the user approves
// the plan — runs it through the same bridge the studios use (results land
// in the Library the normal way). Falls back to a deterministic local
// planner (src/lib/agent.js) when the AI chat backend cannot be reached.
import { kie } from '../lib/kie.js';
import { chatWithAgent, parsePlan, localPlan, detectKind, modelById, modelAcceptsImages, estimateTime, timeLabel } from '../lib/agent.js';
import { loadPricing, estimateCredits, priceInfo } from '../lib/modelSort.js';
import { getVideoSpec, advancedFieldsFor } from '../lib/videoSpecs.js';
import { createSetupPanel } from './SetupPanel.js';
import { VIDEO_STYLES, fitInfo, lockInstruction } from '../lib/modelStyles.js';
import { listLibrary, sessionAccount } from '../lib/api.js';
import { startGenerationJob, getPendingJobs, removePendingJob } from '../lib/pendingJobs.js';
import { esc } from '../lib/resultCards.js';

const STARTERS = [
    'A cinematic product video of my coffee brand for Instagram',
    'A realistic portrait photo, warm studio light',
    'A cartoon-style video of a cat astronaut, 5 seconds',
    'What can Seedance 2.0 do that Kling cannot?',
];

export function AssistantStudio() {
    const container = document.createElement('div');
    container.className = 'w-full h-full flex flex-col items-center bg-app-bg relative p-4 md:p-6 overflow-y-auto custom-scrollbar';

    const history = []; // { role, text } — text is the plain chat text (no plan block)
    let mode = 'ai'; // 'ai' | 'local' — decided by the first chat call
    let modeNoticeShown = false;
    let busy = false;
    let pendingBrief = null; // local mode: brief waiting on the image/video answer
    // Composer working set: uploaded / Library-picked files. Persists across
    // sends until the user removes a chip.
    const attachments = []; // { id, kind: 'image'|'video'|'audio', name, url, thumb, uploading }
    let attachSeq = 0;
    // Relevance gate: intent first (image/video), then workflow. Composer
    // options only appear when the current selection can actually use them.
    let intent = null; // 'image' | 'video'
    let workflow = null; // 'scratch' | 'edit' | 'animate' | 'refs' | 'talking'
    let planGate = null; // model-level gate from the latest plan card: { noImages, noAudio }
    let libKinds = ['image']; // kinds the Library popover may attach right now
    // Media panel (character / items / files) collapse state. The panel
    // auto-opens and auto-closes on relevance triggers (mediaTrigger); a
    // manual toggle flips mediaOpen and sets mediaManual, which holds until
    // the next trigger re-evaluates. refreshGates() never touches this —
    // it only gates the controls INSIDE the panel.
    let mediaOpen = false;
    let mediaManual = false;
    let lastPlanAcceptsImages = null; // latest plan card's model image capability
    let uploadAsk = false; // the latest assistant reply asked for an upload
    let locksWereActive = false; // lock-entry transition detection for onSetupChanged
    const mediaUI = { panel: null, body: null, files: null, summary: null, toggle: null, toggleText: null, chevron: null };

    // --- Header ---
    const hero = document.createElement('div');
    hero.className = 'assistant-hero flex flex-col items-center mb-10 md:mb-20 animate-fade-in-up transition-all duration-700 text-center';
    hero.innerHTML = `
        <div class="mb-10 relative group">
            <div class="absolute inset-0 bg-primary/20 blur-[100px] rounded-full opacity-40 group-hover:opacity-70 transition-opacity duration-1000"></div>
            <div class="relative w-24 h-24 md:w-32 md:h-32 bg-primary/5 rounded-3xl flex items-center justify-center border border-white/5 overflow-hidden">
                <svg width="80" height="80" viewBox="0 0 24 24" fill="currentColor" class="text-primary opacity-20 absolute -right-4 -bottom-4"><path d="M12 2l1.8 5.2L19 9l-5.2 1.8L12 16l-1.8-5.2L5 9l5.2-1.8L12 2z"/></svg>
                <div class="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center border border-primary/20 shadow-glow relative z-10">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor" class="text-primary"><path d="M12 2l1.8 5.2L19 9l-5.2 1.8L12 16l-1.8-5.2L5 9l5.2-1.8L12 2z"/><path d="M18.5 14.5l.9 2.6 2.6.9-2.6.9-.9 2.6-.9-2.6-2.6-.9 2.6-.9.9-2.6z"/></svg>
                </div>
                <div class="absolute top-4 right-4 text-primary animate-pulse">✨</div>
            </div>
        </div>
        <h1 class="text-2xl sm:text-4xl md:text-7xl font-black text-white tracking-widest uppercase mb-4 selection:bg-primary selection:text-black text-center px-4">Assistant</h1>
        <p class="text-secondary text-sm font-medium tracking-wide opacity-60 max-w-xl">Tell me what you want to make. I'll pick the model, set it up, rewrite your prompt, and generate it for you.</p>
        <span id="agent-mode" class="mt-3 text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full border border-white/10 text-secondary">AI planner</span>
    `;
    container.appendChild(hero);

    // --- Messages ---
    const thread = document.createElement('div');
    thread.className = 'w-full max-w-3xl flex flex-col gap-4 flex-1';
    container.appendChild(thread);

    const scrollDown = () => requestAnimationFrame(() => { container.scrollTop = container.scrollHeight; });

    function addBubble(role, text) {
        const row = document.createElement('div');
        row.className = `flex ${role === 'user' ? 'justify-end' : 'justify-start items-end gap-2'} animate-fade-in-up`;
        if (role === 'assistant') {
            const avatar = document.createElement('span');
            avatar.className = 'w-7 h-7 rounded-full bg-primary/15 border border-primary/40 flex items-center justify-center text-primary shrink-0';
            avatar.innerHTML = '<svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l1.8 5.2L19 9l-5.2 1.8L12 16l-1.8-5.2L5 9l5.2-1.8L12 2z"/><path d="M18.5 14.5l.9 2.6 2.6.9-2.6.9-.9 2.6-.9-2.6-2.6-.9 2.6-.9.9-2.6z"/></svg>';
            row.appendChild(avatar);
        }
        const bubble = document.createElement('div');
        bubble.className = role === 'user'
            ? 'max-w-[85%] bg-primary text-black font-medium text-sm leading-relaxed px-4 py-3 rounded-2xl rounded-br-md whitespace-pre-wrap'
            : 'max-w-[85%] bg-card-bg border border-white/10 text-white/90 text-sm leading-relaxed px-4 py-3 rounded-2xl rounded-bl-md whitespace-pre-wrap';
        bubble.textContent = text;
        row.appendChild(bubble);
        thread.appendChild(row);
        scrollDown();
        return bubble;
    }

    function addNote(text) {
        const note = document.createElement('div');
        note.className = 'text-center text-[11px] text-secondary/80 py-1';
        note.textContent = text;
        thread.appendChild(note);
        scrollDown();
    }

    // Billing help: when Kie blocks work over credits/balance, don't leave
    // the user with a raw error — give them the top-up page directly.
    const KIE_BILLING_URL = 'https://kie.ai/billing';
    function isBillingError(e) {
        const s = `${e?.code || ''} ${e?.status || ''} ${String(e?.message || e || '')}`;
        return /insufficient|credit|balance|billing|payment|quota|\b402\b/i.test(s);
    }
    function addBillingBubble(lead) {
        const bubble = addBubble('assistant', lead);
        bubble.append(document.createElement('br'));
        const a = document.createElement('a');
        a.href = KIE_BILLING_URL;
        a.target = '_blank';
        a.rel = 'noopener noreferrer';
        a.className = 'text-primary font-bold underline break-all';
        a.textContent = 'Top up at kie.ai/billing →';
        bubble.append(a);
        const tail = document.createElement('span');
        tail.textContent = ' Add credits there, or enable auto top-up so this doesn\'t stop you mid-project. (Your API key itself is managed at kie.ai/api-key.)';
        bubble.append(tail);
        history.push({ role: 'assistant', text: `${lead} Top-up page: ${KIE_BILLING_URL}` });
        return bubble;
    }

    // In-chat placeholder while a generation runs in the background queue.
    function addGenerating(plan) {
        const row = document.createElement('div');
        row.className = 'flex items-center gap-3 bg-card-bg border border-white/10 rounded-2xl px-4 py-3 animate-fade-in-up';
        row.innerHTML = `<span class="w-5 h-5 shrink-0 border-2 border-primary border-t-transparent rounded-full animate-spin"></span>
            <span class="text-xs text-white/80 leading-relaxed">Generating your ${esc(plan.kind)} with <b>${esc(plan.modelName || plan.model || '')}</b> — it keeps running in the background and lands in your Library. Keep chatting, or open the Library and I'll dock to the side.</span>`;
        thread.appendChild(row);
        scrollDown();
        return row;
    }

    // --- Plan card ---
    function addPlanCard(plan) {
        const model = modelById(plan.model);
        const planFit = fitInfo(plan.model);
        const acceptsImgs = modelAcceptsImages(plan.model, plan.kind);
        const card = document.createElement('div');
        card.className = 'bg-card-bg border border-primary/30 rounded-2xl p-3.5 md:p-5 flex flex-col gap-3 animate-fade-in-up shadow-3xl';

        const title = document.createElement('div');
        title.innerHTML = `<div class="text-[10px] font-bold uppercase tracking-widest text-primary">Plan — ready when you are</div>
            <div class="text-white font-black text-base mt-1">${esc(plan.kind === 'video' ? '🎬' : '🖼️')} ${esc(plan.modelName)} <span class="text-secondary font-bold text-xs">(${esc(plan.model)})</span></div>`;
        card.appendChild(title);

        const promptLabel = document.createElement('label');
        promptLabel.className = 'text-[10px] font-bold uppercase tracking-widest text-secondary';
        promptLabel.textContent = 'Optimized prompt (edit freely)';
        card.appendChild(promptLabel);
        const promptBox = document.createElement('textarea');
        promptBox.className = 'w-full bg-black/40 border border-white/10 rounded-xl p-3 text-sm text-white leading-relaxed outline-none focus:border-primary/60 resize-y min-h-[90px]';
        promptBox.value = plan.prompt;
        card.appendChild(promptBox);

        // Settings selects, limited to what this model actually supports.
        const settings = document.createElement('div');
        settings.className = 'flex flex-wrap gap-2';
        const mkSelect = (label, values, current) => {
            const wrap = document.createElement('label');
            wrap.className = 'flex items-center gap-2 bg-black/40 border border-white/10 rounded-xl px-3 py-2 min-h-[42px]';
            wrap.innerHTML = `<span class="text-[10px] font-bold uppercase tracking-widest text-secondary">${esc(label)}</span>`;
            const sel = document.createElement('select');
            sel.className = 'bg-transparent text-sm font-bold text-white outline-none min-h-[42px] [&>option]:bg-[#141414]';
            (values || []).forEach(v => {
                const opt = document.createElement('option');
                opt.value = v; opt.textContent = label === 'Duration' ? `${v}s` : v;
                if (String(v) === String(current)) opt.selected = true;
                sel.appendChild(opt);
            });
            wrap.appendChild(sel);
            settings.appendChild(wrap);
            return sel;
        };
        const arSel = mkSelect('Ratio', model?.aspects || [plan.aspect_ratio], plan.aspect_ratio);
        const resSel = model?.resolutions?.length ? mkSelect('Quality', model.resolutions, plan.resolution) : null;
        let durSel = null;
        if (plan.kind === 'video') {
            const durations = getVideoSpec(plan.model)?.durations || model?.durations || [plan.duration || 5];
            durSel = mkSelect('Duration', durations, plan.duration || durations[0]);
        }
        card.appendChild(settings);

        // Estimated cost from the live price list — same numbers the agent
        // reasons over. Recomputes when quality/duration change.
        const costLine = document.createElement('div');
        costLine.className = 'text-[11px] font-bold text-secondary';
        costLine.textContent = 'Before you start — checking cost & time…';
        card.appendChild(costLine);
        // Pre-flight numbers: the cost uses the SAME estimator as the studios
        // (measured per-resolution prices first, then published rates), and
        // latestCredits is passed with the job on Generate, like they do.
        let latestCredits = null;
        let paintPreflight = () => {};
        const refreshCost = async () => {
            await loadPricing();
            const m = modelById(plan.model);
            const sel = { duration: durSel?.value || plan.duration, resolution: resSel?.value || plan.resolution };
            latestCredits = m ? estimateCredits(m, sel) : null;
            const info = m ? priceInfo(m, sel.resolution) : null;
            const t = estimateTime({ ...plan, duration: sel.duration, resolution: sel.resolution });
            const costTxt = latestCredits != null
                ? `${info?.from ? 'from ' : '≈ '}${latestCredits} credits (~$${(latestCredits * 0.005).toFixed(2)})`
                : 'cost not published for this model';
            costLine.textContent = `Before you start — cost: ${costTxt} · typically takes ${timeLabel(t)}`;
            paintPreflight(costTxt, t);
        };
        refreshCost();
        resSel?.addEventListener('change', refreshCost);
        durSel?.addEventListener('change', refreshCost);

        // Attachments / locks summary — reads the CURRENT working set (setup
        // panel + composer attachments) at render time.
        {
            const st = setup.getState();
            const fit = fitInfo(plan.model);
            const refsCapable = (fit?.refs || 0) > 0;
            // Tell the setup panel this model's photo limit for its counter line.
            setup.setLimit(fit?.refs ? { max: fit.refs, model: plan.modelName } : null);
            if (st.refs.length || attachments.length) {
                const box = document.createElement('div');
                box.className = 'flex flex-col gap-1 bg-black/30 border border-white/10 rounded-xl px-3 py-2.5';
                const head = document.createElement('div');
                head.className = 'text-[10px] font-bold uppercase tracking-widest text-secondary';
                head.textContent = 'Attachments';
                box.appendChild(head);
                const line = (text, warn = false) => {
                    const d = document.createElement('div');
                    d.className = `text-[11px] leading-relaxed ${warn ? 'text-amber-400' : 'text-white/70'}`;
                    d.textContent = text;
                    box.appendChild(d);
                };
                const lockNames = [...st.characters, ...st.items].filter(x => x.count).map(x => `${x.name} ×${x.count}`).join(', ');
                line(`Reference photos: ${st.refs.length}${lockNames ? ` (${lockNames})` : ''}`);
                if (st.refs.length && !refsCapable) {
                    line('This model can\'t use reference photos — they\'ll be ignored. Ask me for one with reference support.', true);
                }
                if (!acceptsImgs) {
                    line("This model doesn't take images — uploads are off for it.", true);
                }
                const imgCount = attachments.filter(a => a.kind === 'image').length;
                const audioCount = attachments.filter(a => a.kind === 'audio').length;
                const videoCount = attachments.filter(a => a.kind === 'video').length;
                if (imgCount) line(`Attached images: ${imgCount} — sent as references.`);
                if (plan.kind === 'video' && imgCount) line('First attached image will be the start frame (unless you add a start image below).');
                if (audioCount) {
                    const isSeedance = String(plan.model).startsWith('bytedance/seedance');
                    if (!isSeedance && !fit?.voice) line(`Audio: ${audioCount} attached — this model won't use audio, so it will be ignored.`, true);
                    else line(`Audio: ${audioCount} attached — sent with the generation.`);
                }
                if (videoCount) {
                    const hasRefVideo = [...advancedFieldsFor(plan.model, false), ...advancedFieldsFor(plan.model, true)]
                        .some(f => f.key === 'reference_video_urls');
                    line(hasRefVideo
                        ? `Video references: ${videoCount} — this model accepts them, they'll be passed.`
                        : 'Video references: only some models use them; if this model can\'t, they\'re ignored.');
                }
                card.appendChild(box);
            }
        }

        // Optional start/reference image — only rendered when this model
        // actually takes images; otherwise a plain note replaces the slot.
        let imageUrl = null;
        if (!acceptsImgs) {
            const noImg = document.createElement('div');
            noImg.className = 'text-[11px] leading-relaxed text-amber-400';
            noImg.textContent = "This model doesn't take images — uploads are off for it.";
            card.appendChild(noImg);
        } else {
        const attachRow = document.createElement('div');
        attachRow.className = 'flex items-center gap-3';
        const attachBtn = document.createElement('button');
        attachBtn.type = 'button';
        attachBtn.className = 'min-h-[42px] inline-flex items-center text-xs font-bold px-3.5 py-2 rounded-xl bg-white/5 border border-white/10 text-white/80 hover:border-primary/50 hover:text-white active:scale-95 transition-all';
        attachBtn.textContent = plan.kind === 'video' ? '＋ Add a start image (optional)' : '＋ Add a reference image (optional)';
        const attachState = document.createElement('span');
        attachState.className = 'text-[11px] text-secondary';
        const fileInput = document.createElement('input');
        fileInput.type = 'file'; fileInput.accept = 'image/*'; fileInput.className = 'hidden';
        attachBtn.onclick = () => fileInput.click();
        fileInput.onchange = async () => {
            const file = fileInput.files?.[0];
            if (!file) return;
            attachBtn.disabled = true; attachState.textContent = 'Uploading…';
            try {
                imageUrl = await kie.uploadFile(file);
                attachState.textContent = `Attached: ${file.name}`;
                attachBtn.textContent = 'Change image';
            } catch (e) {
                attachState.textContent = `Upload failed: ${e.message.slice(0, 60)}`;
            } finally { attachBtn.disabled = false; }
        };
        attachRow.append(attachBtn, attachState, fileInput);
        card.appendChild(attachRow);
        }

        // Actions.
        const actions = document.createElement('div');
        actions.className = 'flex items-center gap-3 pt-1';
        const goBtn = document.createElement('button');
        goBtn.type = 'button';
        goBtn.className = 'min-h-[44px] px-6 py-2.5 bg-primary text-black font-black text-sm uppercase tracking-wide rounded-xl hover:shadow-glow hover:scale-105 active:scale-95 transition-all disabled:opacity-40 disabled:hover:scale-100';
        goBtn.textContent = 'Generate ✨';
        const dismissBtn = document.createElement('button');
        dismissBtn.type = 'button';
        dismissBtn.className = 'min-h-[44px] px-3 inline-flex items-center text-xs font-bold text-secondary hover:text-white transition-colors';
        dismissBtn.textContent = 'Not now';
        dismissBtn.onclick = () => { card.remove(); planGate = null; lastPlanAcceptsImages = null; refreshGates(); addNote('Plan dismissed — tell me what to change, or describe something new.'); };
        const status = document.createElement('span');
        status.className = 'text-[11px] text-secondary';
        actions.append(goBtn, dismissBtn, status);
        card.appendChild(actions);
        // The Generate button itself carries the pre-flight numbers.
        paintPreflight = (costTxt, t) => {
            goBtn.textContent = latestCredits != null
                ? `Generate · ${costTxt.split(' (~')[0]} · ${timeLabel(t)}`
                : 'Generate ✨';
        };
        refreshCost();

        goBtn.onclick = () => {
            const finalPlan = {
                ...plan,
                prompt: promptBox.value.trim(),
                aspect_ratio: arSel.value,
                resolution: resSel ? resSel.value : plan.resolution,
                duration: durSel ? Number(durSel.value) : plan.duration,
            };
            if (latestCredits != null) finalPlan.estimatedCredits = latestCredits;
            if (!finalPlan.prompt) { status.textContent = 'Add a prompt first.'; return; }

            // Working set: locked character/item photos + attached files.
            const st = setup.getState();
            if (st.uploading || attachments.some(a => a.uploading)) {
                status.textContent = 'Files are still uploading — wait a moment, then Generate.';
                return;
            }
            const fit = fitInfo(finalPlan.model);
            const acceptsImgs = modelAcceptsImages(finalPlan.model, finalPlan.kind);
            const refs = acceptsImgs && (fit?.refs || 0) > 0 ? st.refs.slice(0, fit.refs || 9) : [];
            const manualImage = acceptsImgs ? imageUrl : null;
            const finalPrompt = [finalPlan.prompt, lockInstruction(st.characters, st.items), st.style !== 'any' ? st.styleHint : ''].filter(Boolean).join(' ');
            const attachedImages = acceptsImgs ? attachments.filter(a => a.kind === 'image' && a.url).map(a => a.url) : [];
            const attachedAudio = attachments.filter(a => a.kind === 'audio' && a.url).map(a => a.url);
            const attachedVideos = attachments.filter(a => a.kind === 'video' && a.url).map(a => a.url);
            const imagesList = finalPlan.kind === 'image'
                ? [...new Set([...refs, ...attachedImages, ...(manualImage ? [manualImage] : [])])].slice(0, 9)
                : [];
            const startImage = finalPlan.kind === 'video' ? (manualImage || attachedImages[0] || null) : null;
            const isSeedance = String(finalPlan.model).startsWith('bytedance/seedance');
            const audioUrls = attachedAudio.length && (isSeedance || fit?.voice) ? attachedAudio.slice(0, 3) : [];
            const hasRefVideoField = finalPlan.kind === 'video' && attachedVideos.length > 0
                && [...advancedFieldsFor(finalPlan.model, false), ...advancedFieldsFor(finalPlan.model, true)]
                    .some(f => f.key === 'reference_video_urls');
            const videoUrls = hasRefVideoField ? attachedVideos.slice(0, 3) : [];

            goBtn.disabled = true; dismissBtn.disabled = true;
            status.textContent = `Queued${latestCredits != null ? ` — cost ≈ ${latestCredits} cr` : ''} · typically ${timeLabel(estimateTime(finalPlan))}. Running in the background; the result shows up here and in your Library.`;

            // Run through the shared background queue (same mechanism the
            // studios use): the job is registered in the pending-jobs store,
            // so it keeps going while the chat is docked beside the Library,
            // its result lands in the Library via the bridge, and it can be
            // resumed by a later Assistant mount even if this chat closed.
            const historyMeta = {
                prompt: finalPrompt, model: finalPlan.model, modelName: finalPlan.modelName,
                kind: finalPlan.kind, aspect_ratio: finalPlan.aspect_ratio,
                duration: finalPlan.duration, resolution: finalPlan.resolution,
            };
            if (finalPlan.estimatedCredits) historyMeta.estimatedCredits = finalPlan.estimatedCredits;
            if (imagesList.length) historyMeta.images_list = imagesList;
            if (finalPlan.kind === 'video' && refs.length) historyMeta.reference_urls = refs;
            if (audioUrls.length) historyMeta.reference_audio_urls = audioUrls;
            if (videoUrls.length) historyMeta.reference_video_urls = videoUrls;
            if (startImage) historyMeta.image_url = startImage;
            const genRow = addGenerating(finalPlan);
            const failInChat = (e) => {
                genRow.remove();
                status.textContent = `Failed: ${String(e.message || e).slice(0, 110)}`;
                goBtn.disabled = false; dismissBtn.disabled = false;
                if (isBillingError(e)) addBillingBubble('That generation was blocked — your Kie.ai balance is too low to run it.');
            };
            const run = (queueRequest) => {
                const onRequestId = queueRequest;
                if (finalPlan.kind === 'image') {
                    return imagesList.length
                        ? kie.generateI2I({ model: finalPlan.model, prompt: finalPrompt, images_list: imagesList, image_url: imagesList[0], aspect_ratio: finalPlan.aspect_ratio, resolution: finalPlan.resolution, onRequestId, ...(finalPlan.estimatedCredits ? { estimatedCredits: finalPlan.estimatedCredits } : {}) })
                        : kie.generateImage({ model: finalPlan.model, prompt: finalPrompt, aspect_ratio: finalPlan.aspect_ratio, resolution: finalPlan.resolution, onRequestId, ...(finalPlan.estimatedCredits ? { estimatedCredits: finalPlan.estimatedCredits } : {}) });
                }
                const params = { model: finalPlan.model, prompt: finalPrompt, aspect_ratio: finalPlan.aspect_ratio, resolution: finalPlan.resolution, duration: finalPlan.duration, advanced: { generate_audio: finalPlan.generate_audio !== false }, onRequestId, ...(finalPlan.estimatedCredits ? { estimatedCredits: finalPlan.estimatedCredits } : {}) };
                if (refs.length) params.reference_urls = refs;
                if (audioUrls.length) params.reference_audio_urls = audioUrls;
                if (videoUrls.length) params.advanced = { ...params.advanced, reference_video_urls: videoUrls };
                return startImage ? kie.generateI2V({ ...params, image_url: startImage }) : kie.generateVideo(params);
            };
            startGenerationJob(
                { studioType: 'assistant', historyMeta, maxAttempts: 900, interval: 2000 },
                run,
                {
                    onDone: (res) => {
                        genRow.remove();
                        if (!res?.url) { status.textContent = 'Finished without a result URL.'; goBtn.disabled = false; dismissBtn.disabled = false; return; }
                        card.remove();
                        planGate = null; lastPlanAcceptsImages = null; refreshGates();
                        addResult(finalPlan, res.url);
                        history.push({ role: 'assistant', text: `Generated a ${finalPlan.kind} with ${finalPlan.modelName}. It is saved in the Library.` });
                    },
                    onFail: failInChat,
                }
            ).catch(failInChat);
        };

        // This card is now the latest plan: its model's capabilities gate
        // the composer (attach buttons) until a new message is sent, the
        // card is dismissed, or the generation completes.
        planGate = {
            noImages: !acceptsImgs,
            noAudio: plan.kind === 'image' ? true : !(String(plan.model).startsWith('bytedance/seedance') || !!planFit?.voice),
        };
        refreshGates();
        lastPlanAcceptsImages = acceptsImgs;
        mediaTrigger(); // trigger: plan rendered (a no-image model closes the panel)

        thread.appendChild(card);
        scrollDown();
    }

    function addResult(plan, url) {
        const wrap = document.createElement('div');
        wrap.className = 'bg-card-bg border border-white/10 rounded-2xl p-3 flex flex-col gap-3 animate-fade-in-up';
        const media = plan.kind === 'video'
            ? Object.assign(document.createElement('video'), { src: url, controls: true, playsInline: true, className: 'w-full rounded-xl max-h-[420px] bg-black' })
            : Object.assign(document.createElement('img'), { src: url, alt: plan.prompt, className: 'w-full rounded-xl max-h-[420px] object-contain bg-black' });
        wrap.appendChild(media);
        const meta = document.createElement('div');
        meta.className = 'flex items-center justify-between gap-3 px-1';
        meta.innerHTML = `<span class="text-[11px] text-secondary font-bold">${esc(plan.modelName)} · ${esc(plan.aspect_ratio)}${plan.kind === 'video' ? ` · ${esc(String(plan.duration))}s` : ''} — saved to your Library</span>`;
        const libBtn = document.createElement('button');
        libBtn.type = 'button';
        libBtn.className = 'text-[11px] font-black text-primary hover:text-white transition-colors whitespace-nowrap';
        libBtn.textContent = 'Open Library →';
        libBtn.onclick = () => window.dispatchEvent(new CustomEvent('navigate', { detail: { page: 'library' } }));
        meta.appendChild(libBtn);
        wrap.appendChild(meta);
        thread.appendChild(wrap);
        addBubble('assistant', 'Done! Want a variation, a different look, or something new?');
        scrollDown();
    }

    // --- Shot setup: Look + Character/Item locks (the shared SetupPanel) ---
    const setup = createSetupPanel({ styles: VIDEO_STYLES, onChange: onSetupChanged, withSound: false });
    const setupBox = document.createElement('div');
    setupBox.className = 'px-3 pt-1';
    const setupLabel = document.createElement('div');
    setupLabel.className = 'text-[10px] font-bold uppercase tracking-widest text-secondary px-2 pb-2';
    setupLabel.textContent = 'ADD CHARACTER / ITEMS · LOOK';
    setupBox.append(setupLabel, setup.element);
    setupBox.classList.add('hidden'); // refreshGates() gates it inside the panel body

    // --- Media panel: ONE collapsible container for the setup box + the ---
    // --- composer attach row/chips, with an always-there header bar.     ---
    const mediaPanel = document.createElement('div');
    mediaPanel.className = 'w-full max-w-3xl mt-4 bg-panel-bg/90 backdrop-blur-xl border border-white/10 rounded-[1.5rem] shadow-3xl';
    const mediaHeader = document.createElement('div');
    mediaHeader.className = 'flex items-center gap-2 min-h-[44px] pl-4 pr-2 py-1';
    const mediaTitle = document.createElement('span');
    mediaTitle.className = 'text-[10px] font-bold uppercase tracking-widest text-secondary shrink-0';
    mediaTitle.textContent = 'CHARACTER · ITEMS · FILES';
    const mediaSummary = document.createElement('span');
    mediaSummary.className = 'text-[11px] font-bold text-white/70 truncate min-w-0 flex-1';
    mediaSummary.textContent = 'Nothing attached';
    const mediaToggle = document.createElement('button');
    mediaToggle.type = 'button';
    mediaToggle.className = 'ml-auto shrink-0 min-w-[40px] min-h-[40px] px-3 rounded-full bg-white/5 border border-white/10 text-white/80 text-[11px] font-black uppercase tracking-wide flex items-center justify-center gap-1 hover:border-primary/50 hover:text-white active:scale-95 transition-all';
    mediaToggle.setAttribute('aria-expanded', 'false');
    mediaToggle.setAttribute('aria-label', 'Toggle character, items and files panel');
    const mediaToggleText = document.createElement('span');
    mediaToggleText.textContent = 'Open';
    const mediaChevron = document.createElement('span');
    mediaChevron.textContent = '▸';
    mediaToggle.append(mediaToggleText, mediaChevron);
    mediaToggle.onclick = () => {
        mediaOpen = !mediaOpen;
        mediaManual = true; // holds until the next relevance trigger
        applyMediaPanel();
    };
    mediaHeader.append(mediaTitle, mediaSummary, mediaToggle);
    const mediaBody = document.createElement('div');
    mediaBody.className = 'flex flex-col';
    const mediaFiles = document.createElement('div');
    mediaFiles.className = 'px-3 pb-3 pt-1 flex flex-col gap-2';
    mediaBody.append(setupBox, mediaFiles);
    mediaPanel.append(mediaHeader, mediaBody);
    mediaPanel.classList.add('hidden'); // hidden until an intent is chosen
    mediaBody.classList.add('hidden'); // fresh chat starts collapsed
    container.appendChild(mediaPanel);
    Object.assign(mediaUI, { panel: mediaPanel, body: mediaBody, files: mediaFiles, summary: mediaSummary, toggle: mediaToggle, toggleText: mediaToggleText, chevron: mediaChevron });
    applyMediaPanel();

    // --- Media panel state machine ----------------------------------------
    function setupHasEntries() {
        const st = setup.getState();
        return st.characters.length > 0 || st.items.length > 0;
    }

    function updateMediaSummary() {
        if (!mediaUI.summary) return;
        const st = setup.getState();
        const bits = [];
        if (attachments.length) bits.push(`${attachments.length} file${attachments.length === 1 ? '' : 's'}`);
        if (st.characters.length) bits.push(`Character: ${st.characters.map(c => c.name).join(', ')}`);
        if (st.items.length) bits.push(`Item: ${st.items.map(i => i.name).join(', ')}`);
        mediaUI.summary.textContent = bits.length ? bits.join(' · ') : 'Nothing attached';
    }

    // Relevant = the chat can actually use media right now: a media
    // workflow is picked, files are attached, a character/item lock has
    // entries, the latest plan's model takes images, or the assistant just
    // asked for an upload. A no-image plan model overrides back to closed
    // when the user has no material loaded.
    function relevanceNow() {
        if (planGate?.noImages && !attachments.length && !setupHasEntries()) return false;
        if (['edit', 'animate', 'refs', 'talking'].includes(workflow)) return true;
        if (attachments.length) return true;
        if (setupHasEntries()) return true;
        if (lastPlanAcceptsImages) return true;
        if (uploadAsk) return true;
        return false;
    }

    function applyMediaPanel() {
        if (!mediaUI.panel) return;
        mediaUI.panel.classList.toggle('hidden', !intent);
        mediaUI.body.classList.toggle('hidden', !mediaOpen);
        mediaUI.toggle.setAttribute('aria-expanded', String(mediaOpen));
        mediaUI.toggleText.textContent = mediaOpen ? 'Minimize' : 'Open';
        mediaUI.chevron.textContent = mediaOpen ? '▾' : '▸';
        updateMediaSummary();
    }

    // A relevance trigger: the manual override clears and the open state
    // is re-evaluated from the current chat state.
    function mediaTrigger() {
        mediaManual = false;
        mediaOpen = relevanceNow();
        applyMediaPanel();
    }

    // SetupPanel changes: keep the header summary fresh, and treat a lock
    // switching ON (entries appearing) as a relevance trigger.
    function onSetupChanged() {
        if (!mediaUI.summary) return; // panel not built yet (construction-time calls)
        updateMediaSummary();
        const active = setupHasEntries();
        if (active && !locksWereActive) mediaTrigger();
        locksWereActive = active;
    }

    // Assistant replies: if the latest one asks for an upload/attach,
    // that is a relevance trigger.
    function noteAssistantReply(text) {
        uploadAsk = /upload|attach/i.test(text || '');
        if (uploadAsk) mediaTrigger();
    }

    // --- Composer attachments: uploads + Library picks (the working set) ---
    const attachChipsRow = document.createElement('div');
    attachChipsRow.className = 'hidden flex-wrap gap-1.5';
    const attachRow = document.createElement('div');
    attachRow.className = 'items-center gap-2 flex-wrap hidden'; // refreshGates() toggles flex/hidden

    function renderAttachChips() {
        attachChipsRow.innerHTML = '';
        attachChipsRow.classList.toggle('hidden', !attachments.length);
        attachChipsRow.classList.toggle('flex', !!attachments.length);
        attachments.forEach(a => {
            const chipEl = document.createElement('span');
            chipEl.className = 'flex items-center gap-1.5 bg-white/5 border border-white/10 rounded-full py-1 pl-1 pr-2';
            if (a.kind === 'audio') {
                const ic = document.createElement('span');
                ic.className = 'w-6 h-6 rounded-full bg-primary/15 text-primary flex items-center justify-center text-[11px] shrink-0';
                ic.textContent = '♪';
                chipEl.appendChild(ic);
            } else {
                const media = document.createElement(a.kind === 'video' ? 'video' : 'img');
                media.src = a.thumb || a.url;
                if (a.kind === 'video') { media.muted = true; media.playsInline = true; media.preload = 'metadata'; }
                media.className = 'w-6 h-6 rounded-full object-cover bg-black shrink-0';
                chipEl.appendChild(media);
            }
            const nm = document.createElement('span');
            nm.className = 'text-[10px] font-bold text-white/80 max-w-[90px] truncate';
            nm.textContent = a.name;
            chipEl.appendChild(nm);
            if (a.uploading) {
                const sp = document.createElement('span');
                sp.className = 'w-3 h-3 shrink-0 border-2 border-primary border-t-transparent rounded-full animate-spin';
                chipEl.appendChild(sp);
            }
            const x = document.createElement('button');
            x.type = 'button';
            x.className = 'w-7 h-7 min-w-[28px] min-h-[28px] shrink-0 flex items-center justify-center text-white/50 hover:text-white text-sm leading-none';
            x.textContent = '×';
            x.title = 'Remove';
            x.onclick = () => {
                const i = attachments.indexOf(a);
                if (i >= 0) attachments.splice(i, 1);
                if (a.thumb?.startsWith('blob:')) URL.revokeObjectURL(a.thumb);
                renderAttachChips();
            };
            chipEl.appendChild(x);
            attachChipsRow.appendChild(chipEl);
        });
        updateMediaSummary();
    }

    async function addFiles(kind, files) {
        for (const file of files) {
            const entry = {
                id: ++attachSeq, kind, name: file.name, url: '',
                thumb: kind === 'audio' ? '' : URL.createObjectURL(file), uploading: true,
            };
            attachments.push(entry);
            renderAttachChips();
            mediaTrigger(); // an attachment was added: media is relevant now
            try {
                entry.url = kind === 'video' ? await kie.uploadVideo(file) : await kie.uploadFile(file);
                entry.uploading = false;
            } catch (e) {
                const i = attachments.indexOf(entry);
                if (i >= 0) attachments.splice(i, 1);
                if (entry.thumb?.startsWith('blob:')) URL.revokeObjectURL(entry.thumb);
                addBubble('assistant', `Upload failed: ${file.name} — ${String(e.message || e).slice(0, 80)}`);
            }
            renderAttachChips();
        }
    }

    const ATTACH_BTN = 'min-h-[42px] px-3.5 text-[13px] font-bold rounded-xl bg-white/5 border border-white/10 text-white/70 hover:border-primary/50 hover:text-white active:scale-95 transition-all inline-flex items-center justify-center';
    function fileButton(label, kind, accept, multiple) {
        const b = document.createElement('button');
        b.type = 'button';
        b.className = ATTACH_BTN;
        b.textContent = label;
        const inp = document.createElement('input');
        inp.type = 'file'; inp.accept = accept; inp.multiple = !!multiple; inp.className = 'hidden';
        b.appendChild(inp);
        b.onclick = (e) => { if (e.target !== inp) inp.click(); };
        inp.onclick = (e) => e.stopPropagation();
        inp.onchange = () => {
            const fs = Array.from(inp.files || []);
            inp.value = '';
            if (fs.length) addFiles(kind, fs);
        };
        return b;
    }
    // No ⬆ Video button: no current workflow/model path consumes video
    // references through the app, so it is not offered. (Video-kind
    // attachments stay supported in code — the Library path handles them.)
    const imgBtn = fileButton('⬆ Image', 'image', 'image/*', true);
    const audBtn = fileButton('⬆ Audio', 'audio', 'audio/*', false);
    attachRow.append(imgBtn, audBtn);

    // Library picker popover (opens upward — the composer sits at the bottom).
    const libWrap = document.createElement('div');
    libWrap.className = 'relative';
    const libBtn = document.createElement('button');
    libBtn.type = 'button';
    libBtn.className = ATTACH_BTN;
    libBtn.textContent = '▤ Library';
    const libPop = document.createElement('div');
    libPop.className = 'hidden absolute bottom-[115%] left-0 z-[70] w-72 max-h-80 overflow-y-auto custom-scrollbar bg-card-bg border border-white/10 rounded-2xl p-2 shadow-3xl';
    libWrap.append(libBtn, libPop);
    document.addEventListener('click', (e) => { if (!libWrap.contains(e.target)) libPop.classList.add('hidden'); });
    libBtn.onclick = async (e) => {
        e.stopPropagation();
        if (!libPop.classList.contains('hidden')) { libPop.classList.add('hidden'); return; }
        libPop.classList.remove('hidden');
        libPop.innerHTML = '<div class="text-xs text-secondary p-3">Loading your Library…</div>';
        try {
            const items = await listLibrary();
            libPop.innerHTML = '';
            if (!items.length) {
                libPop.innerHTML = '<div class="text-xs text-secondary p-3">Your Library is empty — everything you generate lands here.</div>';
                return;
            }
            // Only kinds the current gate allows are listed. In video
            // workflows videos are listed but cannot be attached — no
            // current model consumes video references.
            const visibleItems = items.filter(item => libKinds.includes(item.kind === 'videos' ? 'video' : 'image'));
            if (!visibleItems.length) {
                libPop.innerHTML = '<div class="text-xs text-secondary p-3">Nothing in your Library fits this creation type yet.</div>';
                return;
            }
            visibleItems.slice(0, 40).forEach(item => {
                const kind = item.kind === 'videos' ? 'video' : 'image';
                const rowB = document.createElement('button');
                rowB.type = 'button';
                rowB.className = 'w-full flex items-center gap-3 p-2 rounded-xl hover:bg-white/5 text-left';
                rowB.innerHTML = `<img src="${esc(item.thumb || item.url || '')}" class="w-10 h-10 rounded-lg object-cover bg-black shrink-0" alt=""><span class="flex flex-col min-w-0"><span class="text-xs font-bold text-white truncate">${kind === 'video' ? '🎬 Video' : '🖼️ Image'}${item.model ? ` · ${esc(item.model)}` : ''}</span><span class="text-[10px] text-secondary truncate">${kind === 'video' ? 'Video references aren\'t supported yet' : esc(item.prompt || '')}</span></span>`;
                rowB.onclick = (ev) => {
                    ev.stopPropagation();
                    libPop.classList.add('hidden');
                    if (kind === 'video') {
                        addBubble('assistant', 'Video references aren\'t supported by the current models yet — pick an image instead, or just describe the video you want to make.');
                        return;
                    }
                    attachments.push({ id: ++attachSeq, kind, name: 'Library item', url: item.url, thumb: item.thumb || item.url, uploading: false });
                    renderAttachChips();
                    mediaTrigger(); // an attachment was added: media is relevant now
                };
                libPop.appendChild(rowB);
            });
        } catch (err) {
            libPop.innerHTML = '';
            const m = document.createElement('div');
            m.className = 'text-xs text-[#ff6b6b] p-3';
            m.textContent = `Could not load Library: ${err.message}`;
            libPop.appendChild(m);
        }
    };
    attachRow.appendChild(libWrap);

    // --- Selection status line: current intent · workflow, with Change ---
    const gateLine = document.createElement('div');
    gateLine.className = 'w-full max-w-3xl mt-3 hidden items-center justify-between gap-3 bg-panel-bg/60 border border-white/5 rounded-full pl-4 pr-2 py-1.5';
    const gateLineText = document.createElement('span');
    gateLineText.className = 'text-[11px] font-bold text-white/80 truncate min-w-0';
    const gateChangeBtn = document.createElement('button');
    gateChangeBtn.type = 'button';
    gateChangeBtn.className = 'min-h-[36px] px-3 inline-flex items-center shrink-0 text-[11px] font-black text-primary hover:text-white transition-colors';
    gateChangeBtn.textContent = 'Change';
    gateChangeBtn.onclick = () => {
        intent = null; workflow = null; planGate = null;
        lastPlanAcceptsImages = null; uploadAsk = false;
        updateGateLine(); refreshGates(); mediaTrigger(); showIntentCards();
        input.focus();
    };
    gateLine.append(gateLineText, gateChangeBtn);
    container.appendChild(gateLine);

    // --- Input bar ---
    const bar = document.createElement('div');
    bar.className = 'w-full max-w-3xl sticky bottom-0 pt-3 pb-1';
    const barInner = document.createElement('div');
    barInner.className = 'bg-panel-bg/90 backdrop-blur-xl border border-white/10 rounded-[1.5rem] p-3 flex flex-col gap-2 shadow-3xl';
    const input = document.createElement('textarea');
    input.className = 'flex-1 min-w-0 bg-transparent text-white text-base leading-relaxed outline-none resize-none max-h-32 placeholder:text-secondary/60 px-2 py-3 min-h-[46px]';
    input.placeholder = 'Describe what you want to make…';
    input.rows = 1;
    const sendBtn = document.createElement('button');
    sendBtn.type = 'button';
    sendBtn.className = 'min-h-[46px] px-5 py-2.5 bg-primary text-black font-black text-sm uppercase tracking-wide rounded-xl hover:shadow-glow hover:scale-105 active:scale-95 transition-all disabled:opacity-40 disabled:hover:scale-100 shrink-0';
    sendBtn.textContent = 'Send';
    const inputRow = document.createElement('div');
    inputRow.className = 'flex items-end gap-3';
    inputRow.append(input, sendBtn);
    // The chips + attach row live in the collapsible media panel now;
    // the sticky composer bar carries only the input row.
    mediaUI.files.append(attachChipsRow, attachRow);
    barInner.append(inputRow);
    bar.appendChild(barInner);
    container.appendChild(bar);

    // Starter chips.
    const chips = document.createElement('div');
    chips.className = 'assistant-starters w-full max-w-3xl flex flex-wrap gap-2 justify-center mt-3';
    STARTERS.forEach(s => {
        const chip = document.createElement('button');
        chip.type = 'button';
        chip.className = 'text-[11px] font-bold px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-white/70 hover:border-primary/50 hover:text-white transition-all';
        chip.textContent = s;
        chip.onclick = () => { input.value = s; send(); };
        chips.appendChild(chip);
    });
    container.appendChild(chips);

    // --- Intent gate: image or video first, then the workflow --------------
    const WORKFLOWS = {
        image: [
            { id: 'scratch', label: 'From scratch', next: 'Perfect — describe the image in your own words. No uploads needed; I\'ll write the prompt and pick the model.' },
            { id: 'edit', label: 'Edit my photo', next: 'Upload the photo you want to edit (⬆ Image or ▤ Library below), then tell me what to change.' },
            { id: 'refs', label: 'Keep character / product the same', next: 'Add your character or item in the panel below — a saved character or uploaded photos — then describe the new image. I\'ll keep them looking the same.' },
        ],
        video: [
            { id: 'scratch', label: 'From scratch', next: 'Perfect — describe the video in your own words. No uploads needed; I\'ll write the prompt and pick the model.' },
            { id: 'animate', label: 'Animate a photo', next: 'Upload the photo you want to animate (⬆ Image or ▤ Library below), then describe how it should move.' },
            { id: 'refs', label: 'Character / product video', next: 'Add your character or item in the panel below — a saved character or uploaded photos — then describe the video. I\'ll keep them looking the same.' },
            { id: 'talking', label: 'Talking / voiceover', next: 'Attach a portrait photo and/or an audio clip below (⬆ Image / ⬆ Audio / ▤ Library), then tell me what it should say — or describe the talking scene.' },
        ],
    };

    let intentCardsEl = null;
    function removeIntentCards() { intentCardsEl?.remove(); intentCardsEl = null; }

    function showIntentCards() {
        removeIntentCards();
        intentCardsEl = document.createElement('div');
        intentCardsEl.className = 'flex gap-3 animate-fade-in-up';
        const mk = (kind, emoji, label, sub) => {
            const b = document.createElement('button');
            b.type = 'button';
            b.className = 'flex-1 min-h-[76px] bg-card-bg border border-white/10 hover:border-primary/60 hover:bg-primary/5 rounded-2xl p-5 flex flex-col items-center justify-center gap-1.5 text-center transition-all active:scale-[0.98]';
            b.innerHTML = `<span class="text-3xl">${emoji}</span><span class="text-white font-black text-sm">${label}</span><span class="text-[11px] text-secondary leading-snug">${sub}</span>`;
            b.onclick = () => chooseIntent(kind);
            return b;
        };
        intentCardsEl.append(
            mk('image', '🖼️', 'Create an image', 'Portraits, posters, product shots, artwork'),
            mk('video', '🎬', 'Create a video', 'Clips, animations, ads, reels'),
        );
        thread.appendChild(intentCardsEl);
        scrollDown();
    }

    function chooseIntent(kind) {
        intent = kind; workflow = null; planGate = null;
        removeIntentCards();
        addBubble('user', kind === 'image' ? 'Image' : 'Video');
        history.push({ role: 'user', text: kind === 'image' ? 'Image' : 'Video' });
        const ask = kind === 'image' ? 'Great — what kind of image?' : 'Great — what kind of video?';
        addBubble('assistant', ask);
        history.push({ role: 'assistant', text: ask });
        showWorkflowChips(kind);
        updateGateLine();
        refreshGates();
        mediaTrigger(); // trigger: intent chosen
    }

    function showWorkflowChips(kind) {
        const rowEl = document.createElement('div');
        rowEl.className = 'flex flex-wrap gap-2 animate-fade-in-up';
        WORKFLOWS[kind].forEach(w => {
            const chip = document.createElement('button');
            chip.type = 'button';
            chip.className = 'min-h-[40px] px-4 inline-flex items-center text-[12px] font-bold rounded-full bg-white/5 border border-white/10 text-white/70 hover:border-primary/50 hover:text-white active:scale-95 transition-all';
            chip.textContent = w.label;
            chip.onclick = () => { rowEl.remove(); chooseWorkflow(w); };
            rowEl.appendChild(chip);
        });
        thread.appendChild(rowEl);
        scrollDown();
    }

    function chooseWorkflow(w) {
        workflow = w.id;
        addBubble('user', w.label);
        history.push({ role: 'user', text: w.label });
        addBubble('assistant', w.next);
        history.push({ role: 'assistant', text: w.next });
        updateGateLine();
        refreshGates();
        mediaTrigger(); // trigger: workflow chosen (scratch closes, media workflows open)
        input.focus();
    }

    function updateGateLine() {
        gateLine.classList.toggle('hidden', !intent);
        gateLine.classList.toggle('flex', !!intent);
        if (!intent) return;
        const wfLabel = workflow ? (WORKFLOWS[intent] || []).find(w => w.id === workflow)?.label : '';
        gateLineText.textContent = `${intent === 'video' ? '🎬 Video' : '🖼 Image'}${wfLabel ? ` · ${wfLabel}` : ''}`;
    }

    function setBtnState(btn, visible, disabled) {
        btn.classList.toggle('hidden', !visible);
        btn.disabled = !visible || disabled;
        btn.classList.toggle('opacity-40', visible && disabled);
        btn.classList.toggle('pointer-events-none', visible && disabled);
    }

    // Single place that shows/enables composer options: intent/workflow
    // visibility first, then the latest plan's model-level gate on top.
    function refreshGates() {
        let showSetup = false, showAttach = false, showImage = false, showAudio = false, showLib = false;
        if (intent) {
            showSetup = workflow !== 'scratch';
            if (workflow === 'scratch') {
                // Text-only workflow: no uploads at all.
            } else if (workflow === 'talking') {
                showAttach = showImage = showAudio = showLib = true;
            } else if (workflow) { // edit / animate / refs
                showAttach = showImage = showLib = true;
            } else if (intent === 'video') { // intent only, no workflow yet
                showAttach = showImage = showAudio = showLib = true;
            } else {
                showAttach = showImage = showLib = true;
            }
        }
        setupBox.classList.toggle('hidden', !showSetup);
        attachRow.classList.toggle('hidden', !showAttach);
        attachRow.classList.toggle('flex', showAttach);
        setBtnState(imgBtn, showImage, !!planGate?.noImages);
        setBtnState(audBtn, showAudio, !!planGate?.noAudio);
        setBtnState(libBtn, showLib, !!planGate?.noImages);
        libKinds = intent === 'video' ? ['image', 'video'] : ['image'];
    }

    function setModeBadge() {
        const badge = hero.querySelector('#agent-mode');
        if (badge) {
            badge.textContent = mode === 'ai' ? 'AI planner' : 'Built-in planner (AI chat unavailable)';
            badge.classList.toggle('text-primary', mode === 'local');
            badge.classList.toggle('border-primary/40', mode === 'local');
        }
    }

    function answerLocally(text) {
        // Local planner: one clarifying question at most, then a plan.
        const sel = { intent, workflow };
        if (pendingBrief) {
            const out = localPlan(pendingBrief, sel);
            pendingBrief = null;
            if (out.plan) { addBubble('assistant', out.note); addPlanCard(out.plan); history.push({ role: 'assistant', text: out.note }); return; }
        }
        const out = localPlan(text, sel);
        if (out.needs === 'kind') {
            pendingBrief = text;
            addBubble('assistant', out.question);
            history.push({ role: 'assistant', text: out.question });
            noteAssistantReply(out.question);
            return;
        }
        if (out.plan) { addBubble('assistant', out.note); addPlanCard(out.plan); history.push({ role: 'assistant', text: out.note }); }
        else { addBubble('assistant', out.question || 'Tell me a bit more about what you want to make.'); noteAssistantReply(out.question || ''); }
    }

    // Compact manifest of the working set, appended to the outgoing message
    // (the model sees it; the user bubble shows chips instead of the raw text).
    function buildManifest() {
        const parts = [];
        const ready = attachments.filter(a => a.url);
        if (ready.length) {
            const counts = ['image', 'video', 'audio'].map(k => {
                const n = ready.filter(a => a.kind === k).length;
                return n ? `${n} ${k}${k !== 'audio' && n !== 1 ? 's' : ''}` : '';
            }).filter(Boolean).join(', ');
            parts.push(`Attached files: ${counts} (names: ${ready.map(a => a.name).join(', ')})`);
        }
        const st = setup.getState();
        st.characters.filter(c => c.count).forEach(c => parts.push(`Character lock: "${c.name}" (${c.count} photo${c.count === 1 ? '' : 's'})`));
        st.items.filter(i => i.count).forEach(i => parts.push(`Item lock: "${i.name}" (${i.count} photo${i.count === 1 ? '' : 's'})`));
        if (st.style !== 'any') parts.push(`Look: ${st.styleLabel}`);
        return parts.length ? `[${parts.join('. ')}.]` : '';
    }

    // User bubble: typed text + a compact chips row (attachments + lock summary).
    function addUserTurn(text) {
        const bubble = addBubble('user', text);
        const st = setup.getState();
        const lockBits = [
            ...st.characters.filter(c => c.count).map(c => `👤 ${c.name}`),
            ...st.items.filter(i => i.count).map(i => `📦 ${i.name}`),
            ...(st.style !== 'any' ? [`Look: ${st.styleLabel}`] : []),
        ];
        if (!attachments.length && !lockBits.length) return;
        const wrap = document.createElement('div');
        wrap.className = 'mt-2 flex flex-wrap items-center gap-1';
        attachments.forEach(a => {
            const c = document.createElement('span');
            c.className = 'flex items-center gap-1 bg-black/20 rounded-full py-0.5 pl-0.5 pr-2';
            if (a.kind === 'audio') {
                const ic = document.createElement('span');
                ic.className = 'w-5 h-5 rounded-full bg-black/30 flex items-center justify-center text-[10px] shrink-0';
                ic.textContent = '♪';
                c.appendChild(ic);
            } else {
                const media = document.createElement(a.kind === 'video' ? 'video' : 'img');
                media.src = a.thumb || a.url;
                if (a.kind === 'video') { media.muted = true; media.playsInline = true; media.preload = 'metadata'; }
                media.className = 'w-5 h-5 rounded-full object-cover bg-black shrink-0';
                c.appendChild(media);
            }
            const nm = document.createElement('span');
            nm.className = 'text-[9px] font-bold max-w-[70px] truncate';
            nm.textContent = a.name;
            c.appendChild(nm);
            wrap.appendChild(c);
        });
        if (lockBits.length) {
            const s = document.createElement('span');
            s.className = 'text-[9px] font-bold opacity-80';
            s.textContent = lockBits.join(' · ');
            wrap.appendChild(s);
        }
        bubble.appendChild(wrap);
        scrollDown();
    }

    async function send() {
        const text = input.value.trim();
        if (!text || busy) return;
        // New turn: the previous plan's model-level gate lifts, back to
        // workflow-level gates until a new plan renders.
        planGate = null;
        // No intent picked yet: infer it from the words (video words ->
        // video, otherwise image) and proceed at the intent level.
        const hadIntent = !!intent;
        if (!intent) {
            intent = detectKind(text) || 'image';
            workflow = null;
            removeIntentCards();
            updateGateLine();
        }
        refreshGates();
        if (!hadIntent) mediaTrigger(); // trigger: intent inferred from the message
        input.value = '';
        busy = true; sendBtn.disabled = true; sendBtn.textContent = '…';
        const manifest = buildManifest();
        addUserTurn(text);
        history.push({ role: 'user', text: manifest ? `${text} ${manifest}` : text });

        if (mode === 'local') { answerLocally(text); busy = false; sendBtn.disabled = false; sendBtn.textContent = 'Send'; return; }

        const thinking = addBubble('assistant', 'Thinking…');
        try {
            const reply = await chatWithAgent(history, { intent, workflow });
            const { cleanText, plan } = parsePlan(reply, { intent, workflow });
            thinking.textContent = cleanText || (plan ? 'Here\'s my plan:' : '…');
            history.push({ role: 'assistant', text: cleanText || 'Proposed a generation plan.' });
            noteAssistantReply(cleanText || ''); // trigger if the reply asks for an upload
            if (plan) addPlanCard(plan);
        } catch (e) {
            mode = 'local';
            setModeBadge();
            thinking.remove();
            if (isBillingError(e)) addBillingBubble('The AI chat just hit a Kie.ai billing limit on your account.');
            if (!modeNoticeShown) {
                modeNoticeShown = true;
                addNote(`AI chat is unavailable right now (${e.message.slice(0, 80)}) — I've switched to the built-in planner. It still picks models and writes prompts, just without the conversation.`);
            }
            answerLocally(text);
        } finally {
            busy = false; sendBtn.disabled = false; sendBtn.textContent = 'Send';
            input.focus();
        }
    }

    sendBtn.onclick = send;
    input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); }
    });

    addBubble('assistant', 'Hey! What are we making today — an image or a video? Describe it in your own words and I\'ll handle the model, settings and prompt.');

    // Fresh chat: the intent gate comes first.
    showIntentCards();

    // Low-balance heads-up, once per open: the backend session reports the
    // account's Kie credits, so warn before a generation gets blocked.
    // (Direct-key mode has no session to ask — the call just fails quietly.)
    sessionAccount().then(({ credits }) => {
        if (typeof credits === 'number' && credits < 150) {
            addBillingBubble(`Heads up — your Kie.ai balance is low (${credits} credits), so generations could start getting blocked soon.`);
        }
    }).catch(() => { /* no backend session: nothing to check */ });

    // Resume generations started in an earlier chat that are still running:
    // they kept going in the background (and into the Library) while this
    // chat was closed; pick their results up here, like the studios do.
    (async () => {
        const pending = getPendingJobs('assistant');
        if (!pending.length) return;
        addNote(`Picking up ${pending.length} background generation${pending.length > 1 ? 's' : ''} from before…`);
        for (const job of pending) {
            const meta = job.historyMeta || {};
            const plan = {
                kind: meta.kind || 'video', model: meta.model, modelName: meta.modelName || meta.model || '',
                prompt: meta.prompt || '', aspect_ratio: meta.aspect_ratio, duration: meta.duration, resolution: meta.resolution,
            };
            const row = addGenerating(plan);
            const elapsed = Math.floor((Date.now() - (job.submittedAt || Date.now())) / (job.interval || 2000));
            const attemptsLeft = Math.max(1, (job.maxAttempts || 900) - elapsed);
            try {
                const result = await kie.pollForResult(job.requestId, localStorage.getItem('kie_key'), attemptsLeft, job.interval || 2000);
                const url = result?.resultUrls?.[0] || result?.url || result?.output?.url;
                row.remove();
                if (url) addResult(plan, url);
                else addNote('A background generation finished without a result.');
            } catch (e) {
                row.remove();
                addNote(`A background generation failed: ${String(e.message || e).slice(0, 80)}`);
                if (isBillingError(e)) addBillingBubble('A background generation was blocked — your Kie.ai balance is too low.');
            } finally {
                removePendingJob(job.requestId);
            }
        }
    })();

    return container;
}
