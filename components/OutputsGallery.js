'use client';

import { useEffect, useMemo, useState } from 'react';

// Which studio made an output, how to label it, and whether it is a video.
const STUDIOS = {
  image:   { label: 'Image',  video: false },
  cinema:  { label: 'Cinema', video: false },
  video:   { label: 'Video',  video: true },
  lipsync: { label: 'Lip Sync', video: true },
};

const FILTERS = [
  { id: 'all',    label: 'All' },
  { id: 'images', label: 'Images' },
  { id: 'videos', label: 'Videos' },
];

export const isVideoOutput = (item) =>
  STUDIOS[item.type]?.video ?? /\.(mp4|webm|mov)(\?|$)/i.test(item.url);

export async function downloadOutput(item) {
  const ext = isVideoOutput(item) ? 'mp4' : (item.url.match(/\.(png|jpe?g|webp|gif)(\?|$)/i)?.[1] || 'png');
  const name = `jimenez-ai-${item.type || 'output'}-${item.id}.${ext}`;
  try {
    const res = await fetch(item.url);
    if (!res.ok) throw new Error(String(res.status));
    const blobUrl = URL.createObjectURL(await res.blob());
    const a = document.createElement('a');
    a.href = blobUrl;
    a.download = name;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(blobUrl);
  } catch {
    // Some file hosts block direct downloads; open the file so it can be saved from there.
    window.open(item.url, '_blank', 'noopener');
  }
}

function formatDate(iso) {
  const d = new Date(iso);
  return Number.isNaN(d.getTime())
    ? ''
    : d.toLocaleString(undefined, { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' });
}

function Media({ item, full = false }) {
  const [broken, setBroken] = useState(false);
  if (broken) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center gap-1 text-white/30 text-xs p-4 text-center">
        <span className="text-2xl">⌛</span>
        File no longer available
      </div>
    );
  }
  const cls = full ? 'max-w-full max-h-[70vh] rounded-xl' : 'w-full h-full object-cover';
  return isVideoOutput(item) ? (
    <video
      src={item.url}
      className={cls}
      muted={!full}
      loop={!full}
      controls={full}
      autoPlay={full}
      playsInline
      preload="metadata"
      onMouseEnter={full ? undefined : (e) => e.currentTarget.play().catch(() => {})}
      onMouseLeave={full ? undefined : (e) => { e.currentTarget.pause(); e.currentTarget.currentTime = 0; }}
      onError={() => setBroken(true)}
    />
  ) : (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={item.url} alt={item.prompt || 'Generated image'} className={cls} loading="lazy" onError={() => setBroken(true)} />
  );
}

function Viewer({ item, onClose, onDelete }) {
  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4" onClick={onClose}>
      <div className="w-full max-w-4xl flex flex-col items-center gap-4" onClick={(e) => e.stopPropagation()}>
        <Media item={item} full />
        <div className="w-full bg-[#111] border border-white/10 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center gap-4">
          <div className="flex-1 min-w-0">
            <p className="text-white text-sm break-words">{item.prompt || <span className="text-white/40">No prompt</span>}</p>
            <p className="text-white/40 text-xs mt-1">
              {STUDIOS[item.type]?.label || 'Output'} · {item.model || 'unknown model'} · {formatDate(item.createdAt)}
            </p>
          </div>
          <div className="flex gap-2 flex-shrink-0">
            <button onClick={() => downloadOutput(item)} className="px-4 py-2 rounded-lg bg-[#d9ff00] text-black text-sm font-bold hover:brightness-110">
              Download
            </button>
            <button onClick={() => { onDelete(item.id); onClose(); }} className="px-4 py-2 rounded-lg bg-white/5 text-white/70 text-sm hover:bg-red-500/20 hover:text-red-300">
              Delete
            </button>
            <button onClick={onClose} className="px-4 py-2 rounded-lg bg-white/5 text-white/70 text-sm hover:bg-white/10">
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function OutputsGallery({ items, onDelete, onClearAll, onGoToStudio }) {
  const [filter, setFilter] = useState('all');
  const [viewing, setViewing] = useState(null);

  const shown = useMemo(
    () => items.filter((it) => filter === 'all' || (filter === 'videos') === isVideoOutput(it)),
    [items, filter]
  );

  return (
    <div className="h-full overflow-y-auto custom-scrollbar">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        <div className="flex flex-wrap items-end justify-between gap-4 mb-6">
          <div>
            <h1 className="text-white text-2xl font-black tracking-wide uppercase">My Outputs</h1>
            <p className="text-white/40 text-sm mt-1">
              Everything you create in any studio lands here. Kie.ai only keeps files for a limited time, so download anything you want to keep.
            </p>
          </div>
          <div className="flex items-center gap-2">
            {FILTERS.map((f) => (
              <button
                key={f.id}
                onClick={() => setFilter(f.id)}
                className={`px-3 py-1.5 rounded-full text-sm transition-colors ${
                  filter === f.id ? 'bg-[#d9ff00] text-black font-semibold' : 'bg-white/5 text-white/60 hover:text-white'
                }`}
              >
                {f.label}
              </button>
            ))}
            {items.length > 0 && (
              <button
                onClick={() => { if (window.confirm('Remove all outputs from this list? Downloaded files are not affected.')) onClearAll(); }}
                className="ml-2 px-3 py-1.5 rounded-full text-sm bg-white/5 text-white/40 hover:bg-red-500/20 hover:text-red-300"
              >
                Clear all
              </button>
            )}
          </div>
        </div>

        {shown.length === 0 ? (
          <div className="border border-dashed border-white/10 rounded-2xl py-20 flex flex-col items-center gap-4 text-center">
            <span className="text-4xl">✨</span>
            <p className="text-white/60">
              {items.length === 0 ? 'Nothing here yet. Generate something and it will show up here.' : `No ${filter} yet.`}
            </p>
            <button onClick={() => onGoToStudio('image')} className="px-4 py-2 rounded-lg bg-[#d9ff00] text-black text-sm font-bold">
              Go to Image Studio
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {shown.map((item) => (
              <div key={item.id} className="group bg-[#111] border border-white/5 rounded-2xl overflow-hidden hover:border-white/20 transition-colors">
                <button onClick={() => setViewing(item)} className="relative block w-full aspect-square bg-black" title="Open">
                  <Media item={item} />
                  <span className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-black/70 text-[10px] font-bold uppercase tracking-wider text-[#d9ff00]">
                    {STUDIOS[item.type]?.label || 'Output'}{isVideoOutput(item) ? ' ▶' : ''}
                  </span>
                </button>
                <div className="p-3 flex items-start gap-2">
                  <div className="flex-1 min-w-0">
                    <p className="text-white/80 text-xs line-clamp-2" title={item.prompt}>{item.prompt || 'No prompt'}</p>
                    <p className="text-white/30 text-[11px] mt-1">{formatDate(item.createdAt)}</p>
                  </div>
                  <button onClick={() => downloadOutput(item)} className="p-1.5 rounded-lg bg-white/5 text-white/60 hover:bg-[#d9ff00] hover:text-black" title="Download">
                    ⬇
                  </button>
                  <button onClick={() => onDelete(item.id)} className="p-1.5 rounded-lg bg-white/5 text-white/40 hover:bg-red-500/20 hover:text-red-300" title="Delete">
                    ✕
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {viewing && <Viewer item={viewing} onClose={() => setViewing(null)} onDelete={onDelete} />}
    </div>
  );
}
