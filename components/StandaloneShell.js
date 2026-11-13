'use client';

import { useState, useEffect, useCallback } from 'react';
import { ImageStudio, VideoStudio, LipSyncStudio, CinemaStudio } from 'studio';
import ApiKeyModal from './ApiKeyModal';
import OutputsGallery from './OutputsGallery';

const TABS = [
  { id: 'image',   label: 'Image Studio' },
  { id: 'video',   label: 'Video Studio' },
  { id: 'lipsync', label: 'Lip Sync' },
  { id: 'cinema',  label: 'Cinema Studio' },
  { id: 'outputs', label: 'My Outputs' },
];

const STORAGE_KEY = 'kie_key';
const OUTPUTS_KEY = 'jfai_outputs';
const MAX_OUTPUTS = 300;

function loadOutputs() {
  try {
    const list = JSON.parse(localStorage.getItem(OUTPUTS_KEY) || '[]');
    return Array.isArray(list) ? list : [];
  } catch {
    return [];
  }
}

function saveOutputs(list) {
  try {
    localStorage.setItem(OUTPUTS_KEY, JSON.stringify(list));
  } catch {
    // Storage full or blocked; the list still works for this visit.
  }
}

export default function StandaloneShell() {
  const [apiKey, setApiKey] = useState(null);
  const [activeTab, setActiveTab] = useState('image');
  const [showSettings, setShowSettings] = useState(false);
  const [hasMounted, setHasMounted] = useState(false);
  const [outputs, setOutputs] = useState([]);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    setHasMounted(true);
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) setApiKey(stored);
    setOutputs(loadOutputs());
    // Open the studio named in the link, e.g. /studio?tab=video (or /video).
    const tab = new URLSearchParams(window.location.search).get('tab');
    if (TABS.some((t) => t.id === tab)) setActiveTab(tab);
  }, []);

  // Keep the address bar in sync so the current studio can be bookmarked.
  const selectTab = useCallback((id) => {
    setActiveTab(id);
    window.history.replaceState(null, '', `/studio?tab=${id}`);
  }, []);

  // Every studio reports finished results here; they are collected in My Outputs.
  const addOutput = useCallback((result) => {
    if (!result?.url) return;
    const item = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      url: result.url,
      type: result.type || 'image',
      prompt: result.prompt || '',
      model: result.model || '',
      createdAt: new Date().toISOString(),
    };
    setOutputs((prev) => {
      const next = [item, ...prev.filter((o) => o.url !== item.url)].slice(0, MAX_OUTPUTS);
      saveOutputs(next);
      return next;
    });
    setToast('Saved to My Outputs');
    setTimeout(() => setToast(null), 2500);
  }, []);

  const deleteOutput = useCallback((id) => {
    setOutputs((prev) => {
      const next = prev.filter((o) => o.id !== id);
      saveOutputs(next);
      return next;
    });
  }, []);

  const clearOutputs = useCallback(() => {
    setOutputs([]);
    saveOutputs([]);
  }, []);

  const handleKeySave = useCallback((key) => {
    localStorage.setItem(STORAGE_KEY, key);
    setApiKey(key);
  }, []);

  const handleKeyChange = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setApiKey(null);
  }, []);

  if (!hasMounted) return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center">
      <div className="animate-spin text-[#d9ff00] text-3xl">◌</div>
    </div>
  );

  if (!apiKey) {
    return <ApiKeyModal onSave={handleKeySave} />;
  }

  return (
    <div className="h-screen bg-[#050505] flex flex-col overflow-hidden">
      {/* Header */}
      <header className="flex-shrink-0 flex items-center justify-between px-4 pt-4 pb-0 border-b border-white/5">
        <div className="flex items-center gap-3">
          <span className="text-white font-black text-lg tracking-wider uppercase">
            Jimenez Family AI
          </span>
        </div>

        {/* Tabs */}
        <nav className="flex items-center gap-1">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => selectTab(tab.id)}
              className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors ${
                activeTab === tab.id
                  ? 'bg-[#d9ff00] text-black'
                  : 'text-white/50 hover:text-white'
              }`}
            >
              {tab.label}
              {tab.id === 'outputs' && outputs.length > 0 && (
                <span className={`ml-2 px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
                  activeTab === tab.id ? 'bg-black/20 text-black' : 'bg-[#d9ff00] text-black'
                }`}>
                  {outputs.length}
                </span>
              )}
            </button>
          ))}
        </nav>

        {/* Settings */}
        <button
          onClick={() => setShowSettings(true)}
          className="text-white/40 hover:text-white text-sm transition-colors"
        >
          ⚙ Settings
        </button>
      </header>

      {/* Studio Content */}
      <div className="flex-1 min-h-0">
        {activeTab === 'image'   && <ImageStudio   apiKey={apiKey} onGenerationComplete={addOutput} />}
        {activeTab === 'video'   && <VideoStudio   apiKey={apiKey} onGenerationComplete={addOutput} />}
        {activeTab === 'lipsync' && <LipSyncStudio apiKey={apiKey} onGenerationComplete={addOutput} />}
        {activeTab === 'cinema'  && <CinemaStudio  apiKey={apiKey} onGenerationComplete={addOutput} />}
        {activeTab === 'outputs' && (
          <OutputsGallery items={outputs} onDelete={deleteOutput} onClearAll={clearOutputs} onGoToStudio={selectTab} />
        )}
      </div>

      {/* "Saved" notice after each generation */}
      {toast && (
        <button
          onClick={() => selectTab('outputs')}
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded-full bg-[#d9ff00] text-black text-sm font-bold shadow-lg"
        >
          ✓ {toast} · View
        </button>
      )}

      {/* Settings Modal */}
      {showSettings && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
          <div className="bg-[#111] border border-white/10 rounded-2xl p-8 w-full max-w-md">
            <h2 className="text-white font-bold text-xl mb-6">Settings</h2>
            <p className="text-white/50 text-sm mb-4">
              Current API key: <span className="text-white/80 font-mono">{apiKey.slice(0, 8)}••••••••</span>
            </p>
            <div className="flex gap-3">
              <button
                onClick={handleKeyChange}
                className="flex-1 py-2 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30 text-sm transition-colors"
              >
                Change API Key
              </button>
              <button
                onClick={() => setShowSettings(false)}
                className="flex-1 py-2 rounded-lg bg-white/5 text-white hover:bg-white/10 text-sm transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
