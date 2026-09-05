# 🎓 ScholarMate — AI Academic Study Companion

> **Final Year Major Project (2026 – 2027)**  
> **Department of Artificial Intelligence & Machine Learning (AI & ML)**  
> **A.A.N.M. & V.V.R.S.R. Polytechnic College, Gudlavalleru**

---

## 👥 Engineering Team
* **Vastav** — Project Lead & AI Architecture / Full-Stack Lead
* **Vishnu** — Three.js 3D Graphics & UI/UX Developer
* **Nikhileswar** — Cloud Database & Security Engineer
* **Sathvik** — Frontend Integration & Active Recall Engineer

---

## 🚀 Key Modules & Capabilities

1. **🤖 Nexa AI Doubt Solver (24/7 Multi-Turn Tutor):** Mathematical derivations, definitions, algorithms, and step-by-step exam structures powered by Google Gemini.
2. **📚 AI Smart Notes & Exam Pack Generator:** Generates 3-part structured revision packs with 12–16 high-yield bullet points and **10-Mark, 5-Mark, and 3-Mark** model answers.
3. **⚡ 3D Active Recall Flashcards:** Interactive 3D CSS perspective flip-cards for spaced repetition.
4. **🏆 AI Speed Quiz Arena:** Timed MCQs with instant evaluation, confidence metrics, and explanation breakdowns.
5. **⏱️ Student Pomodoro Study Timer:** 25/50m cycles with built-in ambient Pink Noise & 10Hz Alpha Focus audio.
6. **📅 AI Study Timetable:** Day-by-day balanced revision planner.
7. **🌐 Three.js WebGL Neural Orb:** Interactive spatial particle orb on the hero section.

---

## 🛠️ Tech Stack

* **Framework:** Next.js 16.3.4 (App Router & Turbopack), React 19, TypeScript
* **Styling:** Tailwind CSS v4, Framer Motion, Cyberpunk Glassmorphism
* **3D Visuals:** Three.js WebGL
* **AI Model:** Google GenAI SDK (`gemini-3.6-flash` & `gemini-3.5-flash-lite`)
* **Database:** PostgreSQL (Neon Cloud) with PgBouncer connection pooling via Prisma ORM
* **Authentication:** Stateless JWT Sessions (`jose`) with HTTP-only cookies and `bcryptjs`

---

## 📖 Project Documentation

* **[Software Requirements Specification (SRS Document)](./SRS_DOCUMENT.md)**
* **[Source Code Architecture Guide (`src/`)](./SRC_ARCHITECTURE.md)**

---

## 💻 Getting Started Locally

```bash
# 1. Clone repository
git clone https://github.com/project202651/scholar.mate.git
cd scholar.mate

# 2. Install dependencies
npm install

# 3. Setup environment variables in .env
DATABASE_URL="your-postgresql-url"
JWT_SECRET="your-jwt-secret"
GEMINI_API_KEY="your-gemini-api-key"

# 4. Generate Prisma client & start dev server
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to access ScholarMate!
