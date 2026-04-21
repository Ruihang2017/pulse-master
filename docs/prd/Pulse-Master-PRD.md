# Pulse — Master Product Requirements Document

> **Personalised AI Tech Feed for Engineers**
> *Your personal research analyst that never sleeps, tuned to your career.*

| Field | Value |
|---|---|
| **Document Version** | 2.0 (Master PRD) |
| **Status** | Draft for Phase-Level Breakdown |
| **Last Updated** | April 21, 2026 |
| **Target MVP Launch** | 6 weeks from project kickoff |
| **Total Roadmap Horizon** | 9 phases (~9–12 months to full vision) |
| **Owner** | Product Engineering |

---

## How to Use This Document

This is the **master PRD** for Pulse. It establishes the product vision, users, architecture, and strategic phasing. Each phase in **Part V** is designed to be lifted into its own detailed PRD in a separate working session — the phase sections contain enough scope, dependencies, and open questions to act as self-contained context.

**Structure:**
- **Parts I–IV** = shared context (vision, users, architecture, data model). Read once, reference throughout.
- **Part V** = phased delivery plan. Each phase is the seed for a dedicated phase PRD.
- **Parts VI–VII** = cross-cutting concerns (metrics, risks).

**Recommended workflow for phase-level PRDs:**
1. Hand a future Claude session this entire master PRD as context.
2. Ask it to produce a detailed PRD for one specific phase (e.g., "Generate the detailed PRD for Phase 2: Content Ingestion Pipeline").
3. The phase section's "Open Questions for Detailed PRD" acts as the agenda for that session.

---

# Part I — Product Vision & Strategy

## 1. Executive Summary

Pulse is a personalised, AI-curated tech intelligence feed for software and product engineers. Users describe their role, stack, and career goals through a conversational onboarding experience. An autonomous AI pipeline then researches the web daily, scores content against each user's profile, summarises what matters in the user's own context, and delivers it as a visually rich, Pinterest-style card feed.

Pulse is differentiated on three axes:

1. **Career-contextual curation** — not "trending in tech" but "relevant to *your* growth".
2. **Signal-to-noise ratio** — 10–20 cards/day, not 200.
3. **Visual scannability** — a feed you'd *want* to open, not a newsletter you skim guiltily.

The MVP targets the "Ambitious IC" — senior engineers drowning in HN, Twitter, and newsletters — and reduces their daily tech-triage time from ~30 min to under 5 min.

## 2. Vision, Mission & Operating Principles

### 2.1 Vision (3-year)
Every engineer in the world has a personal research analyst who understands their career, their stack, and what matters to them — and no engineer ever feels "behind" again.

### 2.2 Mission (MVP → Year 1)
Build the highest signal-per-minute daily feed for senior engineers by combining user-stated context with AI curation and a delightful, visual consumption experience.

### 2.3 Operating Principles
- **Signal over volume** — one relevant card beats ten plausible ones.
- **Context over category** — we never curate by topic alone; the user's goal is always the primary axis.
- **Scannable by default** — the feed rewards a 30-second glance as much as a 30-minute deep dive.
- **Transparent AI** — every curation decision is explainable ("*why this card*").
- **Respect attention** — no dark patterns, no infinite scroll traps, no push notifications without explicit opt-in.

## 3. Problem Statement (Expanded)

### 3.1 The User Pain
Staying technically current is the single most persistent pain point for engineers. Every senior engineer we'd interview likely reports some version of:

> *"I know I'm falling behind on something important, but I don't know what. I skim HN, subscribe to five newsletters, and still feel like I'm missing the thing that actually matters for my career."*

This is a **curation problem dressed as an information problem**. The content exists — it's just not organised around the individual.

### 3.2 Why Existing Solutions Fail

| Source | Core Problem | Why It Doesn't Solve Pulse's Problem |
|---|---|---|
| Medium / dev.to | Firehose of low-signal content; SEO-driven | No signal filter; ~90% irrelevant |
| Newsletters (TLDR, Refind) | Editorial but generic | Not tuned to *your* stack or goal |
| Twitter / X | Algorithm-driven engagement bait | Optimises for outrage, not learning |
| Hacker News | Broad tech community | Frontpage is a lowest-common-denominator |
| RSS readers (Feedly) | Full control | Requires manual curation — the problem we're solving |
| Podcasts / YouTube | Deep but slow | Not scannable; can't skim in 5 min |

### 3.3 The "Why Now"
- **LLMs** are now cheap and accurate enough to do per-user summarisation economically.
- **Embedding models** make semantic deduplication and personalisation tractable.
- **Image generation** is fast and cheap enough to give every card a distinctive visual.
- **Engineers as consumers** have proven willing to pay for AI-native tools (Cursor, Raycast Pro, etc.).

## 4. Market Opportunity

### 4.1 TAM / SAM / SOM (rough)
- **TAM:** ~28M software developers globally (Evans Data, 2024 est.).
- **SAM:** ~8M mid-to-senior English-speaking engineers in tech-forward markets.
- **SOM (Year 1):** ~50K signups, ~10K DAU at steady state.

### 4.2 Monetisation Hypothesis (detailed in Phase 8)
- **Free tier:** capped feed size (~10 cards/day), basic sources.
- **Pro tier ($8–12/mo):** unlimited feed, deeper summaries, advanced sources (papers, release notes), email digest, saved library, export.
- **Teams tier (future):** shared feeds for engineering teams / learning circles.

## 5. Competitive Landscape

| Competitor | Strengths | Weaknesses | How Pulse Wins |
|---|---|---|---|
| **Refind** | Human-curated, high quality | Not personalised to career goals | Per-user AI curation |
| **TLDR** | High signal, popular | Same content for everyone | Visual, individualised |
| **The Batch** (DeepLearning.AI) | Authoritative AI content | AI-only, not personalised | Stack-aware, goal-aware |
| **Feedly AI** | Powerful, flexible | Steep curve, built for power users | Zero-config for 80% of value |
| **Hacker News** | Community signal | No personalisation | Contextual relevance scoring |
| **Twitter lists** | Real-time, social | Noisy, addictive, algorithmic | Quiet, intentional, daily |

### 5.1 Strategic Positioning
> *Refind is for editors. Feedly is for power users. Pulse is for engineers who just want to know what matters today.*

---

# Part II — Users & Experience

## 6. User Personas

### 6.1 Primary Persona — "Maya, the Ambitious IC"
- **Role:** Senior full-stack engineer, 6 YoE
- **Stack:** TypeScript, React, Node, Postgres; learning LLM tooling
- **Career goal:** Staff engineer in 18 months; AI specialisation
- **Current behaviour:** Subscribes to 7 newsletters, opens maybe 2; skims HN at coffee; saves articles to Readwise but rarely re-reads
- **Frustration:** *"I feel like I'm missing the thing I should be learning."*
- **Success with Pulse:** Opens feed during morning coffee, finds 2 cards that shape her week's learning

### 6.2 Secondary Persona — "Dev, the Career Switcher"
- **Role:** Mid-level backend engineer, 4 YoE, transitioning to AI/ML
- **Stack:** Python, Go; exploring PyTorch, LangChain
- **Career goal:** Land an AI engineering role within 6 months
- **Current behaviour:** Heavy YouTube, paper-reading sprees, gets lost in tangents
- **Frustration:** Doesn't know canonical sources; gets recommendation fatigue
- **Success with Pulse:** Gets a structured, paced exposure to the AI/ML ecosystem

### 6.3 Tertiary Persona (Post-MVP) — "Sara, the Tech Lead"
- **Role:** Tech lead / EM, 10 YoE
- **Context:** Less hands-on coding, wants high-level industry/architectural awareness
- **Value:** Curation of system design, architecture, and team/process content
- **Deferred to:** Phase 6 (expanded sources) + Phase 8 (Teams tier exploration)

### 6.4 Anti-Personas (who we are NOT building for in MVP)
- **Students learning fundamentals** — Pulse assumes professional context.
- **Casual tech enthusiasts** — our density/depth is wrong for them.
- **Content creators / editors** — they want tools, not a feed.

## 7. Core User Journeys

### 7.1 Journey A — First-Time User (Onboarding → First Aha)
```
Landing Page → Sign Up (Clerk) → Conversational Onboarding (~3 min)
  → "Building your first feed…" (synchronous pipeline, ~30s)
  → First Feed View → First Card Opened → First Save → Done
```
**Success criterion:** First "save" within 10 minutes of signup.

### 7.2 Journey B — Daily Habit (Retained User)
```
Morning push/email (optional) → Open app → Scan feed (30s)
  → Open 2-4 cards → Save 1-2 → Close
```
**Success criterion:** Median daily session = 3–6 min, 4+ cards opened.

### 7.3 Journey C — Re-Engagement (Lapsed User)
```
Email digest "You missed 12 cards this week" → Click → Feed with highlighted stale cards → Resume
```
**Success criterion:** ≥15% of lapsed users (7+ days idle) re-engage via digest.

### 7.4 Journey D — Profile Refinement
```
Feed → Dismiss card → "Why?" prompt (optional) → Profile updated silently
  → OR → Settings → Chat with AI → "I'm pivoting to distributed systems" → Profile re-tuned
```
**Success criterion:** Dismiss rate trends down week-over-week for retained users.

## 8. Design Principles

1. **Glance-first, depth-on-demand.** The feed is scannable in 30s; any card can be expanded for depth.
2. **One feed, one purpose.** No dashboards, no home screen, no distractions. Open → feed.
3. **Visual distinctiveness.** Every card has a unique image; the feed is *visually* memorable.
4. **Explain every choice.** Relevance badges tell users *why* a card is there.
5. **Fail quietly.** Pipeline outages show a "yesterday's best" fallback, never an error.
6. **No engagement dark patterns.** No streaks, no notifications-by-default, no infinite scroll.

---

# Part III — Product Scope

## 9. Feature Inventory (Master List)

This is the complete feature inventory across all phases. Each feature is tagged with its target phase.

### Account & Identity
- [P0] Email + OAuth sign up / sign in (Clerk)
- [P0] Session management
- [P1] Profile CRUD (view, edit, delete)
- [P1] Account deletion / data export (GDPR)

### Onboarding
- [P1] Conversational onboarding chat (Claude-powered)
- [P1] Structured User Context Profile generation
- [P1] Profile review & confirm screen
- [P5] Re-onboarding chat (triggered by user or by drift detection)

### Content Ingestion
- [P2] Source adapter: Hacker News
- [P2] Source adapter: GitHub Trending
- [P2] Source adapter: arXiv (cs.AI, cs.SE)
- [P2] Article storage (raw + embedding)
- [P2] Embedding-based deduplication
- [P2] Scheduled daily pipeline trigger
- [P6] Source adapter: dev.to
- [P6] Source adapter: GitHub release notes (curated repos)
- [P6] Source adapter: curated engineering blogs
- [P6] Source adapter: Tavily/Brave trending discovery
- [P6] Source adapter abstraction & fallback to RSS

### AI Curation
- [P3] Per-user relevance scoring (Claude Haiku)
- [P3] Per-user summarisation (Claude Sonnet)
- [P3] Image prompt generation
- [P3] Image generation (Flux Schnell via Replicate)
- [P3] Fallback to topic-based stock imagery
- [P3] Relevance reason generation ("why this card")
- [P5] Prompt A/B testing framework
- [P5] Summary quality monitoring

### Feed Experience
- [P4] Masonry card grid
- [P4] Card click → expanded view
- [P4] Save / Dismiss actions
- [P4] Link-out to original source
- [P4] Basic topic/tag filter
- [P4] "Saved" view
- [P5] Relevance reason badge
- [P7] Shareable public card pages (SEO)
- [P7] Search within feed

### Personalisation & Feedback
- [P5] Interaction event tracking
- [P5] Weekly profile embedding refresh
- [P5] Down-weighting dismissed topics
- [P5] "Why was this shown?" tooltip
- [P5] Feedback-driven prompt tuning

### Engagement & Retention
- [P6] Daily email digest (opt-in)
- [P6] Weekly "what you missed" digest
- [P6] Browser push for breaking items (opt-in)
- [P7] Referral loop / invite system

### Growth
- [P7] Public card pages with SEO
- [P7] Referral tracking
- [P7] Social sharing metadata (OG images)

### Monetisation
- [P8] Stripe integration
- [P8] Free vs Pro tier gating
- [P8] Billing portal
- [P8] Usage metering

### Platform & Infra
- [P0] Monorepo structure
- [P0] CI/CD pipeline
- [P0] Observability (logs, metrics, traces)
- [P0] Error tracking (Sentry)
- [P0] Feature flags (PostHog or similar)
- [P0] Environment separation (dev/staging/prod)

## 10. MVP vs Post-MVP Boundary

**MVP (Phases 0–4)** — shippable product that delivers the core value proposition.
- A new user can sign up, onboard, and see a personalised feed within their first session.
- Feed refreshes daily with 10–20 cards scored against their profile.
- Users can save, dismiss, and link out.

**Post-MVP (Phases 5–8)** — the product that earns retention, grows virally, and generates revenue.

## 11. Explicit Non-Goals (MVP)

To keep MVP scope honest, the following are explicitly **out**:
- Social features: no comments, no follows, no upvotes, no profile pages.
- Full article hosting: we always link out to source.
- Native mobile apps: PWA-first.
- Video, audio, podcast content: text-only at MVP.
- Paid tiers at MVP: free for all during validation window.
- User-submitted content or RSS import.
- Team / workspace accounts.
- Multi-language content (English-only at MVP).
- Offline mode beyond basic PWA caching.

---

# Part IV — Technical Foundation

## 12. System Architecture Overview

```
┌──────────────────────────────────────────────────────────────┐
│                     USER (Web / PWA)                         │
│                   Next.js 15 (Vercel)                        │
└───────────────┬────────────────────────────────┬─────────────┘
                │                                │
                │ HTTPS                          │ Server Actions / tRPC
                ▼                                ▼
        ┌───────────────┐            ┌────────────────────┐
        │    Clerk      │            │   API (Hono/Fastify)│
        │    (Auth)     │            │   (Railway)         │
        └───────────────┘            └─────┬───────────────┘
                                           │
           ┌───────────────────────────────┼───────────────────────────┐
           │                               │                           │
           ▼                               ▼                           ▼
   ┌──────────────┐               ┌───────────────┐           ┌───────────────┐
   │  Postgres    │               │    Inngest    │           │ Anthropic API │
   │  + pgvector  │               │  (Scheduler)  │           │  (Claude)     │
   │  (Railway)   │               └───────┬───────┘           └───────────────┘
   └──────────────┘                       │
                                          ▼
                              ┌───────────────────────┐
                              │  Pipeline Workers     │
                              │  ─────────────────    │
                              │  1. Source Crawlers   │──► HN, GitHub, arXiv, ...
                              │  2. Dedup (pgvector)  │
                              │  3. Scorer (Haiku)    │──► Anthropic
                              │  4. Summariser (Sonnet)│──► Anthropic
                              │  5. Image Generator   │──► Replicate (Flux)
                              │  6. Card Writer       │──► Postgres
                              └───────────────────────┘
```

## 13. Tech Stack & Justification

| Layer | Choice | Rationale | Alternative Considered |
|---|---|---|---|
| **Frontend** | Next.js 15 (App Router) + Tailwind + shadcn/ui | SSR for SEO (Phase 7); React Server Components minimise client JS | Remix (less ecosystem), Astro (worse for interactive feeds) |
| **Backend API** | Hono on Node.js | Lightweight, edge-compatible, TS-first | Fastify (heavier), Express (dated), NestJS (overkill) |
| **Language** | TypeScript end-to-end | Unified type system; shared schemas between FE/BE | — |
| **AI** | Anthropic Claude (Haiku + Sonnet) | Best summarisation quality; tiered pricing for scorer vs summariser | OpenAI GPT (viable alt), Gemini (less mature) |
| **Embeddings** | Voyage AI (`voyage-3-large`) or OpenAI `text-embedding-3-small` | Voyage for quality, OpenAI for simplicity | Cohere, self-hosted |
| **Search** | Brave Search API + Tavily | Dev-friendly, priced for low volume | SerpAPI, Exa |
| **Image Gen** | Flux Schnell via Replicate | Cheap (~$0.003/image), fast, good aesthetic | DALL-E 3 (costlier), SDXL (self-host) |
| **Database** | Postgres 16 + pgvector | Relational + embeddings in one system; avoids sync complexity | Separate vector DB (Pinecone/Qdrant) |
| **Auth** | Clerk | Fastest path to OAuth + sessions | Auth.js (more config), Supabase Auth |
| **Scheduler / Queue** | Inngest | Serverless, retries, durable execution, observability | BullMQ (self-hosted), Temporal (heavy) |
| **Hosting (FE)** | Vercel | First-class Next.js support | Cloudflare Pages |
| **Hosting (BE/DB)** | Railway | Postgres + Node monorepo with minimal ops | Fly.io, Render |
| **Observability** | Axiom (logs) + Sentry (errors) + PostHog (product) | Unified cheap stack for pre-scale | Datadog (enterprise pricing) |
| **Feature Flags** | PostHog | Same tool as product analytics | LaunchDarkly, Unleash |
| **CI/CD** | GitHub Actions | Default, free for public; integrates with Vercel/Railway | CircleCI |
| **Testing** | Vitest + Playwright | Fast, modern | Jest, Cypress |
| **Payments (Phase 8)** | Stripe | Industry standard | Paddle, Lemon Squeezy |

## 14. Data Model (Full)

```
User
  id             uuid PK
  clerk_id       text UNIQUE
  email          text
  created_at     timestamptz
  deleted_at     timestamptz NULL
  timezone       text              -- for daily-delivery timing

UserProfile
  user_id            uuid PK FK
  role               text           -- e.g. "Senior Full-Stack Engineer"
  years_experience   int
  primary_stack      text[]         -- e.g. ["TypeScript", "React", "Postgres"]
  secondary_stack    text[]         -- learning interests
  career_goal        text           -- free-form, e.g. "Staff eng in 18mo"
  interests          text[]         -- e.g. ["LLMs", "DX", "Distributed Systems"]
  learning_style     enum('depth','breadth','mixed')
  raw_onboarding     jsonb          -- full onboarding transcript
  embedding          vector(1024)   -- for content matching
  updated_at         timestamptz
  version            int            -- incremented on re-onboarding

Source
  id             uuid PK
  slug           text UNIQUE        -- e.g. "hacker-news", "arxiv-cs-ai"
  display_name   text
  type           enum('api','rss','scrape')
  config         jsonb
  enabled        bool
  last_run_at    timestamptz

Article
  id             uuid PK
  source_id      uuid FK
  source_url     text UNIQUE
  title          text               -- original title
  raw_content    text               -- extracted body
  published_at   timestamptz
  fetched_at     timestamptz
  embedding      vector(1024)
  dedup_cluster  uuid NULL          -- cluster ID when near-duplicate

Card
  id                uuid PK
  user_id           uuid FK
  article_id        uuid FK
  title             text           -- AI-rewritten
  abstract          text           -- AI-generated, user-contextualised
  key_takeaway      text
  tags              text[]
  image_url         text
  image_prompt      text
  relevance_score   int            -- 0-100
  relevance_reason  text           -- e.g. "Matches your goal: Staff Eng"
  model_version     text           -- for A/B & rollback
  created_at        timestamptz
  delivered_at      timestamptz NULL
  status            enum('active','dismissed','archived')

Interaction
  id             uuid PK
  user_id        uuid FK
  card_id        uuid FK
  action         enum('view','open','save','dismiss','not_relevant','share')
  dwell_ms       int NULL          -- for 'open'
  created_at     timestamptz

SavedCard
  user_id        uuid
  card_id        uuid
  saved_at       timestamptz
  PRIMARY KEY (user_id, card_id)

PipelineRun
  id             uuid PK
  user_id        uuid FK NULL      -- null for global stages
  stage          enum('crawl','dedup','score','summarise','image','assemble')
  status         enum('pending','running','success','failed')
  started_at     timestamptz
  finished_at    timestamptz
  error          text NULL
  metrics        jsonb             -- tokens, latency, cost

Subscription (Phase 8)
  user_id        uuid PK FK
  tier           enum('free','pro')
  stripe_id      text
  status         text
  current_period_end timestamptz
```

**Key indexes:**
- `Card (user_id, created_at DESC)` — feed query
- `Card (user_id, status)` — saved/dismissed views
- `Article (embedding vector_cosine_ops)` — dedup
- `Interaction (user_id, card_id)` — feedback aggregation

## 15. External Integrations

| Service | Purpose | Failure Mode | SLA Requirement |
|---|---|---|---|
| Anthropic API | Scoring + summarisation | Retry w/ backoff; fall back to yesterday's feed | 99% pipeline success |
| Replicate (Flux) | Image generation | Fallback to stock imagery | Non-blocking |
| Brave Search | Trending topic discovery | Skip this source for the day | Non-blocking |
| Tavily | Deep-content retrieval | Skip | Non-blocking |
| Clerk | Auth | Hard failure — block login | 99.9% |
| Replicate / OpenAI | Embeddings | Retry; if fails, skip dedup for batch | Non-blocking |
| Stripe (P8) | Billing | Hard failure on purchase flow only | 99.9% |

## 16. Security & Privacy

### 16.1 Data Handling
- All user profile data encrypted at rest (Postgres TDE or app-level AES-256 for sensitive fields).
- TLS 1.3 in transit everywhere.
- No PII in logs; structured logging with redaction middleware.
- Onboarding transcripts stored with user consent; deletable on request.

### 16.2 Compliance
- **GDPR**: right to access, right to deletion, data portability (export as JSON).
- **CCPA**: equivalent for California users.
- **SOC 2** readiness: deferred to post-revenue (Phase 8+).

### 16.3 AI Safety
- No user PII sent to Anthropic API beyond profile fields user consented to.
- System prompts versioned and auditable.
- Rate limits per user to prevent abuse.

### 16.4 Authentication & Authorization
- Clerk handles auth; session JWTs verified on every API call.
- Row-level security in Postgres for defence-in-depth.
- API keys for internal services rotated quarterly.

## 17. Performance & Reliability Requirements

| Requirement | Target | Measurement |
|---|---|---|
| Feed load (p75) | < 1.5s | RUM via PostHog |
| Feed load (p95) | < 3s | RUM |
| Card expand | < 500ms | RUM |
| Onboarding completion | < 4 min median | Funnel analytics |
| Daily pipeline success rate | ≥ 99% | PipelineRun table |
| API availability | 99.5% | Uptime monitoring |
| Pipeline latency (end-to-end) | < 30 min for 10K users | Pipeline metrics |
| AI cost per active user / month | < $0.50 | Cost attribution |

## 18. Infrastructure & DevOps

- **Environments:** `dev` (local), `preview` (per-PR Vercel), `staging` (shared), `prod`.
- **Database migrations:** Drizzle or Prisma migrations, auto-run on deploy with advisory locks.
- **Secrets:** Doppler or Infisical, synced to Vercel/Railway.
- **Backups:** Daily Postgres snapshots, retained 30 days; weekly snapshots retained 1 year.
- **DR:** RPO 24h, RTO 4h — acceptable for MVP.
- **Monitoring:** Synthetic checks every 5 min; page on 3 consecutive failures.

---

# Part V — Phased Delivery Plan

> Each phase below is designed to be extracted into its own detailed PRD. Hand this master PRD + the target phase section to a Claude session and ask for the detailed phase PRD.

## Phase Overview

| Phase | Name | Timeline | MVP? | Unlocks |
|---|---|---|---|---|
| **P0** | Foundation & Infrastructure | Week 1 | Yes | All subsequent work |
| **P1** | Onboarding & User Profile | Week 2 | Yes | User identity for curation |
| **P2** | Content Ingestion Pipeline | Week 2–3 | Yes | Raw content supply |
| **P3** | AI Curation Engine | Week 3–4 | Yes | The "magic" — scored, summarised cards |
| **P4** | Feed Experience (UI) | Week 4–6 | Yes | Shippable product |
| **P5** | Personalisation & Feedback Loop | Week 7–9 | No | Retention moat |
| **P6** | Engagement Systems | Week 9–11 | No | Habit formation |
| **P7** | Growth & Virality | Week 11–14 | No | Acquisition engine |
| **P8** | Monetisation | Week 14–18 | No | Revenue |

---

## Phase 0 — Foundation & Infrastructure

**Objective:** Stand up the complete development, deployment, and observability environment so feature work in subsequent phases is unblocked from day one.

**Timeline Estimate:** 1 week
**Dependencies:** None
**Team Composition:** 1 full-stack engineer + 1 devops-capable engineer (can be same person)

### Scope — In
- Monorepo bootstrap (Turborepo or Nx) with `apps/web`, `apps/api`, `packages/db`, `packages/shared`, `packages/ai`
- TypeScript configuration, ESLint, Prettier, Husky, commit hooks
- Next.js 15 app with App Router scaffolding and shadcn/ui baseline
- Hono backend scaffold with health endpoint
- Postgres + pgvector provisioning on Railway (dev + staging + prod)
- Drizzle ORM (or Prisma) set up with initial migration capability
- Clerk auth integrated (sign-in/sign-up pages, session middleware)
- Inngest configured for scheduled jobs
- GitHub Actions CI (lint, typecheck, test, build)
- Vercel + Railway deploy pipelines wired
- Sentry integrated on FE + BE
- PostHog integrated for product analytics + feature flags
- Axiom (or similar) for structured logs
- Environment variable management (Doppler)
- Basic public landing page (pre-product marketing shell)

### Scope — Out (Deferred)
- Any product feature logic
- Payments infrastructure (Phase 8)
- Email infrastructure (Phase 6)
- Internationalization

### Key Deliverables
1. A developer can clone the repo, run `pnpm dev`, and have full stack running locally in < 5 min.
2. Pushing to `main` deploys to staging automatically.
3. Merging a release PR deploys to prod with rollback capability.
4. A failing test blocks merge.
5. A 500 error in prod pages the on-call within 5 min.

### Acceptance Criteria
- [ ] All developers can provision their local env from a single `pnpm install && pnpm db:migrate && pnpm dev`
- [ ] CI runs in under 5 min
- [ ] Sentry captures a manually-triggered test error from both FE and BE
- [ ] Clerk sign-up flow works end-to-end on staging
- [ ] pgvector extension enabled and a test embedding query returns results

### Phase Risks
| Risk | Mitigation |
|---|---|
| Tech choice lock-in before validation | Choose well-known, replaceable tools; document escape hatches |
| Monorepo complexity for 1–2 devs | Start flat; split packages only when clearly warranted |
| Clerk pricing at scale | Modelled at ~$25/mo for 1K MAU free tier; revisit at 10K users |

### Open Questions for Detailed PRD
1. Monorepo tool: Turborepo vs Nx vs pnpm workspaces only?
2. ORM: Drizzle (lightweight, SQL-first) vs Prisma (more features, heavier)?
3. Should we use Cloudflare in front for WAF/caching from day one?
4. What's the bare minimum test coverage policy for P0 to avoid slowing early work?
5. Feature flag strategy: trunk-based with flags, or per-phase branches?

---

## Phase 1 — Onboarding & User Profile

**Objective:** Convert a new signup into a structured User Context Profile, via a conversational onboarding chat, that downstream AI curation can use to make highly relevant decisions.

**Timeline Estimate:** 1 week
**Dependencies:** P0 (auth, DB, Claude API access)
**Team Composition:** 1 full-stack engineer + prompt engineering iteration

### Scope — In
- Onboarding chat UI (React, streaming responses from Claude)
- System prompt for onboarding Claude agent with goal: extract 7 structured fields
- Conversational flow with adaptive follow-up questions (not a rigid form)
- Profile extraction: convert chat transcript → structured `UserProfile` record
- Profile confirmation screen ("Here's what I heard — edit anything that's off")
- User profile embedding generation (from structured + free-text fields)
- Profile CRUD page in settings (view, edit, trigger re-onboarding chat)
- Minimal "building your feed" loading state (actual synchronous pipeline is P3)
- Account deletion endpoint + UI (GDPR)
- Data export endpoint (JSON download of profile + interactions)

### Scope — Out (Deferred)
- Profile drift detection / auto-re-onboarding (P5)
- Multiple "channels" or contexts per user (open question — may be P5+)
- Import from LinkedIn / GitHub (post-MVP)
- Team profiles

### Detailed Features

#### 1.1 Conversational Onboarding
- **Intent:** feel like a chat with a thoughtful mentor, not a form wizard
- **Flow:** AI asks open-ended questions; adapts based on answers; aims to gather all required fields within ~6–10 exchanges
- **Required fields:** role, years_experience, primary_stack, secondary_stack, career_goal, interests, learning_style
- **Completion signal:** AI determines it has enough + user confirms
- **Fallback:** "skip to structured form" for users who prefer it

#### 1.2 Profile Extraction & Embedding
- After chat, a second Claude call extracts structured JSON from the transcript
- Use Anthropic's tool use / structured output for reliability
- Generate embedding from profile summary text (role + goal + interests + stack)
- Store transcript + structured profile + embedding

#### 1.3 Profile Review Screen
- User sees extracted profile in editable form
- Can edit any field, re-run extraction, or re-start chat
- Confirmation triggers first-feed generation (P3 integration point)

#### 1.4 Settings & Management
- View profile
- "Re-onboard" button → restarts chat with prior profile as context
- Delete account (soft delete with 30-day recovery window)
- Export data (JSON)

### Technical Components
- `apps/web/onboarding/*` — chat UI
- `apps/api/routes/onboarding.ts` — streaming endpoint proxying Claude
- `packages/ai/prompts/onboarding.ts` — system prompt + extraction prompt
- `packages/db/schema/userProfile.ts`
- Embedding service wrapper

### Acceptance Criteria
- [ ] New user completes onboarding in ≤ 4 minutes (median)
- [ ] Profile extraction produces valid structured output in ≥ 95% of sessions
- [ ] User can edit any field after extraction
- [ ] Re-onboarding preserves prior profile as context, not discarded
- [ ] Account deletion removes all user data within 7 days

### Phase Risks
| Risk | Mitigation |
|---|---|
| Chat feels gimmicky / slower than a form | A/B test chat vs form; let users skip |
| Extraction produces malformed JSON | Use Claude structured outputs; validate with Zod; fallback to form |
| Users give low-quality answers | System prompt probes for specifics; offers examples |
| Profile goes stale as user grows | Drift detection in P5; explicit "re-onboard" button now |

### Success Metrics
- Onboarding completion rate ≥ 80%
- Median time to completion ≤ 4 min
- % of users who edit profile post-extraction ≤ 30% (signal that extraction is accurate)

### Open Questions for Detailed PRD
1. Fully free-form chat vs structured chat with AI-generated follow-ups?
2. Should we show a progress indicator ("3 of 7 things known")?
3. How long before we force profile refresh? 3 months? Never unless user triggers?
4. Do we support multiple "modes" or "channels" per user at all in this phase (e.g., AI mode + distributed systems mode)?
5. What's the exact schema for the structured profile output? (draft v1 included above; needs refinement)
6. How do we handle users who say "I don't know my career goal yet"?
7. Should onboarding chat be voice-capable?

---

## Phase 2 — Content Ingestion Pipeline

**Objective:** Reliably pull fresh content from multiple sources daily, deduplicate it, and store it with embeddings — ready for curation.

**Timeline Estimate:** 1.5 weeks
**Dependencies:** P0 (DB, scheduler)
**Team Composition:** 1 backend engineer + 1 full-stack for admin UI

### Scope — In
- Source adapter interface (`SourceAdapter` abstraction)
- Hacker News adapter (via Algolia HN API — no rate limits, JSON)
- GitHub Trending adapter (scrape github.com/trending, fallback via unofficial API)
- arXiv adapter (RSS for cs.AI, cs.SE; parse abstracts)
- Article normalisation (title, URL, content, published_at)
- Content extraction for article bodies (Mozilla Readability or Mercury clone)
- Embedding generation per article (Voyage or OpenAI)
- Near-duplicate detection via pgvector cosine similarity
- Deduplication clustering (dedup_cluster_id)
- Inngest-scheduled daily job: 3am UTC run
- Per-source enable/disable config
- Basic internal admin page to view ingestion stats + trigger manual run
- Error isolation: one source failure doesn't halt others

### Scope — Out (Deferred)
- dev.to, release notes, curated blogs (P6)
- Brave/Tavily trending discovery (P6)
- Paywalled / auth-required sources
- Full-text search over articles
- Content quality scoring (that's curation, P3)

### Detailed Features

#### 2.1 Source Adapter Architecture
```
interface SourceAdapter {
  slug: string
  fetch(since: Date): Promise<RawArticle[]>
  // Each adapter handles its own rate limiting, retries, parsing
}
```
Adapters registered in a registry; pipeline iterates over enabled adapters in parallel.

#### 2.2 Hacker News Adapter
- Use Algolia HN API (`https://hn.algolia.com/api/v1/search_by_date`)
- Pull stories with ≥ N points or ≥ N comments in last 24h (tunable)
- Follow URL, extract body via Readability
- Store both HN submission and linked article (dedup against both)

#### 2.3 GitHub Trending Adapter
- Scrape `github.com/trending` (daily + weekly views)
- Filter by language if relevant (TBD — may not be MVP)
- Pull README as "content"
- Tag as `type: repo`

#### 2.4 arXiv Adapter
- Pull from RSS feeds for `cs.AI`, `cs.SE`, `cs.LG`
- Parse abstract, authors, PDF link
- Store abstract as `raw_content`

#### 2.5 Content Extraction
- Use Readability (Mozilla) on all fetched HTML
- Strip boilerplate, ads, navigation
- Preserve headings and code blocks

#### 2.6 Deduplication
- Embed each new article's (title + first 500 chars of content)
- Query pgvector: any existing article within cosine distance threshold (e.g., 0.05)?
- If yes: attach to existing `dedup_cluster_id`
- Clusters represent "this thing is being talked about"; cards reference canonical article

#### 2.7 Scheduled Pipeline
- Inngest cron: `0 3 * * *` UTC (before most user timezones wake)
- Per-source timeout (5 min default)
- Per-source retry (3x exponential backoff)
- Pipeline run logged in `PipelineRun` table

#### 2.8 Admin Observability
- Internal-only page: last-run status per source, article counts, error messages
- Manual "run now" button per source

### Technical Components
- `packages/ingestion/adapters/*`
- `packages/ingestion/dedup.ts`
- `packages/ingestion/extraction.ts`
- `apps/api/workers/ingestion.ts` (Inngest functions)
- `apps/web/admin/ingestion` (internal-only route)

### Acceptance Criteria
- [ ] Daily pipeline ingests ≥ 200 articles across 3 sources
- [ ] Dedup reduces raw count by 15–40% (tunable)
- [ ] A single source failure is logged but doesn't halt pipeline
- [ ] Manual "run now" works within 60s
- [ ] Articles are searchable by source and date in admin view

### Phase Risks
| Risk | Mitigation |
|---|---|
| Source sites block scraping | Use official APIs where possible; respectful user-agent; back off on 429s |
| arXiv abstracts too dense / niche | Tunable per-category enable; user interest-gating in P3 |
| Embedding cost | Voyage Lite or OpenAI `text-embedding-3-small` = ~$0.02 per 1M tokens |
| Dedup false positives | Start with conservative threshold (0.02); tune with human review |
| HTML parsing fragility | Readability + fallback to raw title + URL if extraction fails |

### Success Metrics
- Pipeline success rate ≥ 99% daily
- Avg ingestion time < 15 min for all sources
- Dedup ratio 20–40% (domain-appropriate)
- Source adapter code averages < 150 LOC (sign of good abstraction)

### Open Questions for Detailed PRD
1. Where do we draw the line for "high-signal" at the ingestion stage vs punting to curation? e.g., do we filter HN by minimum points?
2. Should we cache full HTML or just extracted text? (storage vs reparseability tradeoff)
3. What's our retention policy on raw articles? Forever? 90 days?
4. How do we handle articles behind soft paywalls (NYT, WSJ)? Skip? Summarise from snippet?
5. Do we enrich with OpenGraph images from source pages (for fallback card imagery in P3)?
6. Rate limit budget for each source — what's our max requests/day?

---

## Phase 3 — AI Curation Engine

**Objective:** Turn raw articles into personalised, scored, summarised, visually rich cards — the core product intelligence.

**Timeline Estimate:** 1.5 weeks
**Dependencies:** P1 (profiles), P2 (articles)
**Team Composition:** 1 engineer + significant prompt engineering time

### Scope — In
- Per-user, per-article relevance scoring (Claude Haiku, batched)
- Threshold filtering (configurable, default ≥ 60)
- Per-selected-card summarisation (Claude Sonnet)
- Generated outputs per card: title (≤ 80 chars), abstract (2–3 sentences), key takeaway (1 sentence), topic tags, image prompt, relevance reason
- Image generation via Replicate (Flux Schnell)
- Fallback to stock imagery on image-gen failure
- Card writing to `Card` table with `user_id`, `delivered_at` NULL
- Daily per-user pipeline triggered after ingestion completes
- Synchronous "first feed" pipeline triggered at end of P1 onboarding
- Cost tracking per pipeline run (tokens in/out, $)
- Model version tagging for A/B readiness

### Scope — Out (Deferred)
- Prompt A/B testing framework (P5)
- Quality monitoring dashboards (P5)
- Streaming summaries to UI (always batch for MVP)
- Multi-language summaries

### Detailed Features

#### 3.1 Relevance Scoring
- **Model:** Claude Haiku (cheap, fast)
- **Input:** user profile (structured) + article (title + first ~1500 chars)
- **Output:** score 0–100 + 1-sentence justification
- **Batching:** group articles per user into batches of 10–20 for one Haiku call
- **Cost model:** ~$0.005 per 20-article batch; ~200 articles/user/day → ~$0.05/user/day on scoring alone. Target: ≤ $0.10/user/day total.
- **Filtering:** articles below threshold discarded; top N (e.g., 20) proceed to summarisation

#### 3.2 Summarisation
- **Model:** Claude Sonnet
- **Input:** user profile + full article content + scoring justification
- **Output (structured via tool use):**
  ```json
  {
    "title": "string, ≤ 80 chars, rewritten for clarity",
    "abstract": "2-3 sentences, framed in user's stack/context",
    "key_takeaway": "one-line actionable insight",
    "tags": ["3-5 topic tags"],
    "image_prompt": "visual metaphor, no text in image",
    "relevance_reason": "why this matches your profile, ≤ 100 chars"
  }
  ```
- **Copyright:** summary in original voice, never reproducing source prose

#### 3.3 Image Generation
- **Service:** Replicate's Flux Schnell
- **Prompt:** AI-generated + style suffix ("editorial illustration, muted palette, no text")
- **Fallback:** if gen fails or times out, use a topic-tagged stock image from Unsplash API
- **Caching:** articles in same dedup_cluster share generated images across users (big cost saving)
- **Storage:** uploaded to Cloudflare R2 or similar; CDN-served

#### 3.4 Card Assembly
- One card per selected article per user
- Cards created in `Card` table with `status = 'active'`, `delivered_at = NULL`
- `delivered_at` set when user first views the feed that day

#### 3.5 Synchronous First Feed (Onboarding Handoff)
- P1 onboarding completion → triggers immediate curation run for that user
- Uses most recent 24–48h of articles already in DB
- Target completion time: ≤ 45s (show loading UI)
- If pipeline fails: show "your feed is being prepared, we'll email you" (graceful degrade)

### Technical Components
- `packages/ai/scorer.ts`
- `packages/ai/summariser.ts`
- `packages/ai/imageGen.ts`
- `packages/ai/prompts/*` (versioned)
- `apps/api/workers/curation.ts` (Inngest)
- `packages/ai/costTracking.ts`

### Acceptance Criteria
- [ ] Every active user gets 10–20 cards per day
- [ ] Per-user AI cost < $0.50/month at current usage
- [ ] ≥ 95% of summarisation calls produce valid structured output
- [ ] Image fallback triggers without user-visible error
- [ ] First-feed generation completes ≤ 60s for 90% of new users
- [ ] Cards carry explicit model version tag

### Phase Risks
| Risk | Mitigation |
|---|---|
| Summaries feel generic | Inject full user profile, including career goal, into every prompt; iterate with real users |
| Image gen costs balloon | Dedup cluster image sharing; aggressive caching |
| Haiku misses good content | Monitor score distributions; run periodic Sonnet "audit" on rejects |
| Hallucinated summaries | Use grounded summarisation techniques; provide article text in prompt, not links |
| Copyright concerns | Summaries must never quote source >15 words; prompt enforces this |

### Success Metrics
- Per-user daily card count: 10–20 (target 15)
- Relevance score distribution: median ≥ 70 (post-threshold)
- Per-user AI cost: ≤ $0.50/mo
- First-feed generation P75: ≤ 45s

### Open Questions for Detailed PRD
1. Should scoring consider recency (newer = small boost) explicitly, or rely on source filtering?
2. When dedup cluster has articles of varying quality, which do we surface — original source or highest-signal version?
3. Do we allow users to specify "always include X source" preferences?
4. Should the relevance_reason be shown by default or on hover? (ties to UX in P4)
5. What's the exact system prompt? Should we open-source or keep as trade secret?
6. Do we need per-user rate limiting on the AI pipeline to prevent abuse (e.g., user re-onboarding 50 times/day)?
7. How do we handle users whose profile matches almost no content (e.g., very niche stack)?
8. Image style: single consistent aesthetic across all cards, or varied?

---

## Phase 4 — Feed Experience (UI)

**Objective:** Build the shippable, delightful feed interface that makes Pulse something users *want* to open.

**Timeline Estimate:** 2 weeks
**Dependencies:** P3 (cards exist in DB)
**Team Composition:** 1 frontend engineer + design collaboration

### Scope — In
- Feed landing page (authenticated): masonry card grid, responsive
- Card component: cover image, topic tag(s), title, 2-line abstract, relevance badge
- Card click → expanded modal/drawer with: full summary, key takeaway, tags, source link, actions
- Save / Dismiss / Not Relevant actions (with optimistic UI)
- "Saved" view (filter)
- Topic/tag filter pill bar
- Empty states (no cards today, all dismissed, etc.)
- Loading states (skeleton masonry)
- Basic mobile responsiveness (PWA-ready)
- SEO metadata on public pages (landing, about)
- Marketing landing page with sign-up CTA

### Scope — Out (Deferred)
- Relevance reason tooltips/badges (P5 surfaces these)
- Shareable public card pages (P7)
- In-feed search (P7)
- Customizable feed density / layouts
- Offline / full PWA capability

### Detailed Features

#### 4.1 Masonry Grid
- CSS columns or JS library (react-masonry-css)
- 3 columns desktop, 2 columns tablet, 1 column mobile
- Cards sized by image aspect ratio + content length
- Smooth hover states on desktop, tap on mobile

#### 4.2 Card Component
- **Visual hierarchy:** image (dominant) → tag (small) → title (bold, ≤ 2 lines) → abstract (muted, 2 lines) → relevance badge (subtle)
- **Interactive affordances:** subtle hover elevation; save icon appears on hover
- **Accessibility:** full keyboard nav, ARIA labels, sufficient contrast

#### 4.3 Expanded Card View
- Slide-in drawer (desktop) or full-screen sheet (mobile)
- Shows: image, title, full abstract, key takeaway (highlighted), tags, source metadata
- Actions: Open Source (new tab), Save, Dismiss, Not Relevant, Share (P7)
- Keyboard: `esc` closes, `s` saves, `x` dismisses, `j/k` or arrows to navigate cards

#### 4.4 Filtering
- Tag pill bar across top: "All", then top 8 tags from today's feed
- "Saved" tab switches to saved view
- Filters are client-side (today's feed is small enough)

#### 4.5 Empty States
- Pre-pipeline: "Your first feed is being built — this takes ~30s"
- Post-dismissal: "You've cleared your feed. Come back tomorrow."
- Pipeline failure: "Taking longer than usual — here's yesterday's best"

#### 4.6 Performance
- React Server Components for initial render
- Image optimisation via Next/Image + CDN
- Lazy-load images below the fold
- Feed API paginated (even though daily feed is small, future-proof)

### Technical Components
- `apps/web/feed/page.tsx`
- `apps/web/components/Card.tsx`, `CardDrawer.tsx`, `FeedGrid.tsx`
- `apps/api/routes/feed.ts`
- Interaction tracking endpoint

### Acceptance Criteria
- [ ] Feed loads in ≤ 1.5s P75 on 4G simulated
- [ ] Masonry grid has no layout shift after images load
- [ ] Keyboard navigation fully functional
- [ ] Lighthouse scores: Performance ≥ 90, Accessibility ≥ 95, SEO ≥ 90
- [ ] All feed actions work optimistically with graceful error recovery
- [ ] Works smoothly on iOS Safari + Android Chrome

### Phase Risks
| Risk | Mitigation |
|---|---|
| Masonry performance with many cards | Virtualization if > 50 cards; MVP only has ~20/day |
| Card design feels generic | Invest in 2 design iterations; reference Arc, Readwise, Pinterest |
| Drawer UX on mobile feels clunky | Full-screen sheet pattern; test on device early |
| Image loading jank | Aspect ratio reserved via CSS; blur placeholder |

### Success Metrics
- Feed load P75: ≤ 1.5s
- % of users who open at least one card per session: ≥ 70%
- Median cards opened per session: ≥ 4
- Session length: 3–6 min
- Bounce rate on first feed: ≤ 20%

### Open Questions for Detailed PRD
1. Drawer vs full modal vs in-place expand for card details?
2. Infinite scroll or "that's today's feed"? (we say the latter — reaffirm)
3. Surface relevance reason by default, on hover, or in expanded view only?
4. Do we show timestamps on cards? (reads as "stale" or "fresh"?)
5. What's the branded aesthetic? Minimal like Linear? Warm like Readwise? Editorial like The Browser Company?
6. Dark mode at MVP or post-MVP?
7. Do we show AI-generated images with an "AI" badge for transparency?

---

## Phase 5 — Personalisation & Feedback Loop

**Objective:** Move from "profile-based curation" to "learning-based curation" — the feed gets demonstrably better the more a user uses it.

**Timeline Estimate:** 2 weeks
**Dependencies:** P4 (interactions being captured)
**Team Composition:** 1 backend engineer + ML/AI engineering collaboration

### Scope — In
- Interaction event capture (view, open, dwell, save, dismiss, not_relevant, share)
- Weekly job: update user profile embedding based on engagement patterns
- Topic down-weighting: dismissed topics get -N boost in next cycle's scoring
- Relevance reason badge on card (surfaces existing `relevance_reason` field)
- "Why was this shown?" tooltip/explainer
- Prompt A/B testing infrastructure (flag-controlled prompt variants per user)
- Summary quality monitoring dashboard (internal): sample random cards daily, track save rates per prompt version
- Profile drift detection: if interests appear to shift, suggest re-onboarding
- "Not Relevant" with optional free-text reason; logged for analysis

### Scope — Out (Deferred)
- Collaborative filtering (similar-users signals) — post-MVP
- Multi-armed bandit for source weighting — post-MVP

### Detailed Features

#### 5.1 Interaction Enrichment
- Beyond MVP save/dismiss: track dwell time, scroll depth, source clicks
- Events go to PostHog + `Interaction` table (dual-write for analytics + curation)

#### 5.2 Weekly Profile Refresh
- Inngest cron: every Sunday 2am UTC
- Per user: compute "engagement profile" (most-saved tags, dismissed tags, dwell leaders)
- Blend into profile embedding: `new_embedding = 0.7 * stated_embedding + 0.3 * engagement_embedding`
- Log changes for observability

#### 5.3 Topic Down-Weighting
- Track dismissed-topic frequency per user
- In scoring prompt, inject "user has repeatedly dismissed: X, Y" context
- Or: post-scoring penalty on cards tagged with down-weighted topics

#### 5.4 Relevance Reason Surfacing
- Card badge: small colored pill with text like "Matches your goal: Staff Eng"
- Hover/tap → short explanation
- Designs from Arc's "pinned" badges for inspiration

#### 5.5 Prompt A/B Framework
- Each user assigned to cohort via PostHog flag
- Prompts versioned in `packages/ai/prompts`
- Cohort written to `Card.model_version` for attribution
- Dashboard: engagement metrics per cohort

#### 5.6 Profile Drift Detection
- If user's recent engagement tags diverge from stated profile by > X threshold, show soft prompt: "Your interests seem to be shifting towards Y — want to update your profile?"

### Technical Components
- `packages/ai/feedback.ts` (profile refresh logic)
- `apps/api/workers/profileRefresh.ts`
- `packages/ai/prompts/variants/*`
- Internal dashboard pages for prompt performance

### Acceptance Criteria
- [ ] Dismiss rate decreases week-over-week for retained users (target: -2% per week for first 4 weeks)
- [ ] Save rate increases week-over-week for retained users
- [ ] A/B test infrastructure: can ship a new prompt to 10% of users and measure uplift in ≤ 7 days
- [ ] Profile refresh job completes for 10K users in ≤ 20 min
- [ ] Drift detection triggers in a controlled false-positive rate (< 5%)

### Phase Risks
| Risk | Mitigation |
|---|---|
| Feedback loop creates filter bubble | Always preserve ≥ 20% "exploration" slot in feed |
| Dismissals for "read later" reasons skew profile | Separate "save for later" from "not relevant" explicitly |
| Users never dismiss, profile doesn't evolve | Passive signals (dwell, open rate) also contribute |
| Drift detection annoys users | Soft prompt only; easy dismiss; cap to once/month |

### Success Metrics
- Week-over-week save rate: +5% per week for first month
- Week-over-week dismiss rate: -5% per week for first month
- % of users who engage with drift prompt: tracked; aim for low false-positive rate
- Prompt experiment cadence: ≥ 1 shipped experiment per 2 weeks

### Open Questions for Detailed PRD
1. What's the exact blending formula for stated vs learned profile? Tunable?
2. Should users see their "learned" profile separately from stated?
3. How aggressively should we personalise before it feels creepy?
4. Do we expose A/B variant to the user (radical transparency) or keep invisible?
5. How do we handle "Not Relevant" feedback with free-text — LLM-summarised and injected into next prompt?
6. Should we include "explore" cards explicitly labeled as such?
7. What's our strategy against engagement-bait (users click on spicy titles, so we surface more spicy titles)?

---

## Phase 6 — Engagement Systems

**Objective:** Build the habit. Move users from "I sometimes open Pulse" to "Pulse is part of my morning."

**Timeline Estimate:** 2 weeks
**Dependencies:** P4 (feed), P5 (personalisation)
**Team Composition:** 1 full-stack engineer

### Scope — In
- Email infrastructure (Resend or Postmark)
- Daily email digest (opt-in, off by default)
- Weekly "what you missed" digest for lapsed users
- Browser push notifications (opt-in)
- Expanded content sources (dev.to, GitHub release notes, curated blogs)
- Brave/Tavily-powered trending discovery
- Source adapter abstraction improvements
- Timezone-aware delivery ("6am your local time")
- Email unsubscribe + preferences page

### Scope — Out (Deferred)
- SMS notifications
- Native mobile push (PWA-only)
- Slack / Discord integrations
- Team digests

### Detailed Features

#### 6.1 Email Infrastructure
- Resend with React Email for templates
- DMARC/DKIM/SPF setup
- Unsubscribe link in every email, honored immediately
- Bounce + complaint handling

#### 6.2 Daily Digest
- Trigger: 6am user-local time (per user's timezone)
- Content: top 3 cards from today's feed (by relevance score)
- CTA: "See 12 more in your feed"
- Frequency cap: once per day max

#### 6.3 Weekly Re-Engagement Digest
- Target: users idle ≥ 7 days with cards generated
- Content: "You missed 47 cards this week — here are the top 5"
- Send: Sunday evenings local time

#### 6.4 Browser Push
- Opt-in via explicit prompt (not on landing, but after first feed visit)
- Use cases: major releases (e.g., GPT-5 launch), personalised "major event" cards
- Frequency cap: max 2/week

#### 6.5 Expanded Sources
- dev.to: use their API
- GitHub release notes: curated repo list (user-configurable in P8 Pro tier?); ingest releases
- Curated blog feeds: start with a vetted list (Danluu, Simon Willison, etc.); RSS-based
- Tavily/Brave: daily "what's trending in [user's interest]" query injection

#### 6.6 Preferences UI
- Email frequency controls
- Push controls
- Per-source enable/disable (future-facing)

### Technical Components
- `packages/email/templates/*`
- `packages/email/send.ts`
- `apps/api/workers/digest.ts`
- `apps/api/routes/push/subscribe.ts`
- New source adapters in `packages/ingestion`

### Acceptance Criteria
- [ ] Daily digest sent within ±15 min of target time for 99% of users
- [ ] Email opt-in rate ≥ 30%
- [ ] Digest open rate ≥ 25% among opters
- [ ] Push opt-in rate ≥ 10%
- [ ] Expanded sources contribute ≥ 30% of surfaced cards after launch
- [ ] Unsubscribe works within 30s

### Phase Risks
| Risk | Mitigation |
|---|---|
| Email spam filter issues | Warm up sender domain; monitor deliverability |
| Push notification fatigue | Strict frequency caps; opt-in only |
| New source quality varies | Per-source quality scoring; auto-disable bad sources |
| Increased cost from more sources | Scoring filter remains aggressive; Haiku absorbs volume |

### Success Metrics
- D7 retention uplift: +10% vs pre-Phase-6 baseline
- D30 retention uplift: +8% vs baseline
- Digest email → feed visit CR: ≥ 40%
- Source diversity: no single source > 40% of feed

### Open Questions for Detailed PRD
1. Email service: Resend vs Postmark vs AWS SES? (cost, deliverability)
2. Push: web push only, or invest in PWA + Apple Web Push APIs?
3. How do we curate the blog feed list without manual maintenance?
4. Should users be able to add their own RSS feeds? (power user feature — post-MVP?)
5. Digest format: visual HTML or plain text? A/B?
6. Do we include dismissed cards in the "what you missed" email or exclude?
7. Do we do a "welcome" email series for new signups?

---

## Phase 7 — Growth & Virality

**Objective:** Build the acquisition engine. Let satisfied users help grow the user base through sharing, referrals, and SEO.

**Timeline Estimate:** 3 weeks
**Dependencies:** P4 (feed mature), P6 (habit-forming)
**Team Composition:** 1 full-stack engineer + marketing collaboration

### Scope — In
- Shareable public card pages (SEO-friendly URLs)
- Open Graph / Twitter Card metadata (per card)
- Referral / invite system with tracking
- Public landing page improvements (SEO content, feature pages)
- Search within feed (personal search)
- Sitemap + robots.txt for public card pages
- Optional user-chosen public profile page (display name + top saves)
- Analytics for viral coefficient (K-factor)

### Scope — Out (Deferred)
- Full social graph (follow, feed-of-friends)
- User-generated content / commenting
- Marketplace for curated topic feeds

### Detailed Features

#### 7.1 Public Card Pages
- URL: `/c/[slug]` where slug = human-readable from title
- Shows: image, title, abstract, key takeaway, "read original" CTA
- Shows "Get your own personalised feed" CTA prominently
- Server-rendered for SEO; OG image included
- Rate-limited to prevent scraping-as-service

#### 7.2 Sharing Flow
- Card drawer → Share button → copy link / share sheet
- Shared link includes referral param if user opted in
- Destination: public card page, not user's private feed

#### 7.3 Referral System
- Each user gets a unique referral code/link
- Referred signups tracked via cookie + DB
- Reward: "priority access to new features" (no monetary — simple for MVP)
- Dashboard: see who you referred, status

#### 7.4 SEO Content
- Landing page sections: features, for-engineers, for-AI-learners, about, FAQ
- Blog / resources section (manual curation of evergreen engineering content)
- Proper schema.org markup

#### 7.5 Personal Search
- Search over user's saved + dismissed cards
- Uses full-text Postgres search (not pgvector) for MVP

#### 7.6 Viral Coefficient Tracking
- Track: (signups from referrals + shares) / active users
- Goal: K > 0.3 sustainably

### Technical Components
- `apps/web/c/[slug]/page.tsx` (public card)
- `apps/web/refer/page.tsx`
- `apps/api/routes/referral.ts`
- OG image generation (Vercel `@vercel/og` or similar)

### Acceptance Criteria
- [ ] Public card pages rank for long-tail queries within 30 days
- [ ] Share-to-signup conversion ≥ 3%
- [ ] Referral program launched with tracking
- [ ] K-factor ≥ 0.2 by end of phase
- [ ] Core Web Vitals "Good" for all public pages

### Phase Risks
| Risk | Mitigation |
|---|---|
| Public pages cannibalise signups | Clear "sign up for personalised feed" CTA; public = teaser |
| Scraping / content farming | Rate limits; robots.txt; watermark OG images |
| Referral gaming | Simple reward structure; monitor for abuse |
| SEO competition in tech space | Long-tail focus; personalisation angle as differentiator |

### Success Metrics
- Organic signups / week: 2x growth MoM for 3 months
- Referral signups: 15% of total signups
- Shared card pages: avg 5 visits per shared URL
- K-factor: ≥ 0.25

### Open Questions for Detailed PRD
1. Should shared cards show a "as seen by [user's display name]" attribution? Privacy implications?
2. What's the referral reward beyond "priority access"? Free Pro months once monetised?
3. Do public card pages show the original source's full title or Pulse-rewritten title?
4. SEO strategy: do we ever show aggregated topic pages ("Best AI engineering cards this week")?
5. Do we add paid acquisition at this stage or wait for post-P7?

---

## Phase 8 — Monetisation

**Objective:** Convert Pulse from a free product into a sustainable business.

**Timeline Estimate:** 4 weeks
**Dependencies:** P5, P6, P7 (retention + acquisition proven)
**Team Composition:** 1 full-stack engineer + finance / pricing collaboration

### Scope — In
- Stripe integration (Checkout, Customer Portal, Webhooks)
- Pricing page
- Free vs Pro tier gating
- Pro features: unlimited feed, priority sources, deeper summaries, export, email preferences
- Usage metering & enforcement
- Trial / discount code system
- Annual vs monthly pricing
- Dunning (failed payment recovery)
- Basic financial reporting

### Scope — Out (Deferred)
- Teams tier (separate subsequent effort)
- Third-party marketplace (feeds sold by curators)
- Enterprise sales

### Detailed Features

#### 8.1 Pricing
- **Free:** 10 cards/day, basic sources, standard summaries, web-only
- **Pro ($9/mo or $79/year):** unlimited cards/day, all sources (papers, release notes, curated blogs), deeper "analyst-grade" summaries, daily digest email, export, priority support
- 14-day Pro trial on signup

#### 8.2 Stripe Checkout Flow
- Pricing page → Checkout session → Webhook → DB update → immediate feature access
- Customer Portal for subscription management

#### 8.3 Feature Gating
- Middleware checks `user.subscription.tier` before rendering gated features
- Clear upgrade CTAs at gate points (e.g., "See all 22 cards — upgrade to Pro")

#### 8.4 Deeper Summaries (Pro-only)
- Second Sonnet pass on Pro users' top cards
- Longer abstract, code snippets if relevant, alternative viewpoint / context
- Internally flagged on card as `tier: 'pro'`

#### 8.5 Usage Metering
- Track daily card exposure per free user; cap at 10
- Track summary depth per user tier

#### 8.6 Trial & Discount
- 14-day Pro trial (no card required or card required? — open q)
- Promo code support
- Cohort-specific pricing for early adopters

#### 8.7 Dunning
- Stripe retry logic + email reminders on failed payment
- Grace period: 3 days before downgrade to Free

### Technical Components
- `packages/billing/stripe.ts`
- `apps/api/routes/billing/*`
- `apps/api/webhooks/stripe.ts`
- `apps/web/pricing/page.tsx`
- Feature gating HOC / middleware

### Acceptance Criteria
- [ ] Free → Pro conversion ≥ 3% of DAU
- [ ] Trial → Paid conversion ≥ 25%
- [ ] Churn < 8% monthly
- [ ] LTV/CAC ≥ 3
- [ ] All Stripe webhooks idempotent and tested
- [ ] Refund flow works without engineering intervention

### Phase Risks
| Risk | Mitigation |
|---|---|
| Free tier too generous; no conversion | Hard cap cards/day at 10; model conversion carefully |
| Free tier too stingy; users churn before habit | A/B test caps (5 vs 10 vs 15 cards/day) |
| Stripe integration bugs lose revenue | Comprehensive webhook tests; idempotency keys |
| Pro features don't feel premium enough | Interview early Pro users; iterate on value |

### Success Metrics
- MRR: target $10K MRR within 3 months of launch
- Conversion: Free → Pro ≥ 3%
- Churn: ≤ 8% monthly
- Gross margin (after AI + infra): ≥ 60%

### Open Questions for Detailed PRD
1. Pricing: $9/mo or $12/mo or $15/mo? Needs willingness-to-pay research.
2. Annual discount: 2 months free (standard) or steeper?
3. Trial: card-on-file required or not?
4. Team pricing strategy — when to launch?
5. Should Pro include a historical "archive" (search all past cards)?
6. Do we offer student discount?
7. Regional pricing (purchasing power parity)?

---

# Part VI — Success Measurement

## 19. North Star & KPI Tree

**North Star Metric:** Daily Active Usage Rate — % of signed-up users who open the feed on a given day.

**Why this metric:** It directly measures whether Pulse has become a daily habit, which is the core product hypothesis. All monetisation, virality, and retention flow from this.

### KPI Tree

```
North Star: Daily Active Usage Rate
│
├── Acquisition
│   ├── Weekly signups
│   ├── Organic vs referred vs paid split
│   └── Landing → signup CR
│
├── Activation
│   ├── Onboarding completion rate
│   ├── Time to first "aha" (first save)
│   └── D1 return rate
│
├── Retention
│   ├── D7 retention
│   ├── D30 retention
│   └── Session frequency (per week)
│
├── Engagement (per session)
│   ├── Cards opened
│   ├── Cards saved
│   ├── Cards dismissed (inverse signal)
│   └── Session duration
│
├── Quality
│   ├── Save rate per card
│   ├── "Not Relevant" rate
│   ├── Dwell time
│   └── Source click-through
│
└── Monetisation (P8+)
    ├── Free → Pro CR
    ├── Trial → Paid CR
    ├── MRR
    └── Net revenue retention
```

## 20. Phase-Level Targets

| Phase | Primary Metric | Target |
|---|---|---|
| P0 | Dev velocity proxy: time to first PR merged | ≤ 2 days after phase completion |
| P1 | Onboarding completion rate | ≥ 80% |
| P2 | Pipeline daily success rate | ≥ 99% |
| P3 | Per-user AI cost | ≤ $0.50/month |
| P4 | Feed load P75 | ≤ 1.5s |
| P4 | % users opening ≥ 1 card in first session | ≥ 70% |
| P5 | Week-over-week save rate growth | +5% for first month |
| P6 | D30 retention | 25% |
| P7 | K-factor | ≥ 0.25 |
| P8 | MRR by month 3 post-launch | $10K |

## 21. Analytics Requirements

- **Product analytics:** PostHog for event tracking, funnels, cohorts, retention.
- **Error tracking:** Sentry, with phase-tagged releases.
- **Pipeline observability:** custom dashboard reading from `PipelineRun` table; Inngest's built-in dashboard for job-level detail.
- **Cost tracking:** per-phase AI cost attribution via model version tags on `Card` and `PipelineRun.metrics`.
- **A/B testing:** PostHog feature flags + experiments module (starts in P5).

---

# Part VII — Risk Management & Open Questions

## 22. Master Risk Register

| # | Risk | Likelihood | Impact | Phase | Mitigation |
|---|---|---|---|---|---|
| 1 | AI summaries feel generic | High | High | P3 | Profile-injected prompts; A/B variants; human QA sampling |
| 2 | AI cost exceeds budget | Medium | High | P3 | Haiku for scoring, Sonnet for summary only; dedup cluster image sharing; per-user rate limits |
| 3 | Cold start: empty feed day 1 | High | Medium | P3 | Synchronous first-feed pipeline on onboarding completion |
| 4 | Source APIs rate-limit or change | Medium | Medium | P2, P6 | Adapter abstraction; RSS fallback; multiple sources for redundancy |
| 5 | Copyright concerns on content | Medium | High | P3, P7 | Own-voice summaries only, never >15 words quoted; always link to source |
| 6 | Content duplication | High | Medium | P2 | Aggressive embedding-based dedup |
| 7 | Filter bubble / reduced discovery | Medium | Medium | P5 | 20% exploration slot mandatory |
| 8 | Onboarding feels gimmicky / slow | Medium | Medium | P1 | Let users skip to form; optimise streaming latency |
| 9 | Profile goes stale as user evolves | High | Medium | P5 | Drift detection; explicit re-onboarding CTA |
| 10 | Launch traffic overwhelms pipeline | Medium | High | All | Queue backpressure in Inngest; degrade gracefully |
| 11 | GDPR / privacy complaints | Low | High | P0, P1 | Data export + deletion from Phase 1; clear consent |
| 12 | Key person dependency (AI prompts) | Medium | High | P3, P5 | Versioned prompts; documentation; pair on iteration |
| 13 | Ship date slips past 6 weeks | High | Medium | MVP | Ruthless scope discipline; cut P3 features before P4 features |
| 14 | Users don't convert to Pro | Medium | High | P8 | Validate willingness-to-pay early via user interviews |
| 15 | Scraping / abuse of public card pages | Medium | Low | P7 | Rate limits; OG image watermarks; robots.txt |

## 23. Cross-Phase Open Questions

These are strategic questions that cut across phases and should be revisited at each phase boundary:

1. **Multi-context users.** How do we support users with two distinct interests (AI + distributed systems)? Single profile, multiple channels, or tags? — *Revisit in P1, P5.*
2. **Transparency vs. magic.** How much should we expose about *why* a card was selected? "Explain every decision" is an operating principle, but too much explanation can feel mechanical. — *Revisit in P4, P5.*
3. **Editorial voice.** Does Pulse have a "voice" in summaries, or is it neutral? Does each summary have a perspective, or just distill? — *Revisit in P3.*
4. **Source trust weighting.** Do we rank sources (e.g., arXiv paper > random blog)? If yes, who curates? — *Revisit in P2, P6.*
5. **Discovery vs. personalisation balance.** What % of feed should be "explore" vs "tight fit"? — *Revisit in P5.*
6. **Mobile strategy.** PWA-first forever, or invest in native apps if traction warrants? — *Revisit post-P4.*
7. **Community dimension.** Do we ever add social features? Or stay intentional-solo forever? — *Revisit in P7, P8.*
8. **AI model lock-in.** We're heavy on Anthropic. Should we abstract to a multi-provider layer early? — *Revisit in P3.*
9. **B2B pivot potential.** Teams of engineers (eng orgs, bootcamps) could be a distinct wedge. — *Revisit after P8.*

## 24. Appendix

### 24.1 Glossary
- **Card** — A single unit of content surfaced to a user, comprising title, abstract, image, tags, and relevance metadata.
- **User Context Profile (UCP)** — Structured record of a user's role, stack, goals, and interests used to personalise curation.
- **Relevance Score** — 0–100 score assigned by Claude Haiku indicating fit between an article and a user's UCP.
- **Dedup Cluster** — A group of articles determined to be near-duplicates by embedding similarity.
- **Pipeline Run** — A single execution of the ingestion + curation pipeline, tracked in the `PipelineRun` table.

### 24.2 Reference Materials
- Original PRD v1.0 (April 20, 2026)
- Design inspiration: Pinterest masonry, Arc Browser UI, Readwise Reader
- Competitive research: Refind, TLDR, The Batch, Feedly AI

### 24.3 Document Change Log
| Version | Date | Changes |
|---|---|---|
| 1.0 | Apr 20, 2026 | Initial PRD |
| 2.0 | Apr 21, 2026 | Master PRD: expanded vision, 9-phase delivery plan, detailed per-phase sections for subsequent PRD generation |

---

## How to Generate a Detailed Phase PRD

To generate a detailed PRD for any single phase, start a new Claude session with:

1. This entire master PRD document attached as context.
2. A prompt like:
   > *"Using the master PRD as context, generate a detailed, implementation-ready PRD for **Phase X: [Name]**. Include: detailed user stories with acceptance criteria, API contracts, database migrations, UI wireframe descriptions, test plan, rollout plan, and resolve the 'Open Questions' listed in the phase section with recommendations."*

The phase section's **"Open Questions for Detailed PRD"** acts as the agenda for the detailed session — each question should be resolved with a concrete recommendation in the detailed phase PRD.

---

*End of Master PRD v2.0.*
