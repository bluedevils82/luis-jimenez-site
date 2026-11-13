# Jimenez Family AI — Image & Video Studio

A self-hosted AI creative studio with four workspaces:

- **Image Studio**: text-to-image and image-to-image
- **Video Studio**: text-to-video and image-to-video
- **Lip Sync**: drive a face with an audio track
- **Cinema Studio**: cinematic shots with camera/lens presets

Plus:

- **Effects**: one-click photo looks (3D animated, anime, watercolor, action figure…) and
  camera moves (orbit, dolly zoom, crash zoom, drone fly-away…), no prompt needed
- **Tools**: upscale photos (up to 8×, Topaz, Crisp), remove backgrounds, upscale videos
  (1080p/2K/4K, Topaz)
- **My Outputs**: everything you create, in one gallery with download

The model menus list only models Kie.ai serves (generated from its API specs; see
`scripts/kie-catalog/`).

It runs entirely in the browser and calls the [Kie.ai](https://kie.ai) API with
your own key. The key is stored only in your browser (localStorage) and is sent
straight to Kie.ai; this site has no backend of its own.

## Getting started

You need Node.js 22+ and a Kie.ai API key.

```bash
npm run setup   # install packages and build the studio package
npm run dev     # start at http://localhost:3000
```

Open the site, paste your Kie.ai key, and start generating. Generations are
billed to your Kie.ai account.

## Deploying to Netlify

`netlify.toml` is set up for this Next.js app. In Netlify, choose
**Add new site → Import from GitHub**, pick this repository and the `main`
branch, and keep the settings it reads from `netlify.toml`. No environment
variables are needed.

## Project layout

| Path | What it is |
|---|---|
| `app/`, `components/` | The Next.js site (key screen, tabs, settings) |
| `packages/studio/` | The four studio UIs and the Kie.ai client (`src/kie.js`) |
| `src/`, `index.html`, `electron/` | A separate Vite/Electron build from the original fork |
| `netlify/` | The original fork's hosted backend; **not** deployed by this site |

## Credits

Based on [Open Higgsfield AI](https://github.com/Autom8AI/Open-Higgsfield-AI)
(MIT license). The original README is kept in
[`docs/UPSTREAM_README.md`](docs/UPSTREAM_README.md).
