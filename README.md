##  EdgeSync

A lightweight **Edge-powered personalization engine** that tailors website content to each user **instantly**, based on **location**, **device**, and **cookies**, all handled at the edge for **speed, scalability, and low latency**.

###  Overview

This MVP demonstrates how **personalized experiences** can be served right from the edge with no backend round trips or page reloads.
It intercepts requests using **Next.js Middleware**, detects user context, and renders personalized variants immediately.

It also includes a polished **analytics dashboard preview**. Its metrics are clearly labelled demo data; real event ingestion is planned for a later phase.

---

###  Key Features

*  **Edge Middleware Integration** — detects context at the edge before response.
*  **Location & Segment Awareness** — adapts UI content per user region.
*  **Interactive Dashboard Preview** — explore the planned performance, segment, and decision-log experience.
*  **Persistent Context** — uses cookies to maintain personalized states.
*  **No Database Required** — Phase 1 personalization runs from configuration and durable anonymous cookies.
*  **Configurable Rules** — easy to modify segments and variants.

---

###  Tech Stack

* **Framework:** Next.js  (App Router)
* **Language:** TypeScript
* **Runtime:** Vercel Edge Runtime
* **Logic:** Custom middleware + personalization engine
* **UI:** Tailwind CSS + React Hooks
* **Charts:** Recharts for performance visualization

---

###  Project Structure

```
edge-personalization/
├── middleware.ts                     # Edge logic entry point (detect location & segment)
│
├── app/
│   ├── page.tsx                       # Main landing page (PersonalizeHero)
│   ├── dashboard/
│   │   └── page.tsx                   # Dashboard main page entry
│   └── api/personalise/route.ts       # API route for personalization logic
│
├── lib/
│   ├── types.ts                       # Shared TypeScript interfaces
│   ├── utils/
│   │   ├── cookies.ts                 # Cookie management utilities
│   │   └── hash.ts                    # Hash function for anonymous tracking
│   └── personalization/
│       ├── engine.ts                  # Core personalization engine logic
│       ├── segments.ts                # Segment definition & rule mapping
│       └── variants.ts                # Variant content configuration
│
├── config/
│   └── personalization.ts             # Central configuration for rules and variants
│
├── components/
│   ├── dashboard/
│   │   ├── EdgeDashboard.tsx          # Main dashboard component
│   │   ├── StatsCard.tsx              # Reusable stat cards for quick metrics
│   │   ├── RegionList.tsx             # Panel showing active regions
│   │   ├── UserSegments.tsx           # Displays user segments with progress bars
│   │   ├── PerformanceChart.tsx       # Compares edge vs origin latency
│   │   ├── RequestsChart.tsx          # Requests per minute visualization
│   │   ├── LiveLogFeed.tsx            # Real-time log updates from edge requests
│   │   └── ComingSoon.tsx             # "Coming Soon" placeholder for future features
│   │
│   └── PersonalizeHero.tsx            # Front-facing component for users
│
└── hooks/
    └── usePersonalization.ts          # Hook to read and manage personalization state
```

---

###  How It Works

1. **Edge Middleware (`middleware.ts`):**
   Intercepts every request → detects user region (via headers) → sets cookie → routes request to the correct variant.

2. **Personalization Engine:**
   Uses `/lib/personalization/engine.ts` to interpret cookies and determine what variant should load (e.g., “US”, “Africa”, “Global”).

3. **Frontend Display:**

   * `/app/components/PersonalizeHero.tsx` uses `usePersonalization()` to show localized UI.
   * `/app/dashboard/page.tsx` + dashboard components visualize personalization metrics in real-time.

4. **Cookies & Persistence:**
   Cookies ensure returning visitors are shown the same personalized content instantly.

---

### 🧪 Dashboard Preview

| Component            | Purpose                                                            |
| -------------------- | ------------------------------------------------------------------ |
| **StatsCard**        | Shows quick stats like total requests, latency, and cache hit rate |
| **RegionList**       | Displays currently active regions served by the Edge               |
| **UserSegments**     | Visual representation of active segments and user distribution     |
| **PerformanceChart** | Compares edge performance vs origin requests                       |
| **RequestsChart**    | Requests per minute graph                                          |
| **LiveLogFeed**      | Streams recent personalization requests in real time               |
| **ComingSoon**       | Placeholder for upcoming dashboard modules                         |

---

### Example Edge Flow

```mermaid
graph TD;
A[User Request] --> B[Edge Middleware]
B --> C[Geo & Device Detection]
C --> D[Set Cookie + Segment]
D --> E[Serve Personalized Variant]
E --> F[Dashboard Logs Request]
F --> G[User Sees Personalized UI]
```

---

###  Setup & Installation

```bash
# 1️⃣ Clone repository
git clone https://github.com/fohalabi/edgesync.git
cd edgesync

# 2️⃣ Install dependencies
npm install

# 3️⃣ Run locally
npm run dev

# 4️⃣ Deploy to Vercel (Edge Runtime)
vercel deploy
```

### Local authentication setup

Phase 2 uses a PostgreSQL-backed administrator account and a signed HTTP-only session. Add `DATABASE_URL`, `SESSION_SECRET`, `ADMIN_EMAIL`, `ADMIN_PASSWORD`, and optionally `ADMIN_NAME` to `.env.local`, then run:

```bash
npm run db:migrate
npm run db:seed
```

`ADMIN_PASSWORD` must contain at least 12 characters. The seed command stores only its bcrypt hash and safely updates the same administrator when run again.

---

### 📊 Project Phases

* [x] **Phase 1 — Foundation:** working middleware, stable identity, content experiments, honest demo-data labelling, refreshed UI, and core tests.
* [x] **Phase 2 — Authentication:** email/password login, a seeded administrator, signed sessions, logout, throttling, and protected dashboard routes.
* [x] **Phase 3 — Context simulator:** shareable context overrides, presets, responsive previews, and reload-free evaluation.
* [x] **Phase 4 — Explainable engine:** serializable AND/OR rules, priorities, fallbacks, conflict detection, and condition-level decision traces.
* [ ] **Phase 5 — Rule builder:** persistent draft/published rules and visual editing.
* [ ] **Phase 6 — Analytics:** real event ingestion and measured dashboard data.
* [ ] **Phase 7 — Experiment studio:** experiment lifecycle, conversions, and uplift.
* [ ] **Phase 8 — Production polish:** privacy, accessibility, auditability, and deployment hardening.

---
🔗 [LinkedIn](https://linkedin.com/in/fohalabi) 
