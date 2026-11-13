'use client';

import { useState } from 'react';
import { useUpload, useRun, FilePicker, RunStatus } from './shared';

// Photo looks run on Nano Banana Pro (image editing); camera moves on Kling 2.6 (photo to video).
const KEEP = 'Keep the same person or subject, face, pose and composition.';

const PHOTO_EFFECTS = [
  { id: '3d', icon: '🧸', name: '3D Animated', bg: 'from-orange-500/30 to-pink-500/30', prompt: `Turn this photo into a high-quality 3D animated movie still with soft lighting, expressive eyes and smooth stylized textures. ${KEEP}` },
  { id: 'anime', icon: '🌸', name: 'Anime', bg: 'from-pink-500/30 to-purple-500/30', prompt: `Redraw this photo as a detailed hand-drawn anime illustration with clean line art and vibrant cel shading. ${KEEP}` },
  { id: 'watercolor', icon: '🎨', name: 'Watercolor', bg: 'from-sky-500/30 to-emerald-500/30', prompt: `Repaint this photo as a delicate watercolor painting on textured paper with soft bleeding edges. ${KEEP}` },
  { id: 'oil', icon: '🖼️', name: 'Oil Painting', bg: 'from-amber-600/30 to-red-700/30', prompt: `Repaint this photo as a classical oil painting with visible brush strokes and rich warm tones. ${KEEP}` },
  { id: 'clay', icon: '🟠', name: 'Claymation', bg: 'from-orange-400/30 to-yellow-400/30', prompt: `Turn this photo into a stop-motion claymation scene where everything looks sculpted from modeling clay. ${KEEP}` },
  { id: 'figure', icon: '🦸', name: 'Action Figure', bg: 'from-blue-500/30 to-red-500/30', prompt: `Turn the person into a collectible action figure inside a retail blister pack with accessories next to them and a bold title card. Keep their face recognizable.` },
  { id: 'hero', icon: '⚡', name: 'Superhero', bg: 'from-red-600/30 to-yellow-500/30', prompt: `Make the person a cinematic superhero in an original suit with a dramatic city skyline at dusk. Keep their face recognizable.` },
  { id: 'film', icon: '📼', name: '70s Film', bg: 'from-yellow-700/30 to-orange-800/30', prompt: `Make this look like a faded 1970s film photograph with warm grain, light leaks and soft focus. ${KEEP}` },
  { id: 'neon', icon: '🌃', name: 'Cyberpunk', bg: 'from-fuchsia-600/30 to-cyan-500/30', prompt: `Restyle this photo as a rainy cyberpunk night scene with neon signs and glowing reflections. ${KEEP}` },
  { id: 'sketch', icon: '✏️', name: 'Pencil Sketch', bg: 'from-zinc-400/30 to-zinc-700/30', prompt: `Turn this photo into a detailed graphite pencil sketch on white paper with shading and cross-hatching. ${KEEP}` },
  { id: 'headshot', icon: '👔', name: 'Pro Headshot', bg: 'from-slate-500/30 to-blue-900/30', prompt: `Turn this into a professional studio headshot: business attire, soft studio lighting, clean neutral gray background. Keep the face exactly the same.` },
  { id: 'toy', icon: '🧱', name: 'Toy Bricks', bg: 'from-red-500/30 to-yellow-500/30', prompt: `Rebuild this scene as a toy made of plastic interlocking building bricks, with minifigure-style characters. ${KEEP}` },
];

const MOTION_EFFECTS = [
  { id: 'push', icon: '🎥', name: 'Slow Push-In', bg: 'from-emerald-500/30 to-teal-700/30', prompt: 'Smooth slow cinematic push-in toward the subject, subtle natural movement, shallow depth of field.' },
  { id: 'dolly', icon: '🌀', name: 'Dolly Zoom', bg: 'from-indigo-500/30 to-purple-700/30', prompt: 'Dramatic dolly zoom (vertigo effect): the camera pulls back while zooming in, the background stretches while the subject stays the same size.' },
  { id: 'orbit', icon: '🔄', name: '360° Orbit', bg: 'from-cyan-500/30 to-blue-700/30', prompt: 'The camera orbits smoothly all the way around the subject in a 360 degree arc, subject stays centered.' },
  { id: 'crash', icon: '💥', name: 'Crash Zoom', bg: 'from-red-500/30 to-orange-600/30', prompt: 'Fast energetic crash zoom straight into the subject\'s face with a slight shake at the end.' },
  { id: 'drone', icon: '🚁', name: 'Drone Fly-Away', bg: 'from-sky-400/30 to-blue-800/30', prompt: 'The camera rises and flies backward like a drone, revealing the wide surroundings around the subject.' },
  { id: 'bullet', icon: '⏱️', name: 'Bullet Time', bg: 'from-zinc-400/30 to-slate-800/30', prompt: 'Bullet time: the moment freezes and the camera sweeps around the subject in slow motion, particles hanging in the air.' },
  { id: 'smile', icon: '😊', name: 'Turn & Smile', bg: 'from-yellow-400/30 to-pink-500/30', prompt: 'The person turns their head toward the camera and gives a warm natural smile, gentle movement.' },
  { id: 'wind', icon: '🍃', name: 'Wind Blowing', bg: 'from-green-400/30 to-emerald-700/30', prompt: 'A gentle breeze blows through the hair and clothes, leaves drift past, calm cinematic mood.' },
  { id: 'levitate', icon: '🪄', name: 'Levitate', bg: 'from-violet-500/30 to-fuchsia-700/30', prompt: 'The subject slowly floats up off the ground with a soft magical glow and dust rising around them.' },
  { id: 'dust', icon: '🌫️', name: 'Turn to Dust', bg: 'from-stone-400/30 to-stone-800/30', prompt: 'The subject slowly disintegrates into drifting dust particles carried away by the wind.' },
  { id: 'fireworks', icon: '🎆', name: 'Fireworks', bg: 'from-purple-600/30 to-amber-500/30', prompt: 'Colorful fireworks burst in the night sky behind the subject, lighting up their face, celebratory mood.' },
  { id: 'snow', icon: '❄️', name: 'Snowfall', bg: 'from-blue-200/30 to-slate-500/30', prompt: 'Soft snow begins falling around the subject, breath visible in the cold air, cozy winter atmosphere.' },
];

export default function EffectsStudio({ apiKey, onResult }) {
  const [kind, setKind] = useState('photo');
  const [effectId, setEffectId] = useState(null);
  const upload = useUpload(apiKey);
  const runner = useRun(apiKey, onResult);
  const list = kind === 'photo' ? PHOTO_EFFECTS : MOTION_EFFECTS;
  const effect = list.find((e) => e.id === effectId);

  const go = () => {
    if (kind === 'photo') {
      runner.run({
        slug: 'nano-banana-pro',
        input: { prompt: effect.prompt, image_input: [upload.url], aspect_ratio: 'auto', resolution: '2K', output_format: 'png' },
        type: 'effect',
        label: `Effect: ${effect.name}`,
      });
    } else {
      runner.run({
        slug: 'kling-2.6/image-to-video',
        input: { prompt: effect.prompt, image_urls: [upload.url], duration: '5', sound: false },
        type: 'effect-video',
        label: `Effect: ${effect.name}`,
      });
    }
  };

  return (
    <div className="h-full overflow-y-auto custom-scrollbar">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6">
        <h1 className="text-white text-2xl font-black tracking-wide uppercase">Effects</h1>
        <p className="text-white/40 text-sm mt-1 mb-6">Upload a photo, pick a look or a camera move, no prompt needed. Results are saved to My Outputs.</p>

        <div className="grid lg:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)] gap-6">
          <div className="flex flex-col gap-4">
            <FilePicker accept="image/*" upload={upload} label="Choose a photo" hint="A clear photo of a person or subject works best" />
            <button
              onClick={go}
              disabled={!upload.url || !effect || runner.running}
              className="w-full py-3 rounded-xl bg-[#d9ff00] text-black font-bold disabled:opacity-30 disabled:cursor-not-allowed hover:brightness-110"
            >
              {runner.running ? 'Working…' : effect ? `Apply ${effect.name}` : 'Pick an effect'}
            </button>
            <RunStatus runner={runner} waitingText={kind === 'photo' ? 'Applying the look…' : 'Making the video, this can take a few minutes…'} />
          </div>

          <div>
            <div className="flex gap-2 mb-4">
              {[['photo', 'Photo looks'], ['motion', 'Camera moves (video)']].map(([id, label]) => (
                <button
                  key={id}
                  onClick={() => { setKind(id); setEffectId(null); runner.reset(); }}
                  className={`px-4 py-2 rounded-full text-sm ${kind === id ? 'bg-[#d9ff00] text-black font-semibold' : 'bg-white/5 text-white/60 hover:text-white'}`}
                >
                  {label}
                </button>
              ))}
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {list.map((e) => (
                <button
                  key={e.id}
                  onClick={() => setEffectId(e.id)}
                  className={`relative aspect-[4/3] rounded-2xl overflow-hidden border-2 transition-all bg-gradient-to-br ${e.bg} ${
                    e.id === effectId ? 'border-[#d9ff00] scale-[1.02]' : 'border-transparent hover:border-white/20'
                  }`}
                >
                  <span className="absolute inset-0 flex items-center justify-center text-4xl">{e.icon}</span>
                  <span className="absolute bottom-0 inset-x-0 bg-black/60 px-2 py-1.5 text-white text-sm font-semibold">{e.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
