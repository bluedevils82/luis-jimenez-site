'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { uploadFile, runKieModel } from 'studio/src/kie.js';
import { downloadOutput } from '../OutputsGallery';

// Upload a picked file to Kie.ai right away so a tool can use its URL.
export function useUpload(apiKey) {
  const [state, setState] = useState({ file: null, preview: null, url: null, progress: 0, uploading: false, error: null });

  useEffect(() => () => { if (state.preview) URL.revokeObjectURL(state.preview); }, [state.preview]);

  const pick = useCallback(async (file) => {
    if (!file) return;
    const preview = URL.createObjectURL(file);
    setState({ file, preview, url: null, progress: 0, uploading: true, error: null });
    try {
      const url = await uploadFile(apiKey, file, (progress) => setState((s) => ({ ...s, progress })));
      setState((s) => ({ ...s, url, uploading: false }));
    } catch (e) {
      setState((s) => ({ ...s, uploading: false, error: e.message || 'Upload failed' }));
    }
  }, [apiKey]);

  const clear = useCallback(() => setState({ file: null, preview: null, url: null, progress: 0, uploading: false, error: null }), []);
  return { ...state, pick, clear };
}

// Run a Kie.ai model and keep track of progress and the result.
export function useRun(apiKey, onResult) {
  const [state, setState] = useState({ running: false, error: null, result: null, startedAt: 0 });
  const [, tick] = useState(0);

  useEffect(() => {
    if (!state.running) return undefined;
    const t = setInterval(() => tick((n) => n + 1), 1000);
    return () => clearInterval(t);
  }, [state.running]);

  const run = useCallback(async ({ slug, input, type, label }) => {
    setState({ running: true, error: null, result: null, startedAt: Date.now() });
    try {
      const res = await runKieModel(apiKey, slug, input);
      if (!res?.url) throw new Error('Kie.ai did not return a file.');
      const result = { url: res.url, type, prompt: label, model: slug };
      setState({ running: false, error: null, result, startedAt: 0 });
      onResult?.(result);
    } catch (e) {
      setState({ running: false, error: e.message || 'Something went wrong', result: null, startedAt: 0 });
    }
  }, [apiKey, onResult]);

  const elapsed = state.running ? Math.floor((Date.now() - state.startedAt) / 1000) : 0;
  return { ...state, elapsed, run, reset: () => setState({ running: false, error: null, result: null, startedAt: 0 }) };
}

export function FilePicker({ accept, upload, label, hint, isVideo }) {
  const inputRef = useRef(null);
  const [over, setOver] = useState(false);

  return (
    <div
      onDragOver={(e) => { e.preventDefault(); setOver(true); }}
      onDragLeave={() => setOver(false)}
      onDrop={(e) => { e.preventDefault(); setOver(false); upload.pick(e.dataTransfer.files?.[0]); }}
      className={`relative rounded-2xl border-2 border-dashed transition-colors overflow-hidden ${
        over ? 'border-[#d9ff00] bg-[#d9ff00]/5' : 'border-white/10 bg-white/[0.02] hover:border-white/25'
      }`}
    >
      <input ref={inputRef} type="file" accept={accept} className="hidden" onChange={(e) => { upload.pick(e.target.files?.[0]); e.target.value = ''; }} />
      {upload.preview ? (
        <div className="relative aspect-video bg-black flex items-center justify-center">
          {isVideo ? (
            <video src={upload.preview} className="max-h-full max-w-full" muted controls playsInline />
          ) : (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={upload.preview} alt="Your upload" className="max-h-full max-w-full object-contain" />
          )}
          <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between gap-2">
            <span className="px-2 py-1 rounded-full bg-black/70 text-xs text-white/80">
              {upload.uploading ? `Uploading… ${upload.progress}%` : upload.error ? `⚠ ${upload.error}` : '✓ Ready'}
            </span>
            <button onClick={() => inputRef.current?.click()} className="px-3 py-1 rounded-full bg-black/70 text-xs text-white hover:bg-black">
              Change
            </button>
          </div>
        </div>
      ) : (
        <button onClick={() => inputRef.current?.click()} className="w-full aspect-video flex flex-col items-center justify-center gap-2 text-center p-6">
          <span className="text-3xl">{isVideo ? '🎬' : '🖼️'}</span>
          <span className="text-white font-semibold">{label}</span>
          <span className="text-white/40 text-xs">{hint}</span>
        </button>
      )}
    </div>
  );
}

export function RunStatus({ runner, waitingText }) {
  if (runner.running) {
    return (
      <div className="flex items-center gap-3 rounded-xl bg-white/5 px-4 py-3 text-sm text-white/70">
        <span className="animate-spin text-[#d9ff00]">◌</span>
        {waitingText} <span className="text-white/40">({runner.elapsed}s)</span>
      </div>
    );
  }
  if (runner.error) {
    return <div className="rounded-xl bg-red-500/10 border border-red-500/20 px-4 py-3 text-sm text-red-300 break-words">⚠ {runner.error}</div>;
  }
  if (!runner.result) return null;
  const isVideo = runner.result.type.endsWith('video');
  return (
    <div className="rounded-2xl border border-white/10 bg-[#111] overflow-hidden">
      <div className="bg-black flex items-center justify-center max-h-[60vh]">
        {isVideo ? (
          <video src={runner.result.url} className="max-h-[60vh] max-w-full" controls autoPlay loop playsInline />
        ) : (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={runner.result.url} alt="Result" className="max-h-[60vh] max-w-full object-contain" />
        )}
      </div>
      <div className="flex items-center justify-between gap-3 p-3">
        <span className="text-xs text-white/50">✓ Saved to My Outputs</span>
        <button
          onClick={() => downloadOutput({ ...runner.result, id: Date.now() })}
          className="px-4 py-2 rounded-lg bg-[#d9ff00] text-black text-sm font-bold hover:brightness-110"
        >
          Download
        </button>
      </div>
    </div>
  );
}
