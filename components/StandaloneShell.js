'use client';

import { useState, useEffect, useCallback } from 'react';
import { ImageStudio, VideoStudio, LipSyncStudio, CinemaStudio } from 'studio';
import ApiKeyModal from './ApiKeyModal';
import OutputsGallery from './OutputsGallery';
import EffectsStudio from './apps/EffectsStudio';
import ToolsStudio from './apps/ToolsStudio';
import AssistantStudio from './apps/AssistantStudio';

const TABS = [
  { id: 'image',   label: 'Image Studio' },
  { id: 'video',   label: 'Video Studio' },
  { id: 'lipsync', label: 'Lip Sync' },
  { id: 'cinema',  label: 'Cinema Studio' },
  { id: 'effects', label: 'Effects' },
  { id: 'tools',   label: 'Tools' },
  { id: 'assistant', label: 'Assistant' },
  { id: 'outputs', label: 'My Outputs' },
];

const STORAGE_KEY = 'kie_key';
const ANTHROPIC_KEY = 'anthropic_key';
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
  const [anthropicKey, setAnthropicKey] = useState('');
  const [anthropicDraft, setAnthropicDraft] = useState('');
  const [hasMounted, setHasMounted] = useState(false);
  const [outputs, setOutputs] = useState([]);
  const [toast, setToast] = useState(null);
  const [credits, setCredits] = useState(null);

  useEffect(() => {
    setHasMounted(true);
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) setApiKey(stored);
    setOutputs(loadOutputs());
    setAnthropicKey(localStorage.getItem(ANTHROPIC_KEY) || '');
    // Open the studio named in the link, e.g. /studio?tab=video (or /video).
    const tab = new URLSearchParams(window.location.search).get('tab');
    if (TABS.some((t) => t.id === tab)) setActiveTab(tab);
  }, []);

  // Keep the address bar in sync so the current studio can be bookmarked.
  const selectTab = useCallback((id) => {
    setActiveTab(id);
    window.history.replaceState(null, '', `/studio?tab=${id}`);
  }, []);

  // Kie.ai credit balance, shown in the header. Hidden if it can't be read.
  const refreshCredits = useCallback(async (key) => {
    try {
      const res = await fetch('https://api.kie.ai/api/v1/chat/credit', { headers: { Authorization: `Bearer ${key}` } });
      const json = await res.json();
      setCredits(json.code === 200 && typeof json.data === 'number' ? json.data : null);
    } catch {
      setCredits(null);
    }
  }, []);

  useEffect(() => {
    if (apiKey) refreshCredits(apiKey);
    else setCredits(null);
  }, [apiKey, refreshCredits]);

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
    const key = localStorage.getItem(STORAGE_KEY);
    if (key) refreshCredits(key);
  }, [refreshCredits]);

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

  // Optional: an Anthropic key makes the Assistant's chat go straight to Anthropic.
  const saveAnthropicKey = useCallback((key) => {
    const clean = key.trim();
    if (clean) localStorage.setItem(ANTHROPIC_KEY, clean);
    else localStorage.removeItem(ANTHROPIC_KEY);
    setAnthropicKey(clean);
    setAnthropicDraft('');
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
        <nav className="flex items-center gap-1 overflow-x-auto">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => selectTab(tab.id)}
              className={`px-3 xl:px-4 py-2 text-sm font-medium rounded-t-lg transition-colors whitespace-nowrap ${
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
        <div className="flex items-center gap-3 flex-shrink-0 pl-2">
          {credits !== null && (
            <a
              href="https://kie.ai/billing"
              target="_blank"
              rel="noreferrer"
              title="Your Kie.ai credit balance. Click to add credits."
              className="px-2.5 py-1 rounded-full bg-white/5 text-xs text-white/70 hover:text-white whitespace-nowrap"
            >
              <span className="text-[#d9ff00]">●</span> {Math.round(credits).toLocaleString()} credits
            </a>
          )}
          <button
            onClick={() => setShowSettings(true)}
            className="text-white/40 hover:text-white text-sm transition-colors whitespace-nowrap"
          >
            ⚙ Settings
          </button>
        </div>
      </header>

      {/* Studio Content */}
      <div className="flex-1 min-h-0 relative">
        {activeTab === 'image'   && <ImageStudio   apiKey={apiKey} onGenerationComplete={addOutput} />}
        {activeTab === 'video'   && <VideoStudio   apiKey={apiKey} onGenerationComplete={addOutput} />}
        {activeTab === 'lipsync' && <LipSyncStudio apiKey={apiKey} onGenerationComplete={addOutput} />}
        {activeTab === 'cinema'  && <CinemaStudio  apiKey={apiKey} onGenerationComplete={addOutput} />}
        {activeTab === 'effects' && <EffectsStudio apiKey={apiKey} onResult={addOutput} />}
        {activeTab === 'tools'   && <ToolsStudio   apiKey={apiKey} onResult={addOutput} />}
        {activeTab === 'assistant' && <AssistantStudio apiKey={apiKey} anthropicKey={anthropicKey} onOpenSettings={() => setShowSettings(true)} onResult={addOutput} />}
        {activeTab === 'outputs' && (
          <OutputsGallery items={outputs} onDelete={deleteOutput} onClearAll={clearOutputs} onGoToStudio={selectTab} />
        )}
      </div>

      {/* "Saved" notice after each generation */}
      {toast && (
        <button
          onClick={() => selectTab('outputs')}
          className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded-full bg-[#d9ff00] text-black text-sm font-bold shadow-lg"
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
              Kie.ai API key: <span className="text-white/80 font-mono">{apiKey.slice(0, 8)}••••••••</span>
            </p>

            <div className="border-t border-white/10 pt-4 mb-6">
              <h3 className="text-white font-semibold text-sm">Anthropic API key (optional)</h3>
              <p className="text-white/40 text-xs mt-1 mb-3">
                With this, the Assistant&apos;s chat goes straight to Anthropic and is billed there, not through Kie.ai.
                Images, videos, songs and voices still use Kie.ai. Get a key at{' '}
                <a href="https://console.anthropic.com/settings/keys" target="_blank" rel="noreferrer" className="text-[#d9ff00] hover:underline">console.anthropic.com</a>.
                It is stored only in this browser.
              </p>
              {anthropicKey ? (
                <div className="flex items-center gap-3">
                  <span className="flex-1 text-white/80 font-mono text-sm">{anthropicKey.slice(0, 10)}••••••••</span>
                  <button onClick={() => saveAnthropicKey('')} className="px-3 py-1.5 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30 text-sm">
                    Remove
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <input
                    type="password"
                    value={anthropicDraft}
                    onChange={(e) => setAnthropicDraft(e.target.value)}
                    placeholder="sk-ant-…"
                    autoComplete="off"
                    className="flex-1 min-w-0 rounded-lg bg-black border border-white/10 px-3 py-1.5 text-white text-sm placeholder:text-white/25 focus:outline-none focus:border-[#d9ff00]/60"
                  />
                  <button
                    onClick={() => saveAnthropicKey(anthropicDraft)}
                    disabled={!anthropicDraft.trim()}
                    className="px-3 py-1.5 rounded-lg bg-[#d9ff00] text-black text-sm font-bold disabled:opacity-30"
                  >
                    Save
                  </button>
                </div>
              )}
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleKeyChange}
                className="flex-1 py-2 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30 text-sm transition-colors"
              >
                Change Kie.ai Key
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
