'use client';

import { useState } from 'react';
import { useUpload, useRun, FilePicker, RunStatus } from './shared';

// Each tool is a Kie.ai model with its exact name and input fields (from docs.kie.ai).
const TOOLS = [
  {
    id: 'upscale', icon: '🔍', name: 'Upscale Photo', video: false,
    desc: 'Enlarge up to 8× and restore detail. Text stays readable.',
    slug: 'kie/image-upscale', fileField: 'image_url',
    option: { field: 'upscale_factor', label: 'Size', values: ['2', '4', '8'], def: '2', suffix: '×' },
  },
  {
    id: 'topaz', icon: '💎', name: 'Topaz Upscale', video: false,
    desc: 'Pro-grade sharpening and enlarging powered by Topaz.',
    slug: 'topaz/image-upscale', fileField: 'image_url',
    option: { field: 'upscale_factor', label: 'Size', values: ['2', '4'], def: '2', suffix: '×' },
  },
  {
    id: 'crisp', icon: '✨', name: 'Crisp Upscale', video: false,
    desc: 'Cleaner, crisper edges by Recraft. Great for faces and graphics.',
    slug: 'recraft/crisp-upscale', fileField: 'image',
  },
  {
    id: 'rembg', icon: '✂️', name: 'Remove Background', video: false,
    desc: 'Cut out the subject and get a transparent background.',
    slug: 'recraft/remove-background', fileField: 'image',
  },
  {
    id: 'vupscale', icon: '📺', name: 'Upscale Video', video: true,
    desc: 'Make a video sharper: 1080p, 2K or 4K. Keeps sound and frame rate.',
    slug: 'video/upscale', fileField: 'video_url',
    option: { field: 'resolution', label: 'Quality', values: ['1080P', '2K', '4K'], def: '2K' },
  },
  {
    id: 'topazv', icon: '🎞️', name: 'Topaz Video Upscale', video: true,
    desc: 'Enlarge and clean up video with Topaz.',
    slug: 'topaz/video-upscale', fileField: 'video_url',
    option: { field: 'upscale_factor', label: 'Size', values: ['2', '4'], def: '2', suffix: '×' },
  },
];

export default function ToolsStudio({ apiKey, onResult }) {
  const [toolId, setToolId] = useState(TOOLS[0].id);
  const tool = TOOLS.find((t) => t.id === toolId);
  const [optionValue, setOptionValue] = useState(tool.option?.def);
  const upload = useUpload(apiKey);
  const runner = useRun(apiKey, onResult);

  const choose = (t) => {
    if (t.video !== tool.video) upload.clear();
    setToolId(t.id);
    setOptionValue(t.option?.def);
    runner.reset();
  };

  const go = () => {
    const input = { [tool.fileField]: upload.url };
    if (tool.option) input[tool.option.field] = optionValue;
    runner.run({ slug: tool.slug, input, type: tool.video ? 'tool-video' : 'tool', label: tool.name });
  };

  return (
    <div className="h-full overflow-y-auto custom-scrollbar">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6">
        <h1 className="text-white text-2xl font-black tracking-wide uppercase">Tools</h1>
        <p className="text-white/40 text-sm mt-1 mb-6">Quick fixes for photos and videos. Results are saved to My Outputs.</p>

        <div className="grid lg:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)] gap-6">
          <div className="grid grid-cols-2 gap-3 content-start">
            {TOOLS.map((t) => (
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
                  {t.video && <span className="ml-auto text-[10px] font-bold uppercase text-[#d9ff00]">Video</span>}
                </div>
                <p className="text-white/40 text-xs mt-2 leading-relaxed">{t.desc}</p>
              </button>
            ))}
          </div>

          <div className="flex flex-col gap-4">
            <FilePicker
              accept={tool.video ? 'video/*' : 'image/*'}
              upload={upload}
              isVideo={tool.video}
              label={tool.video ? 'Choose a video' : 'Choose a photo'}
              hint="Click or drag a file here"
            />
            {tool.option && (
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-white/50 text-sm mr-1">{tool.option.label}</span>
                {tool.option.values.map((v) => (
                  <button
                    key={v}
                    onClick={() => setOptionValue(v)}
                    className={`px-3 py-1.5 rounded-full text-sm ${
                      v === optionValue ? 'bg-[#d9ff00] text-black font-semibold' : 'bg-white/5 text-white/60 hover:text-white'
                    }`}
                  >
                    {v}{tool.option.suffix || ''}
                  </button>
                ))}
              </div>
            )}
            <button
              onClick={go}
              disabled={!upload.url || runner.running}
              className="w-full py-3 rounded-xl bg-[#d9ff00] text-black font-bold disabled:opacity-30 disabled:cursor-not-allowed hover:brightness-110"
            >
              {runner.running ? 'Working…' : `Run ${tool.name}`}
            </button>
            <RunStatus runner={runner} waitingText={tool.video ? 'Processing video, this can take a few minutes…' : 'Processing…'} />
          </div>
        </div>
      </div>
    </div>
  );
}
