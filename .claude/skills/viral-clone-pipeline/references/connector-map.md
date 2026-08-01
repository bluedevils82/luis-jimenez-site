# n8n node → our stack

Mapping of every node in the original four-step diagram to what actually runs it here.

## Step 1 — Clone a viral TikTok video

| n8n node | Replacement | Notes |
|---|---|---|
| Trigger: Get TikTok URL via Telegram | User message, or a Routine (`create_trigger`) | No Telegram connector. IFTTT Webhooks (`json_event`) can accept an inbound POST if a real trigger endpoint is wanted. |
| Download TikTok Video (RapidAPI) | **No equivalent** | See "Gaps" below. Upload or direct mp4 URL instead. |
| Extract Video Thumbnail | `get_screenshot`-style frame from `video_analysis` output | Scene analysis returns per-scene stills. |
| Upload Thumbnail to Cloudinary | `media_import_url` / Google Drive `create_file` | Higgsfield storage is the working store; Drive is the archive. |
| Analyze Thumbnail (GPT-4o Vision) | Claude reads the image directly (`Read`) | No separate vision API call needed. |
| Extract Overlay Text (GPT-4o) | Claude, from the scene analysis stills | Same. |
| Download TikTok Audio | Included in `video_analysis_create` | Not a separate step. |
| Transcribe Audio to Script (Whisper) | `video_analysis_status` output | Returns transcript with the scene breakdown. |
| Generate Unique Template ID | `run_id` (`YYYYMMDD-HHMM-<4 chars>`) | Generated once per run in Stage 1. |
| Save Original Video to Google Sheets | Zapier → Google Sheets `create_row` | Already connected, 2 accounts. |

## Step 2 — Suggest new content idea

| n8n node | Replacement | Notes |
|---|---|---|
| Suggest Similar Idea (Perplexity) | `WebSearch` | Claude searches and synthesizes directly. |
| Clean Perplexity Response | — | Not needed; no JSON scrubbing between nodes. |
| Rewrite Script, Caption, Overlay | Claude | The model *is* the node here. |
| Split Rewritten Content into Sections | — | Not needed. |
| Generate New Video ID | `run_id` + stage suffix | |
| Save Rewritten Video to Google Sheets | Zapier → Google Sheets `create_row` | |

## Step 3 — Create the new video with your avatar

| n8n node | Replacement | Notes |
|---|---|---|
| Fetch Available Avatars | `show_characters`, `show_reference_elements` | |
| Generate Video with Avatar | `ugc-flow` workflow → `generate_video` | Load via `get_workflow_instructions`. |
| Wait for Avatar Rendering (3 min) | Poll `job_display` / workflow status | Poll, don't sleep. |
| Fetch Avatar Video URL | Same poll response | |
| Add Overlay Text with JSON2Video | `shorts_studio_create`, or baked into generation | **Closest gap.** See "Gaps". |
| Wait for Caption Rendering | `shorts_studio_status` | |
| Fetch Final Video from JSON2Video | `shorts_studio_status` output | |
| Update Final Video URL in Sheet | Zapier → Google Sheets `update_row` | |

## Step 4 — Publish to 9 platforms

| n8n node | Replacement | Notes |
|---|---|---|
| Send Video URL via Telegram | Report in chat; `SendUserFile` for the file | |
| Send Final Video Preview | `SendUserFile` | |
| Assign Social Media IDs | Buffer channel IDs, resolved at runtime | |
| Upload Video to Blotato | **Buffer via Zapier** | The single biggest substitution. |
| INSTAGRAM / FACEBOOK / THREADS / LINKEDIN / PINTEREST / BLUESKY / YOUTUBE | Buffer, one action per channel | Availability depends on what is connected in Buffer — verify at runtime. |
| TIKTOK | `tiktok_publish` (native) | Preferred over Buffer; posts the file directly. Requires `tiktok_connect` first — **no account connected as of this writing**. |
| TWITTER | Buffer, or IFTTT `post_new_tweet_with_image` | X is connected in IFTTT. |

## Gaps — things the original does that we cannot

Stated plainly so they don't get discovered mid-run:

1. **TikTok video download.** `video_analysis_create` accepts YouTube URLs or uploaded files only.
   `media_import_url` needs a direct HTTPS media URL under 50 MB, not a TikTok page URL. The user
   must upload the file or supply a direct CDN link. A Zapier RapidAPI action could close this if
   it's worth enabling.
2. **Telegram trigger.** No Telegram connector. Chat, Routines, or an IFTTT webhook instead.
3. **JSON2Video caption burn-in.** No dedicated caption-overlay service. Overlay text is either
   baked in at generation time by the UGC/faceless workflows, or applied by Shorts Studio restyling.
   Neither is a like-for-like replacement for arbitrary timed text over an existing render.
4. **Blotato's one-call fan-out.** Buffer is per-channel, so Stage 4 is N calls, and partial failure
   is a normal outcome to be reported rather than an error to retry blindly.

## Connector status at build time

Connected and enabled: Higgsfield, Zapier (Stripe, **Buffer**, **Google Sheets**, Canva), IFTTT
(X, Webhooks, Email, RSS, Date & Time), Google Drive, Gmail, Notion, Canva, Figma, Runway, OpenArt,
Granola, Bigdata.com, Indeed.

Not verified: which channels are connected inside Buffer (the inspect call was declined during the
build). Stage 4 resolves this at runtime before promising any platform.
