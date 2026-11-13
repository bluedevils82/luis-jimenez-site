import { t2iModels, i2iModels, t2vModels, i2vModels, v2vModels, lipsyncModels } from './models.js';

const BASE_URL = 'https://api.kie.ai';
// Kie.ai serves file uploads from a separate host, not api.kie.ai.
const UPLOAD_URL = 'https://kieai.redpandaai.co/api/file-stream-upload';

async function getHeaders(apiKey) {
    return {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
    };
}

async function pollJobs(taskId, apiKey, maxAttempts = 900, interval = 2000) {
    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
        await new Promise(resolve => setTimeout(resolve, interval));
        try {
            const response = await fetch(`${BASE_URL}/api/v1/jobs/recordInfo?taskId=${encodeURIComponent(taskId)}`, {
                headers: await getHeaders(apiKey)
            });
            if (!response.ok) {
                const errText = await response.text();
                if (response.status >= 500) continue;
                throw new Error(`Poll Failed: ${response.status} - ${errText.slice(0, 200)}`);
            }
            const json = await response.json();
            if (json.code && json.code !== 200) {
                if (attempt === maxAttempts) throw new Error(`KIE Poll Error ${json.code}: ${json.msg}`);
                continue;
            }
            const data = json.data || {};
            const state = (data.state || '').toLowerCase();
            if (state === 'success') return data;
            if (state === 'fail' || state === 'error') {
                throw new Error(`Generation failed: ${data.failMsg || 'Unknown error'}`);
            }
        } catch (error) {
            if (attempt === maxAttempts) throw error;
        }
    }
    throw new Error('Generation timed out after polling.');
}

function extractResultUrl(data) {
    if (Array.isArray(data.resultUrls) && data.resultUrls.length) return data.resultUrls[0];
    if (data.response?.resultUrls?.length) return data.response.resultUrls[0];
    return null;
}

async function submitTask(apiKey, slug, input, onRequestId, maxAttempts = 60) {
    const response = await fetch(`${BASE_URL}/api/v1/jobs/createTask`, {
        method: 'POST',
        headers: await getHeaders(apiKey),
        body: JSON.stringify({ model: slug, input })
    });
    if (!response.ok) {
        const errText = await response.text();
        throw new Error(`API Request Failed: ${response.status} ${response.statusText} - ${errText.slice(0, 200)}`);
    }
    const json = await response.json();
    if (json.code && json.code !== 200) {
        throw new Error(`KIE Error ${json.code}: ${json.msg || 'Unknown error'}`);
    }
    const taskId = json.data?.taskId;
    if (!taskId) return json;
    if (onRequestId) onRequestId(taskId);
    const result = await pollJobs(taskId, apiKey, maxAttempts);
    const outputUrl = extractResultUrl(result) || result.url;
    return { ...result, url: outputUrl };
}

// ── Request building ─────────────────────────────────────────────────────────
// Every model in models.js carries a `kie` block generated from Kie.ai's API spec:
// the exact model name (slug), its input fields, which ones are required, and
// which field takes the uploaded image(s). Requests are built from that, so the
// model you pick is the model that runs.

const SPEAKING_PROMPT = 'A person speaking naturally to the camera.';

function coerce(field, value) {
    if (value === undefined || value === null || value === '') return undefined;
    if (field.enum) {
        const hit = field.enum.find(e => String(e).toLowerCase() === String(value).toLowerCase());
        return hit === undefined ? undefined : hit;
    }
    if (field.t === 'integer') { const n = parseInt(value, 10); return Number.isNaN(n) ? undefined : n; }
    if (field.t === 'number') { const n = Number(value); return Number.isNaN(n) ? undefined : n; }
    if (field.t === 'boolean') return Boolean(value);
    if (field.t === 'array') return Array.isArray(value) ? value : [value];
    return String(value);
}

export function buildKieInput(model, params) {
    const { fields, required, imageField, fixed } = model.kie;
    const input = { ...fixed };
    const set = (name, value) => {
        const field = fields[name];
        if (!field) return;
        const v = coerce(field, value);
        if (v !== undefined) input[name] = v;
    };

    set('prompt', params.prompt);
    const ins = model.inputs || {};
    if (ins.aspect_ratio) set(ins.aspect_ratio.name, params.aspect_ratio);
    if (ins.resolution) set(ins.resolution.name, params.resolution);
    set('quality', params.quality);
    set('duration', params.duration);
    set('mode', params.mode);
    if (params.seed !== undefined && params.seed !== -1) set('seed', params.seed);

    const images = params.images_list?.length ? params.images_list : (params.image_url ? [params.image_url] : []);
    if (imageField && images.length) {
        input[imageField] = fields[imageField].t === 'array' ? images : images[0];
    }
    if (params.video_url) {
        if (fields.video_url) input.video_url = params.video_url;
        else if (fields.video_urls) input.video_urls = [params.video_url];
    }
    if (params.audio_url && fields.audio_url) input.audio_url = params.audio_url;
    if (params.extra) Object.entries(params.extra).forEach(([k, v]) => set(k, v));

    // Fill anything Kie.ai requires that the UI didn't set, using the spec's defaults.
    for (const name of required) {
        if (input[name] !== undefined) continue;
        const field = fields[name] || {};
        if (field.def !== undefined) input[name] = field.def;
        else if (field.enum?.length) input[name] = field.enum[0];
        else if (field.t === 'boolean') input[name] = false;
        else if (name === 'prompt') input.prompt = SPEAKING_PROMPT;
    }
    return input;
}

function runModel(apiKey, list, params, maxAttempts) {
    const model = list.find(m => m.id === params.model);
    if (!model) throw new Error(`Model "${params.model}" is not available on Kie.ai.`);
    return submitTask(apiKey, model.kie.slug, buildKieInput(model, params), params.onRequestId, maxAttempts);
}

// Run any Kie.ai model by its exact name with a ready-made input (used by Tools and Effects).
export function runKieModel(apiKey, slug, input, maxAttempts = 900) {
    return submitTask(apiKey, slug, input, null, maxAttempts);
}

export async function generateImage(apiKey, params) {
    return runModel(apiKey, t2iModels, params, 150);
}

export async function generateI2I(apiKey, params) {
    return runModel(apiKey, i2iModels, params, 150);
}

export async function generateVideo(apiKey, params) {
    return runModel(apiKey, params.video_url ? v2vModels : t2vModels, params, 900);
}

export async function generateI2V(apiKey, params) {
    return runModel(apiKey, i2vModels, params, 900);
}

export async function processLipSync(apiKey, params) {
    if (!params.audio_url || !(params.image_url || params.video_url)) {
        throw new Error('LipSync requires both a source (image or video) and an audio file.');
    }
    return runModel(apiKey, lipsyncModels, params, 900);
}

export function uploadFile(apiKey, file, onProgress) {
    return new Promise((resolve, reject) => {
        const url = UPLOAD_URL;
        const formData = new FormData();
        formData.append('file', file);
        formData.append('uploadPath', 'open-higgsfield');
        formData.append('fileName', file.name);

        const xhr = new XMLHttpRequest();
        xhr.open('POST', url);
        xhr.setRequestHeader('Authorization', `Bearer ${apiKey}`);

        if (onProgress) {
            xhr.upload.onprogress = (event) => {
                if (event.lengthComputable) {
                    const percentComplete = Math.round((event.loaded / event.total) * 100);
                    onProgress(percentComplete);
                }
            };
        }

        xhr.onload = () => {
            if (xhr.status >= 200 && xhr.status < 300) {
                try {
                    const json = JSON.parse(xhr.responseText);
                    if (json.code && json.code !== 200) {
                        reject(new Error(`File upload failed: ${json.code} ${json.msg}`));
                        return;
                    }
                    const fileUrl = json.data?.fileUrl || json.data?.downloadUrl || json.data?.url || json.url;
                    if (!fileUrl) {
                        reject(new Error('No URL returned from file upload'));
                    } else {
                        resolve(fileUrl);
                    }
                } catch (e) {
                    reject(new Error('Failed to parse upload response'));
                }
            } else {
                reject(new Error(`File upload failed: ${xhr.status} - ${xhr.statusText}`));
            }
        };

        xhr.onerror = () => reject(new Error('Network error during file upload'));
        xhr.send(formData);
    });
}
