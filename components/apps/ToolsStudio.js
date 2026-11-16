'use client';

import { useEffect, useMemo, useState } from 'react';
import { useUpload, useRun, FilePicker, RunStatus } from './shared';
import VOICES from './voices.json';

// Each tool is a Kie.ai model: exact model name (slug), the files and text it needs, and its
// options. Field names and allowed values come from Kie.ai's API specs (docs.kie.ai).
const photo = (field, label = 'Photo', array = false) => ({ field, kind: 'image', label, array });
const video = (field, label = 'Video', array = false) => ({ field, kind: 'video', label, array });
const audio = (field, label = 'Audio') => ({ field, kind: 'audio', label });
const text = (field, label, placeholder, opts = {}) => ({ field, kind: 'text', label, placeholder, required: true, rows: 3, ...opts });
const pick = (field, label, values, def, suffix = '') => ({
  field, kind: 'select', label, def,
  options: values.map((v) => (typeof v === 'object' ? v : { value: v, label: `${v}${suffix}` })),
});

const CATEGORIES = [
  { id: 'photo', label: 'Photo' },
  { id: 'video', label: 'Video' },
  { id: 'audio', label: 'Audio & Music' },
];

const TOOLS = [
  // ── Photo ──────────────────────────────────────────────────────────────────
  { id: 'upscale', cat: 'photo', out: 'image', icon: '🔍', name: 'Upscale Photo', slug: 'kie/image-upscale',
    desc: 'Enlarge up to 8× and restore detail. Text stays readable.',
    inputs: [photo('image_url'), pick('upscale_factor', 'Size', ['2', '4', '8'], '2', '×')] },
  { id: 'topaz', cat: 'photo', out: 'image', icon: '💎', name: 'Topaz Upscale', slug: 'topaz/image-upscale',
    desc: 'Pro-grade sharpening and enlarging powered by Topaz.',
    inputs: [photo('image_url'), pick('upscale_factor', 'Size', ['2', '4'], '2', '×')] },
  { id: 'crisp', cat: 'photo', out: 'image', icon: '✨', name: 'Crisp Upscale', slug: 'recraft/crisp-upscale',
    desc: 'Cleaner, crisper edges by Recraft. Great for faces and graphics.',
    inputs: [photo('image')] },
  { id: 'rembg', cat: 'photo', out: 'image', icon: '✂️', name: 'Remove Background', slug: 'recraft/remove-background',
    desc: 'Cut out the subject and get a transparent background.',
    inputs: [photo('image')] },
  { id: 'character', cat: 'photo', out: 'image', icon: '🧑‍🎤', name: 'Same Person, New Scene', slug: 'ideogram/character',
    desc: 'Give one photo of a person, describe a new scene, and get them in it with the same face.',
    inputs: [
      photo('reference_image_urls', 'Photo of the person', true),
      text('prompt', 'New scene', 'e.g. hiking on a mountain trail at sunrise, smiling at the camera'),
      pick('style', 'Style', [{ value: 'AUTO', label: 'Auto' }, { value: 'REALISTIC', label: 'Realistic' }, { value: 'FICTION', label: 'Illustrated' }], 'AUTO'),
      pick('image_size', 'Shape', [{ value: 'square_hd', label: 'Square' }, { value: 'portrait_4_3', label: 'Portrait' }, { value: 'landscape_16_9', label: 'Wide' }], 'square_hd'),
    ] },

  // ── Video ──────────────────────────────────────────────────────────────────
  { id: 'motion', cat: 'video', out: 'video', icon: '🕺', name: 'Motion Control', slug: 'kling-3.0/motion-control',
    desc: 'Make the person in a photo copy the moves from any video (dances, gestures, acting).',
    inputs: [
      photo('input_urls', 'Photo of the person', true),
      video('video_urls', 'Video with the moves to copy', true),
      pick('mode', 'Quality', ['720p', '1080p'], '720p'),
    ],
    fixed: { character_orientation: 'video' } },
  { id: 'swap', cat: 'video', out: 'video', icon: '🎭', name: 'Character Swap', slug: 'wan/2-2-animate-replace',
    desc: 'Replace the person in a video with the person from a photo. Files up to 10 MB.',
    inputs: [video('video_url', 'Video'), photo('image_url', 'Photo of the new person'), pick('resolution', 'Quality', ['480p', '580p', '720p'], '720p')] },
  { id: 'vedit', cat: 'video', out: 'video', icon: '🪄', name: 'Edit Video with Words', slug: 'wan/2-7-videoedit',
    desc: 'Describe a change (new outfit, weather, style) and apply it to a 2–10 second clip.',
    inputs: [
      video('video_url', 'Video (2–10 seconds)'),
      text('prompt', 'What to change', 'e.g. make it snow, change the jacket to red leather'),
      pick('resolution', 'Quality', ['720p', '1080p'], '1080p'),
    ] },
  { id: 'transition', cat: 'video', out: 'video', icon: '🔀', name: 'Photo-to-Photo Transition', slug: 'pixverse-v6/transition',
    desc: 'Give a first and a last photo and get a smooth video that morphs between them.',
    inputs: [
      photo('first_frame_image_url', 'First photo'),
      photo('last_frame_image_url', 'Last photo'),
      text('prompt', 'How it should move', 'e.g. smooth cinematic morph, camera slowly pushes in'),
      pick('quality', 'Quality', ['540p', '720p', '1080p'], '720p'),
      pick('duration', 'Length', [5, 8, 10], 5, 's'),
    ] },
  { id: 'vupscale', cat: 'video', out: 'video', icon: '📺', name: 'Upscale Video', slug: 'video/upscale',
    desc: 'Make a video sharper: 1080p, 2K or 4K. Keeps sound and frame rate.',
    inputs: [video('video_url'), pick('resolution', 'Quality', ['1080P', '2K', '4K'], '2K')] },
  { id: 'topazv', cat: 'video', out: 'video', icon: '🎞️', name: 'Topaz Video Upscale', slug: 'topaz/video-upscale',
    desc: 'Enlarge and clean up video with Topaz.',
    inputs: [video('video_url'), pick('upscale_factor', 'Size', ['2', '4'], '2', '×')] },

  // ── Audio & music ──────────────────────────────────────────────────────────
  { id: 'music', cat: 'audio', out: 'audio', icon: '🎶', name: 'Make a Song', slug: 'ai-music-api/generate',
    desc: 'Suno writes and performs a full song from your idea. You get two versions.',
    inputs: [
      text('prompt', 'What the song is about', 'e.g. a birthday song for Grandma Rosa who loves gardening'),
      text('style', 'Music style', 'e.g. upbeat pop, acoustic guitar, mariachi', { rows: 1 }),
      pick('instrumental', 'Vocals', [{ value: false, label: 'With singing' }, { value: true, label: 'Instrumental' }], false),
    ],
    fixed: { custom_mode: false, model: 'V6' } },
  { id: 'tts', cat: 'audio', out: 'audio', icon: '🗣️', name: 'Text to Speech', slug: 'elevenlabs/text-to-speech-turbo-2-5',
    desc: 'Turn typed words into a natural voice with ElevenLabs. Use the result in Lip Sync.',
    inputs: [
      text('text', 'What to say', 'Type up to 5,000 characters', { rows: 5 }),
      { field: 'voice', kind: 'dropdown', label: 'Voice', def: VOICES[0].value, options: VOICES },
    ] },
  { id: 'isolate', cat: 'audio', out: 'audio', icon: '🎙️', name: 'Clean Up Voice', slug: 'elevenlabs/audio-isolation',
    desc: 'Remove background noise and music from a recording, keeping just the voice. Up to 10 MB.',
    inputs: [audio('audio_url', 'Recording')] },
];

const ACCEPT = { image: 'image/*', video: 'video/*', audio: 'audio/*' };

// One upload box. It keeps its own upload state and reports the uploaded file's URL.
function UploadField({ apiKey, kind, label, onChange }) {
  const upload = useUpload(apiKey);
  useEffect(() => { onChange(upload.url || null); }, [upload.url]); // eslint-disable-line react-hooks/exhaustive-deps
  return (
    <FilePicker
      accept={ACCEPT[kind]}
      upload={upload}
      isVideo={kind === 'video'}
      isAudio={kind === 'audio'}
      label={label}
      hint="Click or drag a file here"
    />
  );
}

const defaultsFor = (tool) =>
  Object.fromEntries(tool.inputs.filter((i) => i.def !== undefined).map((i) => [i.field, i.def]));

export default function ToolsStudio({ apiKey, onResult }) {
  const [cat, setCat] = useState('photo');
  const [toolId, setToolId] = useState(TOOLS[0].id);
  const tool = TOOLS.find((t) => t.id === toolId);
  const [values, setValues] = useState(() => defaultsFor(tool));
  // Uploaded file URLs by slot ("image-0", "video-0"…), so a photo carries over between photo tools.
  const [files, setFiles] = useState({});
  const runner = useRun(apiKey, onResult);

  const uploadSlots = useMemo(() => {
    const seen = {};
    return tool.inputs.filter((i) => ACCEPT[i.kind]).map((i) => {
      seen[i.kind] = (seen[i.kind] || 0) + 1;
      return { ...i, slot: `${i.kind}-${seen[i.kind] - 1}` };
    });
  }, [tool]);

  const choose = (t) => {
    setToolId(t.id);
    setValues(defaultsFor(t));
    runner.reset();
  };
  const chooseCat = (id) => {
    setCat(id);
    choose(TOOLS.find((t) => t.cat === id));
  };

  const ready =
    uploadSlots.every((s) => files[s.slot]) &&
    tool.inputs.every((i) => i.kind !== 'text' || !i.required || (values[i.field] || '').trim());

  const go = () => {
    const input = { ...(tool.fixed || {}) };
    for (const s of uploadSlots) input[s.field] = s.array ? [files[s.slot]] : files[s.slot];
    for (const i of tool.inputs) {
      if (ACCEPT[i.kind]) continue;
      const v = i.kind === 'text' ? (values[i.field] || '').trim() : values[i.field];
      if (v !== '' && v !== undefined) input[i.field] = v;
    }
    runner.run({ slug: tool.slug, input, type: tool.out === 'image' ? 'tool' : `tool-${tool.out}`, label: tool.name });
  };

  const set = (field, v) => setValues((prev) => ({ ...prev, [field]: v }));

  return (
    <div className="h-full overflow-y-auto custom-scrollbar">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6">
        <h1 className="text-white text-2xl font-black tracking-wide uppercase">Tools</h1>
        <p className="text-white/40 text-sm mt-1 mb-4">Pro tools for photos, videos, voices and music. Results are saved to My Outputs.</p>

        <div className="flex gap-2 mb-4">
          {CATEGORIES.map((c) => (
            <button
              key={c.id}
              onClick={() => chooseCat(c.id)}
              className={`px-4 py-2 rounded-full text-sm ${cat === c.id ? 'bg-[#d9ff00] text-black font-semibold' : 'bg-white/5 text-white/60 hover:text-white'}`}
            >
              {c.label}
            </button>
          ))}
        </div>

        <div className="grid lg:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)] gap-6">
          <div className="grid grid-cols-2 gap-3 content-start">
            {TOOLS.filter((t) => t.cat === cat).map((t) => (
              <button
                key={t.id}
                onClick={() => choose(t)}
                className={`text-left rounded-2xl border p-4 transition-colors ${
                  t.id === toolId ? 'border-[#d9ff00] bg-[#d9ff00]/5' : 'border-white/5 bg-[#111] hover:border-white/20'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="text-xl">{t.icon}</span>
                  <span className="text-white font-semibold text-sm">{t.name}</span>
                </div>
                <p className="text-white/40 text-xs mt-2 leading-relaxed">{t.desc}</p>
              </button>
            ))}
          </div>

          <div className="flex flex-col gap-4">
            {uploadSlots.length > 0 && (
              <div className={`grid gap-3 ${uploadSlots.length > 1 ? 'sm:grid-cols-2' : ''}`}>
                {uploadSlots.map((s) => (
                  <div key={s.slot}>
                    {uploadSlots.length > 1 && <p className="text-white/50 text-xs mb-1.5">{s.label}</p>}
                    <UploadField
                      apiKey={apiKey}
                      kind={s.kind}
                      label={uploadSlots.length > 1 ? 'Choose a file' : `Choose a ${s.kind === 'image' ? 'photo' : s.kind === 'video' ? 'video' : 'recording'}`}
                      onChange={(url) => setFiles((prev) => ({ ...prev, [s.slot]: url }))}
                    />
                  </div>
                ))}
              </div>
            )}

            {tool.inputs.filter((i) => !ACCEPT[i.kind]).map((i) => (
              <div key={`${tool.id}-${i.field}`}>
                {i.kind === 'text' && (
                  <label className="block">
                    <span className="text-white/50 text-sm">{i.label}</span>
                    <textarea
                      rows={i.rows}
                      value={values[i.field] || ''}
                      onChange={(e) => set(i.field, e.target.value)}
                      placeholder={i.placeholder}
                      className="mt-1.5 w-full rounded-xl bg-white/5 border border-white/10 px-3 py-2 text-white text-sm placeholder:text-white/25 focus:outline-none focus:border-[#d9ff00]/60 resize-y"
                    />
                  </label>
                )}
                {i.kind === 'select' && (
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-white/50 text-sm mr-1">{i.label}</span>
                    {i.options.map((o) => (
                      <button
                        key={String(o.value)}
                        onClick={() => set(i.field, o.value)}
                        className={`px-3 py-1.5 rounded-full text-sm ${
                          o.value === values[i.field] ? 'bg-[#d9ff00] text-black font-semibold' : 'bg-white/5 text-white/60 hover:text-white'
                        }`}
                      >
                        {o.label}
                      </button>
                    ))}
                  </div>
                )}
                {i.kind === 'dropdown' && (
                  <label className="block">
                    <span className="text-white/50 text-sm">{i.label}</span>
                    <select
                      value={values[i.field]}
                      onChange={(e) => set(i.field, e.target.value)}
                      className="mt-1.5 w-full rounded-xl bg-[#161616] border border-white/10 px-3 py-2 text-white text-sm focus:outline-none focus:border-[#d9ff00]/60"
                    >
                      {i.options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                    </select>
                  </label>
                )}
              </div>
            ))}

            <button
              onClick={go}
              disabled={!ready || runner.running}
              className="w-full py-3 rounded-xl bg-[#d9ff00] text-black font-bold disabled:opacity-30 disabled:cursor-not-allowed hover:brightness-110"
            >
              {runner.running ? 'Working…' : `Run ${tool.name}`}
            </button>
            <RunStatus runner={runner} waitingText={tool.out === 'image' ? 'Processing…' : 'Working on it, this can take a few minutes…'} />
          </div>
        </div>
      </div>
    </div>
  );
}
