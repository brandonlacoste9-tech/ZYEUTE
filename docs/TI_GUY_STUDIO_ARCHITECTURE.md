# Ti-Guy Studio Architecture

**Ti-Guy Studio is a production-ready AI video generation pipeline orchestrated by Colony OS, featuring layered model execution (DeepSeek V3.2 director, Mistral/Fara scriptwriting, Longcat/Ovis/Z-Image art, Hunyuan/Runway/Kling cinematography, Vibe/Vis audio), explicit GPU allocations, Supabase task queuing, and comprehensive fallback chains to ensure resilient, scalable content generation.**

---

## Architecture Diagram

```
User Input Layer
  [Ti-Guy Chat]
       |
       v
Director Layer
  [DeepSeek V3.2] <--- polls colony_tasks (Supabase)
       |
       v
Scriptwriter Layer
  [Mistral 3 + Fara-7B]
       |
       v
Image Artist Layer
  [Longcat-Image ; Ovis ; Z Image]
       |
       v
Cinematographer Layer
  [Hunyuan 1.5 distilled -> Runway Gen 4.5 || fallback Kling]
       |
       v
Sound Designer Layer
  [Vibe Voice ; Vis Audio]
       |
       v
Utility / Post Layer
  [Hunyuan OCR++ ; Steady Dancer ; Live Avatar]
       |
       v
Assembly & Storage
  [assembly_bee.py -> Supabase storage + metadata]
```

---

## Pipeline Table: Models, GPU Allocation, Fallback

| Layer | Primary Models | GPU Allocation | Worker Bee | Fallback |
|-------|---------------|----------------|------------|----------|
| **User Input** | Ti-Guy Chat | CPU + small GPU for embeddings | n/a | n/a |
| **Director** | DeepSeek V3.2 | 1× A100 40GB (or 2×A10s) | director_bee.py | degrade to smaller DeepSeek distilled |
| **Scriptwriter** | Mistral 3; Fara-7B | 1× A100 80GB (Mistral); 1× A10 (Fara) | script_bee.py | use Fara-only or cached templates |
| **Image Artist** | Longcat-Image; Ovis; Z Image | 2× A100 80GB (batched) | image_bee.py | route to lower-res Longcat or CPU fallback |
| **Cinematographer** | Hunyuan 1.5 dist; Runway Gen 4.5; Kling | 4× A100 80GB (distributed); GPU farm autoscale | video_bee.py | if Runway fails → Kling; if Kling fails → Hunyuan render-only |
| **Sound Designer** | Vibe Voice; Vis Audio | 1× A40 or 1× A10 | audio_bee.py | TTS fallback to Vibe-lite |
| **Utility/Post** | Hunyuan OCR++; Steady Dancer; Live Avatar | 1× A10 per service | assembly_bee.py | CPU-based OCR; simplified effects |
| **Assembly & Storage** | Supabase + stitching | CPU + 1× GPU for encode | assembly_bee.py | chunked assembly; offload to cloud encoder |

---

## Data Flow & Queueing

All worker bees poll the `colony_tasks` table in Supabase for new assignments. Each task record contains: `task_id`, `layer`, `model`, `payload`, `priority`, `status`, `gpu_req`, and `attempt_count`. The Director bee (DeepSeek V3.2) receives user requests, breaks them into subtasks, and writes child tasks back to `colony_tasks` for downstream workers (script, image, video, audio). Status reporting follows the Finance Bee pattern: each bee logs progress to a `status_updates` table and triggers webhooks to the Colony OS dashboard for real-time monitoring.

---

## GPU Allocation Rationale & Autoscaling

High-throughput stages (Image Artist, Cinematographer) receive multi-GPU nodes and distributed batching to handle concurrent requests. Scriptwriting and audio tasks use single-GPU instances with mixed precision (FP16) to balance quality and cost. Progressive generation and result caching reduce peak GPU time by reusing intermediate outputs when possible. The Cinematographer layer includes autoscaling logic to spin up additional GPU farm nodes during traffic spikes, ensuring sub-5-minute latency even under load.

---

## Fallback Logic (Explicit)

**Video Generation:**
- Primary: Runway Gen 4.5
- If Runway errors or times out → switch to Kling
- If Kling fails → run Hunyuan 1.5 distilled in render-only mode

**Image Generation:**
- Prefer Longcat-Image or Ovis for high quality
- If quota exceeded or latency issues → fall back to Z Image low-res + upscaling post-process

**Retry Policy:**
- Exponential backoff (2^attempt seconds)
- Max 3 retries per task
- `attempt_count` tracked in `colony_tasks`; after limit, task marked as `failed` and alert sent to Colony OS

---

## Supabase Integration

- **Tables:** `colony_tasks`, `status_updates`, `generated_assets`
- **Storage:** Final videos, images, and audio clips stored in Supabase Storage with public URLs and metadata
- **Real-time:** PostgreSQL triggers push task updates to connected clients via Supabase Realtime channels

---

## Next Steps (Implementation Checklist)

1. **Export diagram to SVG** with labeled arrows, GPU icons, and Supabase queue boxes
2. **Add per-task SLA and cost estimates** to `colony_tasks` schema
3. **Implement `director_bee.py`** with task decomposition and priority logic
4. **Implement `video_bee.py`** with full fallback handler (Runway → Kling → Hunyuan)
5. **Set up Supabase webhooks** for real-time status updates to Colony OS dashboard
6. **Deploy GPU autoscaling rules** for Cinematographer layer

---

**Optional:** Generate high-fidelity SVG diagram with custom canvas size and color theme upon request.
