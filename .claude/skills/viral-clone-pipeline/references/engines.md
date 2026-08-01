# Render engines

Three engines are connected. They are not substitutes for one another. Everything below was verified
by running it on 2026-08-01, not read off documentation.

## Capability matrix

| | Higgsfield | Runway (free workspace) | OpenArt |
|---|---|---|---|
| Restyle existing video | **Yes** — Shorts Studio | No | No |
| Text → image | Yes | Yes (`gen-4`) | Yes |
| Image → video | Yes | Yes (`gen-4-turbo`) | Yes |
| Text → video | Yes | Via image first | Yes |
| Video → video | Yes | Needs `seedance-2` / `kling-o3-pro` — **absent on free** | **Mode does not exist** |
| Avatar / UGC workflows | Yes | No | No |
| Watermark | No | **Yes** on free tier | — |

**Restyle exists in exactly one place.** If the user asks to restyle their own footage, Higgsfield is
the answer or there is no answer. Do not offer Runway or OpenArt as a fallback for it.

## Costs, verified

**Higgsfield Shorts Studio** — 3 credits/sec flat, 4s minimum (12 credit floor).
23s→69, 30s→90, 60s→180. Video analysis is **free**.

**Runway** — no balance is exposed by any tool; `whoami` returns models, not quota. The only way to
know is to submit. `availableVideoModels` is the reliable signal for what a workspace can run.
Aleph (`edit_video`) is 28 credits/sec with a 56 credit minimum — roughly 10x Shorts Studio.

**OpenArt** — `openart_model_cost` with no arguments prices everything, cheapest first.
Cheapest video is **50 credits** (PixVerse V6, 5s, 540p). Images start at 10 (Kling 3 Omni), then
15 (Nano Banana 2 Lite, Seedream 4.5/5 Lite), 20, 30, 40 (Nano Banana Pro, GPT Image 2).
Video models run 50–405 credits per 5s clip.

## The Runway chain that works

```
generate_image({ model: "gen-4", promptText, ratio: "1080:1920" })   # ~45s
  ↓ take result .url
generate_video({ model: "gen-4-turbo", startFrame: {url},
                 promptText, duration: 5, ratio: "1080:1920" })       # ~2min
```

`gen-4-image-turbo` **has no text-to-image mode** and errors out demanding a reference image — use
`gen-4` for text-to-image. Both tools return `task_pending`; poll `get_task` with a background timer.

## Egress constraints

Rendered assets sit behind CloudFront, and the session's egress policy blocks it exactly as it
blocks Google Drive:

```
connect_rejected — dnznrvs05pmza.cloudfront.net:443
connect_rejected — drive.usercontent.google.com:443
```

So within this environment you **cannot** download a render, archive it to Drive, re-upload it to
another engine, or chain engines by passing files between them. Asset URLs are signed and expire;
hand them to the user and say so. Running Claude Code locally lifts all of this.
