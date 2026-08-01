---
name: viral-clone-pipeline
description: Clone a viral short-form video into an original avatar-led video and publish it across social platforms. Use when the user supplies a viral video (TikTok/YouTube/Reels link or upload) and wants a new version made and distributed, or says "clone this video", "run the pipeline", "make my version of this", "remix this short".
---

# Viral Clone Pipeline

Four stages: **ingest a viral video → derive an original idea → produce the new video → publish and log.**

This replaces an n8n graph. There is no server and no webhook loop — you are the orchestrator, and
the connectors are the nodes. Run stages in order; each one writes its result to the tracking sheet
before the next begins, so a failed run can resume instead of restarting.

## Operating rules

- **Stop at each gate.** Stages 3 and 4 spend credits and publish publicly. Never cross a gate
  without explicit user approval in the current conversation. Approval of one run never carries to
  the next.
- **Log before you advance.** Every stage appends to the tracking sheet (`references/tracking-sheet.md`).
  If a stage fails, the sheet still gets the row with `status=failed` and the error.
- **Never fabricate a rendered asset.** If a render is still queued, say it is queued. Do not
  describe a video you have not seen a completed job for.
- **One run = one `run_id`.** Generate it at Stage 1 (`YYYYMMDD-HHMM-<4 random chars>`) and carry it
  through every row, filename, and caption draft.

## Stage 1 — Ingest the viral video

Goal: source video in Higgsfield storage, plus a scene analysis, transcript, and hook breakdown.

**Ingestion is the one place our stack differs materially from the n8n original.** There is no
TikTok downloader connector. Route by what the user gives you:

| Input | Path |
|---|---|
| YouTube URL | `video_analysis_create({youtube_url})` directly — no upload needed |
| Direct `.mp4` URL (<50 MB) | `media_import_url({url, type:"video"})` → `video_analysis_create({video_input_id})` |
| TikTok/Reels page URL | **Cannot fetch.** Offer `media_upload_widget({type:"video"})` |
| Google Drive file | **Cannot fetch** — egress policy blocks Drive's content host, and sharing settings don't change that. Use the widget. |
| Local file | `media_upload_widget({type:"video"})` — the browser uploads directly |

**In practice the widget is the ingest path for everything that isn't a YouTube URL.** Do not try to
curl media into the container: `drive.usercontent.google.com` returns a proxy 403, and policy denials
must not be routed around. `download_file_content` is not an alternative either — it returns base64
into the conversation, and a 40 MB video would exhaust the context window.

Analysis is **free** and takes 20–90 seconds, not the 3–5 minutes the tool description suggests.
Both a YouTube URL and an uploaded file were verified on a free plan with 10 credits.

Then:

1. `video_analysis_status` — poll until `completed`. Poll with a background timer; foreground `sleep`
   is blocked, and Monitor cannot poll an MCP tool from bash.
   **Long videos are truncated, not just degraded.** A 20-minute source returned scenes for only the
   first 5:15. If the user linked a timestamp beyond that, the moment they cared about is not in the
   analysis — say so rather than reasoning over data you don't have.
   The completed response also carries `video_s3_url`, a direct CloudFront mp4 for uploaded media.
2. **Ignore the scene `label` field on anything that isn't talking-head content.** The analyzer
   force-fits a UGC taxonomy (`Opening Hook` / `Real Experience` / `Call to Action`) onto every
   video; on music and performance footage nearly every scene comes back `Real Experience`. Build
   the beat map from timestamps, `shot_type`, and `visual` instead.
3. Run `virality_predictor({action:"create"})` on the source. Its hook-strength and retention-risk
   read is the thing worth cloning — capture *why* it worked, not what it said. Cost unverified;
   check the balance first if credits are tight.
4. From the analysis, write a **structure brief**: hook (first 3s), beat sequence with timestamps,
   pacing, on-screen text style, CTA, and the transcript. Note whether the source is a single static
   take — a locked-off one-shot gives a restyle much less to work with than varied coverage.
5. Log `stage=1` to the sheet with the source URL, run_id, and structure brief.

Do not copy the source's script, voiceover, or on-screen text into the new video. You are cloning
the *structure*; the words must be original. See "Originality gate" below.

## Stage 2 — Derive the new idea

Replaces the Perplexity node. Use `WebSearch` for what is currently landing in this niche, then write
the new concept yourself.

1. `WebSearch` the topic for current angles, recent developments, and competing takes.
2. Draft **three** distinct concepts that reuse the source's *structure* on a different subject.
   Show all three to the user with a one-line rationale each. Let them pick.
3. For the chosen concept produce: script (timed to the source's beat map), hook line, on-screen
   overlay text per beat, caption, and 8–15 hashtags.
4. Log `stage=2` with the chosen concept and script.

**Originality gate.** Before leaving this stage, check the new script against the source transcript.
If any sentence is a near-copy, rewrite it. If the concept only works by reusing the source's
specific phrasing or a recognizable creator's persona, say so and propose a different angle — do not
produce it and let the user discover the problem after publishing.

## Stage 3 — Produce the video

Gate: confirm the script and get approval to spend credits. **Check `balance` before quoting
anything** — this is the stage that stops runs dead, and it's better caught at Stage 1 than here.

Shorts Studio is **3 credits/second, flat** (verified: 23s→69, 30s→90, 60s→180), with a 4s minimum,
so the floor for any restyle is 12 credits. `shorts_studio_create({get_cost:true, duration_seconds})`
confirms a number without submitting. Generation-model costs vary — price them the same way rather
than assuming this rate applies.

Pick the production route that matches the format:

- **Talking-head / avatar-led** (the diagram's default): load `get_workflow_instructions({workflow:"ugc-flow"})`
  and follow it. It handles casting, shot list, and rendering with a consistent on-camera presenter.
- **Faceless / narrated**: `get_workflow_instructions({workflow:"faceless-channel-video"})`.
- **Restyle the user's own footage**: `shorts_studio_list_presets` → `shorts_studio_create`.
- **Reusable presenter across runs**: `show_characters` for an existing character, and
  `create_voice` / `list_voices` so the voice matches run to run. Record the character and voice IDs
  in the sheet — consistency across posts is the point of an avatar channel.

Then:

1. Poll to completion. Renders take minutes; do not report a URL you have not received.
2. `virality_predictor` on the **finished** video. If hook strength lands below the source's, say so
   and offer one revision pass before publishing — that is the whole value of having the score.
3. Optional cover: `get_workflow_instructions({workflow:"youtube-thumbnail-generator"})`.
4. Archive the final file to Google Drive (`create_file`) so it outlives Higgsfield's storage.
5. Log `stage=3` with the video URL, Drive link, character/voice IDs, and credits spent.

## Stage 4 — Publish and log

Gate: show the user the final video, caption, and the exact platform list. Publishing is public and
effectively irreversible. Get explicit approval. If they approve a subset, publish only that subset.

**Verify the channel list at runtime — do not trust this table.** Call
`inspect_zapier_actions({selected_api:"BufferCLIAPI"})` and resolve the connected channels before
promising a platform. Routing:

- **Buffer via Zapier** — the primary fan-out, standing in for Blotato. One action per channel;
  covers Instagram, Facebook, Threads, LinkedIn, Pinterest, X, Bluesky, YouTube, and TikTok *to the
  extent those channels are connected in the Buffer account*.
- **TikTok native** — `tiktok_accounts` → if empty, `tiktok_connect`; then `tiktok_prepare_publish`
  → `tiktok_publish` → `tiktok_publish_status`. Prefer this over Buffer for TikTok: it posts the
  video file directly. `tiktok_music_trending` can inform sound choice before posting.
- **X fallback** — IFTTT `post_new_tweet_with_image` if X is not connected in Buffer.

Then:

1. Tailor the caption per platform (length, hashtag norms, link handling). Do not post one identical
   caption to nine places.
2. Publish, collecting the post URL or Buffer queue ID for each.
3. Log `stage=4` — one row per platform, each with its status and post URL. Partial failure is
   normal: log the successes as successes and report exactly which platforms failed and why.
4. Report back: video link, per-platform results, credits spent, and anything that needs a retry.

## Scheduling

To run this on a cadence, use `create_trigger` (Routines) with `create_new_session_on_fire:true` and
a prompt naming the source and niche. A scheduled run must still stop at the Stage 3 and Stage 4
gates and ask — unattended publishing is not something to set up silently. If the user genuinely
wants hands-off publishing, have them say so explicitly, and record that standing approval in the
run's sheet row.

## References

- `references/connector-map.md` — every n8n node in the original diagram, mapped to its replacement,
  including the four that have no equivalent.
- `references/tracking-sheet.md` — the Google Sheets schema and the exact Zapier calls to write it.
- `references/publishing.md` — per-platform caption rules and failure handling.
