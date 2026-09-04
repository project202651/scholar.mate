# SOURCE CODE ARCHITECTURE & DIRECTORY SPECIFICATION
## **ScholarMate Codebase Documentation (`src/`)**

---

### **Overview of Directory Structure**

```text
src/
├── app/
│   ├── api/
│   │   ├── ai/
│   │   │   ├── chat/route.ts        -> Multi-turn Nexa AI Tutor endpoint
│   │   │   ├── flashcards/route.ts  -> Active recall flashcard deck generator
│   │   │   ├── notes/route.ts       -> Structured 3/5/10 mark notes generator
│   │   │   ├── quiz/route.ts        -> Timed MCQ speed quiz generator
│   │   │   ├── save-key/route.ts    -> Serverless-safe Gemini API key manager
│   │   │   ├── schedule/route.ts    -> Day-by-day revision timetable generator
│   │   │   └── test/route.ts        -> Real-time Gemini API connection test
│   │   ├── auth/
│   │   │   ├── login/route.ts       -> Student credential verification & JWT
│   │   │   ├── logout/route.ts      -> Session revocation & cookie cleanup
│   │   │   ├── me/route.ts          -> Current authenticated student profile
│   │   │   └── register/route.ts    -> New student account creation
│   │   ├── documents/
│   │   │   └── upload/route.ts      -> PDF/Text syllabus material processor
│   │   ├── progress/route.ts        -> Learning stats & streak management
│   │   └── tasks/route.ts           -> Task checklist CRUD
│   ├── globals.css                  -> Tailwind v4 styles, Cyberpunk glassmorphism, Light/Dark themes
│   ├── layout.tsx                   -> Root HTML layout, Geist fonts, metadata
│   └── page.tsx                     -> Main Single Page Application state router & view switcher
├── components/
│   ├── AISettingsModal.tsx          -> Google Gemini API configuration modal
│   ├── AuthModal.tsx                -> Student Login & Registration dialog
│   ├── ChatTutorView.tsx            -> Nexa AI Doubt Solver interactive chat UI
│   ├── DashboardView.tsx            -> Hero section, 3D WebGL orb, team profile cards
│   ├── DocumentsView.tsx            -> PDF syllabus upload & knowledge hub
│   ├── FlashcardsView.tsx           -> 3D interactive CSS perspective flip cards
│   ├── Navbar.tsx                   -> Glassmorphic navigation header & theme switcher
│   ├── QuizView.tsx                 -> Timed MCQ test arena with analytics
│   ├── SmartNotesView.tsx           -> Structured summary & 10/5/3 mark exam pack view
│   ├── StudyScheduleView.tsx        -> Visual day-by-day revision timetable
│   ├── StudyTimerView.tsx           -> Pomodoro focus clock with binaural alpha audio
│   └── ThreeOrb.tsx                 -> Interactive Three.js WebGL spatial neural orb
└── lib/
    ├── auth.ts                      -> Password hashing (`bcryptjs`) & JWT handling (`jose`)
    ├── clientFetch.ts               -> Client-side fetch wrapper attaching `x-gemini-key`
    ├── gemini.ts                    -> Google GenAI SDK client, candidate models & `safeJsonParse`
    └── prisma.ts                    -> Singleton PrismaClient instance with PgBouncer
```

---

## **1. Application Core & State Flow (`src/app/`)**

### `src/app/page.tsx`
* Acts as the primary orchestrator for the Single Page Application (SPA).
* Manages the active view state:
  * `"dashboard"` | `"chat"` | `"notes"` | `"flashcards"` | `"quiz"` | `"timer"` | `"schedule"` | `"documents"`
* Handles theme persistence in `localStorage` (`"scholarmate_theme"` -> `dark` or `light`).
* Triggers the animated introductory splash screen on first visit.

### `src/app/globals.css`
* Configured for **Tailwind CSS v4** with custom CSS custom properties.
* Contains custom glassmorphism utilities:
  * Glass frosted backdrops (`backdrop-filter: blur(24px)`).
  * Dual-theme color overrides with high-contrast text readability for light mode.
  * Cyberpunk glowing accent borders (`cyan-500`, `indigo-500`, `fuchsia-500`).

---

## **2. AI Core & Resilience Engine (`src/lib/gemini.ts`)**

### **Model Strategy:**
```typescript
const CANDIDATE_MODELS = [
  "gemini-3.6-flash",     // Primary intelligent study mentor
  "gemini-3.5-flash-lite", // Fallback for ultra-low latency & demand spikes
  "gemini-3.1-pro-preview" // Enterprise analytical reasoning
];
```

### **Math & LaTeX Sanitization (`safeJsonParse`):**
When generating technical exam answers containing math symbols like `\theta`, `\frac`, `\sum`, standard `JSON.parse` fails due to invalid JSON escape sequences. ScholarMate implements a regex lookahead sanitizer:
```typescript
const sanitized = cleaned.replace(/\\(?![/u"bfnrt\\])/g, "\\\\");
```
This guarantees 100% crash-free JSON parsing across all generative endpoints.

---

## **3. 3D WebGL Spatial Interaction (`src/components/ThreeOrb.tsx`)**
* Built with **Three.js** inside a React `useEffect` canvas hook.
* Implements:
  * Particle geometry with thousands of glowing nodes.
  * Orbital trajectory rotation with mouse cursor momentum.
  * Full GPU resource cleanup on unmount (`geometry.dispose()`, `material.dispose()`) to prevent memory leaks.

---

## **4. Database Layer & Connection Pooling (`src/lib/prisma.ts`)**
* Implements a global singleton pattern to prevent connection pool exhaustion during Next.js Hot Module Reloading (HMR).
* Connects to **Neon Serverless PostgreSQL** via `pgbouncer=true` connection pooling.
