# Publishing

Stage 4 detail. The diagram's nine platforms, and how each one is actually reached.

## Before anything

1. `inspect_zapier_actions({ selected_api: "BufferCLIAPI" })` — resolve the real connected channels.
   The channel list is not static and is not documented here on purpose. Never tell the user a
   platform will be posted to before this call confirms it.
2. `tiktok_accounts` — if empty, TikTok goes through Buffer, or offer `tiktok_connect`.
3. Show the user: final video, per-platform captions, exact platform list. Get explicit approval.

## Per-platform caption rules

One caption posted nine times reads as automation and performs like it. Tailor each:

| Platform | Length | Hashtags | Notes |
|---|---|---|---|
| TikTok | ~150 chars | 3–5, in caption | Native publish preferred. Trending sound via `tiktok_music_trending` before posting. |
| Instagram Reels | ~125 visible | 5–10 | Hook must survive truncation at ~125 chars. |
| YouTube Shorts | Title ≤70 chars | 2–3 | Needs a real title, not just a caption. `#Shorts` helps. |
| Facebook | 1–2 sentences | 0–2 | Hashtags underperform here. |
| Threads | ~500 chars | 0–1 | Conversational; a caption that reads like an ad dies. |
| X | 280 chars | 1–2 | Video posts natively; keep the hook in the first line. |
| LinkedIn | 1–3 short paras | 3–5 at the end | Reframe the hook professionally. Do not post a TikTok voice verbatim. |
| Bluesky | 300 chars | 0–2 | Similar to X, lighter on hashtags. |
| Pinterest | Title + description | 2–5 | Needs a keyword-led title; it's a search surface, not a feed. |

## Failure handling

Partial failure is the expected case with nine per-channel calls, not an exception.

- Log each platform's outcome to the sheet as it happens, not in a batch at the end.
- Do not retry a failed channel more than once automatically. Auth failures and rate limits do not
  resolve on an immediate retry, and a blind retry loop risks double-posting.
- **A duplicate post is worse than a missing one.** If a call's outcome is genuinely unclear, check
  before re-sending: `tiktok_publish_status` for TikTok, the Buffer queue for the rest.
- Report the full picture at the end: what published, what didn't, and why. Never round a partial
  publish up to "posted everywhere".

## What not to do

- Don't publish without the approval gate, on a scheduled run or otherwise, unless the user has
  explicitly set up hands-off publishing and that standing approval is recorded in the run's row.
- Don't post the source video's audio, script, or on-screen text. Stage 2's originality gate exists
  to catch this; if something slipped through, stop and fix it rather than publishing it to nine
  platforms.
- Don't invent post URLs. If Buffer returns a queue ID rather than a live URL, log the queue ID and
  say it's queued.
