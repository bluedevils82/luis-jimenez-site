'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { runKieModel } from 'studio/src/kie.js';
import VOICES from './voices.json';

// A chat assistant (Claude, through the Kie.ai key) that can also make things: when it wants
// to create an image, video, song or voice clip it proposes it, and you approve before any
// credits are spent. Chats are stored only in this browser.

const CHATS_KEY = 'jfai_chats';
const API_URL = 'https://api.kie.ai/claude/v1/messages';

const MODELS = [
  { id: 'claude-sonnet-5-5', label: 'Claude Sonnet 5.5', note: 'Balanced' },
  { id: 'claude-haiku-5-5', label: 'Claude Haiku 5.5', note: 'Fastest, cheapest' },
  { id: 'claude-opus-5-5', label: 'Claude Opus 5.5', note: 'Most capable' },
];

const PERSONAS = [
  { id: 'director', icon: '🎬', name: 'Creative Director', brief: 'You are a creative director. Help the user turn rough ideas into striking images and videos. Suggest concrete visual details: subject, setting, lighting, lens, mood.' },
  { id: 'prompt', icon: '✍️', name: 'Prompt Writer', brief: 'You are an expert prompt writer for AI image and video models. When given an idea, reply with one polished, detailed prompt the user can copy, then offer to generate it.' },
  { id: 'song', icon: '🎵', name: 'Songwriter', brief: 'You are a songwriter. Help the user shape song ideas, styles and lyrics, and offer to produce the song.' },
  { id: 'script', icon: '🎙️', name: 'Script Writer', brief: 'You are a script writer for short videos and voice-overs. Write tight, natural spoken scripts and offer to turn them into a voice clip.' },
  { id: 'general', icon: '💬', name: 'General Assistant', brief: 'You are a friendly, concise general assistant.' },
];

const ASPECTS = ['1:1', '16:9', '9:16'];

// What the assistant can make. `build` turns its request into an exact Kie.ai model call.
const AGENT_TOOLS = [
  {
    name: 'generate_image', label: 'Image', icon: '🖼️', out: 'image', type: 'image', cost: 'Uses a few credits',
    description: 'Create an image from a detailed text prompt. Use when the user asks for a picture, photo, logo, poster or illustration.',
    input_schema: { type: 'object', properties: { prompt: { type: 'string', description: 'Detailed description of the image.' }, aspect_ratio: { type: 'string', enum: ASPECTS } }, required: ['prompt'] },
    build: (a) => ({ slug: 'nano-banana-pro', input: { prompt: a.prompt, aspect_ratio: ASPECTS.includes(a.aspect_ratio) ? a.aspect_ratio : '1:1', resolution: '1K', output_format: 'png' } }),
    summary: (a) => a.prompt,
  },
  {
    name: 'generate_video', label: 'Video', icon: '🎬', out: 'video', type: 'video', cost: 'Videos cost more credits and take a few minutes',
    description: 'Create a short video (about 8 seconds, with sound) from a detailed text prompt. Use only when the user asks for a video or clip.',
    input_schema: { type: 'object', properties: { prompt: { type: 'string', description: 'Detailed description of the scene, action and camera.' }, aspect_ratio: { type: 'string', enum: ['16:9', '9:16'] } }, required: ['prompt'] },
    build: (a) => ({ slug: 'veo-3-1', input: { model: 'veo3_fast', generation_type: 'TEXT_2_VIDEO', prompt: a.prompt, aspect_ratio: a.aspect_ratio === '9:16' ? '9:16' : '16:9', resolution: '720p', duration: 8 } }),
    summary: (a) => a.prompt,
  },
  {
    name: 'make_song', label: 'Song', icon: '🎶', out: 'audio', type: 'tool-audio', cost: 'Makes two versions',
    description: 'Create a full song with Suno. Give the idea of the song and a music style. Use when the user asks for a song, jingle or music.',
    input_schema: { type: 'object', properties: { idea: { type: 'string', description: 'What the song is about.' }, style: { type: 'string', description: 'Music style, e.g. "upbeat pop".' }, instrumental: { type: 'boolean' } }, required: ['idea', 'style'] },
    build: (a) => ({ slug: 'ai-music-api/generate', input: { custom_mode: false, model: 'V6', prompt: a.idea, style: a.style || 'pop', instrumental: Boolean(a.instrumental) } }),
    summary: (a) => `${a.idea} (${a.style})`,
  },
  {
    name: 'speak_text', label: 'Voice clip', icon: '🗣️', out: 'audio', type: 'tool-audio', cost: 'Uses a few credits',
    description: 'Turn text into a spoken voice clip with ElevenLabs. Use when the user asks to hear something read aloud or wants a voice-over.',
    input_schema: { type: 'object', properties: { text: { type: 'string', description: 'The exact words to speak.' } }, required: ['text'] },
    build: (a) => ({ slug: 'elevenlabs/text-to-speech-turbo-2-5', input: { text: String(a.text || '').slice(0, 5000), voice: VOICES[0].value } }),
    summary: (a) => a.text,
  },
];

const toolByName = (name) => AGENT_TOOLS.find((t) => t.name === name);

const systemText = (persona) =>
  `${persona.brief}\n\nYou are the assistant inside "Jimenez Family AI", a family creative studio. Keep replies short and friendly. ` +
  'You can create things with your tools (images, videos, songs, voice clips). The app asks the user to approve each creation before it runs, so call a tool directly when the user asks you to make something; do not ask for permission in text first. ' +
  'After a tool finishes, the result is already shown to the user and saved in their My Outputs tab; do not repeat the file link.';

const newChat = () => ({ id: `${Date.now()}-${Math.random().toString(36).slice(2, 6)}`, title: 'New chat', persona: PERSONAS[0].id, messages: [], runs: {}, updatedAt: Date.now() });

function loadChats() {
  try {
    const list = JSON.parse(localStorage.getItem(CHATS_KEY) || '[]');
    if (!Array.isArray(list)) return [];
    // A creation that was mid-run when the page closed can be approved again.
    return list.map((c) => ({ ...c, runs: Object.fromEntries(Object.entries(c.runs || {}).map(([k, r]) => [k, r.status === 'running' ? { status: 'pending' } : r])) }));
  } catch {
    return [];
  }
}

const blocksOf = (m) => (typeof m.content === 'string' ? [{ type: 'text', text: m.content }] : m.content || []);

async function askClaude(apiKey, model, persona, messages) {
  // Kie.ai's Claude endpoint documents no separate system field, so the instructions lead the first turn.
  const wire = messages.map((m, i) => {
    if (i !== 0) return { role: m.role, content: m.content };
    const first = blocksOf(m);
    return { role: 'user', content: [{ type: 'text', text: `<instructions>\n${systemText(persona)}\n</instructions>` }, ...first] };
  });
  const res = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${apiKey}` },
    body: JSON.stringify({
      model, messages: wire, stream: false, max_tokens: 2048,
      tools: AGENT_TOOLS.map(({ name, description, input_schema }) => ({ name, description, input_schema })),
    }),
  });
  let json = null;
  try { json = await res.json(); } catch { /* handled below */ }
  if (!json || !Array.isArray(json.content)) {
    const msg = json?.msg || json?.error?.message || json?.message || `Request failed (${res.status})`;
    throw new Error(msg);
  }
  return json.content.filter((b) => b.type === 'text' || b.type === 'tool_use');
}

function ResultMedia({ run, out }) {
  if (out === 'audio') return <div className="flex flex-col gap-2">{run.urls.map((u) => <audio key={u} src={u} controls className="w-full" />)}</div>;
  if (out === 'video') return <video src={run.urls[0]} controls playsInline className="max-h-80 rounded-lg" />;
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={run.urls[0]} alt="Result" className="max-h-80 rounded-lg" />;
}

function ToolCard({ block, run, onApprove, onSkip }) {
  const tool = toolByName(block.name);
  if (!tool) return null;
  const status = run?.status || 'pending';
  return (
    <div className="rounded-xl border border-white/10 bg-black/40 p-3 flex flex-col gap-2">
      <div className="flex items-center gap-2 text-sm">
        <span>{tool.icon}</span>
        <span className="text-white font-semibold">{tool.label}</span>
        {status === 'running' && <span className="text-[#d9ff00] text-xs animate-pulse">Making it…</span>}
        {status === 'skipped' && <span className="text-white/40 text-xs">Skipped</span>}
        {status === 'error' && <span className="text-red-300 text-xs">Failed</span>}
      </div>
      <p className="text-white/60 text-xs whitespace-pre-wrap break-words">{tool.summary(block.input || {})}</p>
      {status === 'pending' && (
        <div className="flex items-center gap-2 flex-wrap">
          <button onClick={onApprove} className="px-3 py-1.5 rounded-lg bg-[#d9ff00] text-black text-sm font-bold hover:brightness-110">Make it</button>
          <button onClick={onSkip} className="px-3 py-1.5 rounded-lg bg-white/5 text-white/70 text-sm hover:bg-white/10">Skip</button>
          <span className="text-white/30 text-xs">{tool.cost}</span>
        </div>
      )}
      {status === 'error' && <p className="text-red-300 text-xs break-words">⚠ {run.error}</p>}
      {status === 'done' && <ResultMedia run={run} out={tool.out} />}
    </div>
  );
}

export default function AssistantStudio({ apiKey, onResult }) {
  const [chats, setChats] = useState([]);
  const [chatId, setChatId] = useState(null);
  const [model, setModel] = useState(MODELS[0].id);
  const [draft, setDraft] = useState('');
  const [thinking, setThinking] = useState(false);
  const [error, setError] = useState(null);
  const [showList, setShowList] = useState(false);
  const chatsRef = useRef([]);
  const bottomRef = useRef(null);

  const commit = useCallback((next) => {
    chatsRef.current = next;
    setChats(next);
    try { localStorage.setItem(CHATS_KEY, JSON.stringify(next.filter((c) => c.messages.length).slice(0, 30))); } catch { /* storage full */ }
  }, []);

  useEffect(() => {
    const stored = loadChats();
    const first = stored[0] || newChat();
    commit(stored.length ? stored : [first]);
    setChatId(first.id);
  }, [commit]);

  const chat = chats.find((c) => c.id === chatId);
  const persona = PERSONAS.find((p) => p.id === chat?.persona) || PERSONAS[0];

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' }); }, [chat?.messages.length, thinking, chat?.runs]);

  const patchChat = useCallback((id, fn) => {
    commit(chatsRef.current.map((c) => (c.id === id ? { ...fn(c), updatedAt: Date.now() } : c)));
  }, [commit]);

  // Ask Claude for the next turn of a chat.
  const advance = useCallback(async (id) => {
    const c = chatsRef.current.find((x) => x.id === id);
    if (!c) return;
    setThinking(true);
    setError(null);
    try {
      const content = await askClaude(apiKey, model, PERSONAS.find((p) => p.id === c.persona) || PERSONAS[0], c.messages);
      patchChat(id, (cur) => ({ ...cur, messages: [...cur.messages, { role: 'assistant', content }] }));
    } catch (e) {
      setError(e.message || 'Something went wrong');
    } finally {
      setThinking(false);
    }
  }, [apiKey, model, patchChat]);

  const send = () => {
    const text = draft.trim();
    if (!text || thinking || !chat) return;
    setDraft('');
    patchChat(chat.id, (c) => ({ ...c, title: c.messages.length ? c.title : text.slice(0, 40), messages: [...c.messages, { role: 'user', content: text }] }));
    advance(chat.id);
  };

  // Once every creation the assistant proposed is approved or skipped, report back to it.
  const settle = useCallback((id) => {
    const c = chatsRef.current.find((x) => x.id === id);
    const last = c?.messages[c.messages.length - 1];
    if (!last || last.role !== 'assistant') return;
    const uses = blocksOf(last).filter((b) => b.type === 'tool_use');
    if (!uses.length || uses.some((u) => !['done', 'skipped', 'error'].includes(c.runs[u.id]?.status))) return;
    const results = uses.map((u) => {
      const r = c.runs[u.id];
      const text = r.status === 'done' ? `Created successfully (${r.urls.length} file${r.urls.length > 1 ? 's' : ''}). It is now shown to the user and saved in My Outputs.`
        : r.status === 'skipped' ? 'The user chose to skip this.' : `It failed: ${r.error}`;
      return { type: 'tool_result', tool_use_id: u.id, content: text };
    });
    patchChat(id, (cur) => ({ ...cur, messages: [...cur.messages, { role: 'user', content: results }] }));
    advance(id);
  }, [advance, patchChat]);

  const setRun = (id, useId, run) => patchChat(id, (c) => ({ ...c, runs: { ...c.runs, [useId]: run } }));

  const approve = async (block) => {
    const tool = toolByName(block.name);
    const id = chat.id;
    setRun(id, block.id, { status: 'running' });
    try {
      const { slug, input } = tool.build(block.input || {});
      const res = await runKieModel(apiKey, slug, input);
      const urls = res.urls?.length ? res.urls : res.url ? [res.url] : [];
      if (!urls.length) throw new Error('Kie.ai did not return a file.');
      setRun(id, block.id, { status: 'done', urls });
      [...urls].reverse().forEach((url) => onResult?.({ url, type: tool.type, prompt: tool.summary(block.input || {}), model: slug }));
    } catch (e) {
      setRun(id, block.id, { status: 'error', error: e.message || 'Failed' });
    }
    settle(id);
  };

  const skip = (block) => { setRun(chat.id, block.id, { status: 'skipped' }); settle(chat.id); };

  const startNew = () => {
    const c = newChat();
    commit([c, ...chatsRef.current.filter((x) => x.messages.length)]);
    setChatId(c.id); setError(null); setShowList(false);
  };

  const removeChat = (id) => {
    let rest = chatsRef.current.filter((c) => c.id !== id);
    if (!rest.length) rest = [newChat()];
    commit(rest);
    if (id === chatId) setChatId(rest[0].id);
  };

  if (!chat) return null;
  const last = chat.messages[chat.messages.length - 1];
  const canRetry = error && last?.role === 'user';

  return (
    <div className="h-full flex min-h-0">
      {/* Chat list */}
      <aside className={`${showList ? 'flex' : 'hidden'} md:flex flex-col w-64 flex-shrink-0 border-r border-white/5 bg-[#0a0a0a] absolute md:static inset-y-0 left-0 z-40 md:z-auto`}>
        <div className="p-3">
          <button onClick={startNew} className="w-full py-2 rounded-lg bg-[#d9ff00] text-black text-sm font-bold hover:brightness-110">+ New chat</button>
        </div>
        <div className="flex-1 overflow-y-auto custom-scrollbar px-2 pb-2">
          {chats.filter((c) => c.messages.length || c.id === chatId).map((c) => (
            <div key={c.id} className={`group flex items-center gap-1 rounded-lg px-2 py-2 text-sm cursor-pointer ${c.id === chatId ? 'bg-white/10 text-white' : 'text-white/50 hover:bg-white/5'}`}
              onClick={() => { setChatId(c.id); setError(null); setShowList(false); }}>
              <span className="flex-1 truncate">{c.title}</span>
              <button onClick={(e) => { e.stopPropagation(); removeChat(c.id); }} title="Delete chat" className="opacity-0 group-hover:opacity-100 text-white/40 hover:text-red-300 px-1">✕</button>
            </div>
          ))}
        </div>
        <p className="p-3 text-[11px] text-white/30 border-t border-white/5">🔒 Chats are saved only in this browser.</p>
      </aside>

      <section className="flex-1 min-w-0 flex flex-col">
        <div className="flex items-center gap-2 px-4 py-2 border-b border-white/5 flex-wrap">
          <button onClick={() => setShowList((v) => !v)} className="md:hidden px-2 py-1 rounded bg-white/5 text-white/70 text-sm">☰ Chats</button>
          <select value={model} onChange={(e) => setModel(e.target.value)} title="Model" className="rounded-lg bg-[#161616] border border-white/10 px-2 py-1.5 text-white text-sm">
            {MODELS.map((m) => <option key={m.id} value={m.id}>{m.label} · {m.note}</option>)}
          </select>
          <select value={persona.id} onChange={(e) => patchChat(chat.id, (c) => ({ ...c, persona: e.target.value }))} title="Character" className="rounded-lg bg-[#161616] border border-white/10 px-2 py-1.5 text-white text-sm">
            {PERSONAS.map((p) => <option key={p.id} value={p.id}>{p.icon} {p.name}</option>)}
          </select>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar">
          <div className="max-w-3xl mx-auto px-4 py-6 flex flex-col gap-4">
            {chat.messages.length === 0 && (
              <div className="text-center py-10">
                <div className="text-4xl mb-3">{persona.icon}</div>
                <h1 className="text-white text-2xl font-black uppercase tracking-wide">Assistant</h1>
                <p className="text-white/40 text-sm mt-2">Ask for ideas, prompts, scripts or lyrics, or just tell it what to make. It asks before spending credits.</p>
                <div className="flex flex-wrap justify-center gap-2 mt-5">
                  {['Make a poster for our family movie night', 'Write a better prompt: a dog surfing', 'Make a birthday song for Grandma', 'Write a 20-second voice-over about our road trip'].map((s) => (
                    <button key={s} onClick={() => setDraft(s)} className="px-3 py-1.5 rounded-full bg-white/5 text-white/70 text-sm hover:bg-white/10">{s}</button>
                  ))}
                </div>
              </div>
            )}

            {chat.messages.map((m, i) => {
              const blocks = blocksOf(m).filter((b) => b.type === 'text' || b.type === 'tool_use');
              if (!blocks.length) return null; // tool results are shown on their cards
              const mine = m.role === 'user';
              return (
                <div key={i} className={`flex ${mine ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] rounded-2xl px-4 py-3 flex flex-col gap-3 ${mine ? 'bg-[#d9ff00] text-black' : 'bg-[#141414] border border-white/5 text-white/90'}`}>
                    {blocks.map((b, j) => b.type === 'text' ? (
                      <div key={j} className="group/msg">
                        <p className="text-sm whitespace-pre-wrap break-words leading-relaxed">{b.text}</p>
                        {!mine && b.text.length > 40 && (
                          <button onClick={() => navigator.clipboard?.writeText(b.text)} className="mt-1 text-[11px] text-white/30 hover:text-white">Copy</button>
                        )}
                      </div>
                    ) : (
                      <ToolCard key={b.id} block={b} run={chat.runs[b.id]} onApprove={() => approve(b)} onSkip={() => skip(b)} />
                    ))}
                  </div>
                </div>
              );
            })}

            {thinking && <div className="text-white/40 text-sm flex items-center gap-2"><span className="animate-spin text-[#d9ff00]">◌</span> Thinking…</div>}
            {error && (
              <div className="rounded-xl bg-red-500/10 border border-red-500/20 px-4 py-3 text-sm text-red-300 flex items-center gap-3">
                <span className="flex-1 break-words">⚠ {error}</span>
                {canRetry && <button onClick={() => advance(chat.id)} className="px-3 py-1 rounded-lg bg-white/10 text-white text-xs">Try again</button>}
              </div>
            )}
            <div ref={bottomRef} />
          </div>
        </div>

        <div className="border-t border-white/5 p-3">
          <div className="max-w-3xl mx-auto flex items-end gap-2">
            <textarea
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); } }}
              rows={Math.min(6, Math.max(1, draft.split('\n').length))}
              placeholder="Message the assistant…"
              className="flex-1 rounded-xl bg-white/5 border border-white/10 px-3 py-2.5 text-white text-sm placeholder:text-white/25 focus:outline-none focus:border-[#d9ff00]/60 resize-none"
            />
            <button onClick={send} disabled={!draft.trim() || thinking} className="px-5 py-2.5 rounded-xl bg-[#d9ff00] text-black font-bold text-sm disabled:opacity-30">Send</button>
          </div>
        </div>
      </section>
    </div>
  );
}
