# SOFTWARE REQUIREMENTS SPECIFICATION (SRS) & PROJECT REPORT
## **ScholarMate — AI-Powered Academic Study Companion**

---

### **ACADEMIC DETAILS**
* **Institution:** A.A.N.M. & V.V.R.S.R. Polytechnic College, Gudlavalleru
* **Department:** Department of Artificial Intelligence & Machine Learning (AI & ML)
* **Project Type:** Final Year Major Project (Academic Year 2026 – 2027)
* **Project Title:** ScholarMate: Next-Gen AI Academic Revision, Doubt Solver & Active Recall Study Suite

---

### **PROJECT DEVELOPMENT TEAM**
| No. | Student Name | Specialization / Focus Area | Project Role |
| :---: | :--- | :--- | :--- |
| **01** | **Vastav** | AI & Full-Stack Systems | **Project Lead & AI Architecture / Full-Stack** |
| **02** | **Vishnu** | WebGL & Spatial Interaction | **Three.js 3D Graphics & UI/UX Developer** |
| **03** | **Nikhileswar** | Cloud DB & Distributed APIs | **Cloud Database & Security Engineer** |
| **04** | **Sathvik** | Cognitive Science & Active Recall | **Active Recall & QA Testing Engineer** |

---

## 1. EXECUTIVE SUMMARY & ABSTRACT

**ScholarMate** is an intelligent, syllabus-grounded AI academic mentor and study acceleration platform engineered specifically for polytechnic diploma and engineering undergraduate students.

Traditional learning platforms focus on generic summaries or chat wrappers that fail to address the specific pedagogical needs of technical diploma students (such as State Board of Technical Education and Training — SBTET syllabus, 3/5/10-mark exam structuring, algorithmic derivations, and formula retention). 

ScholarMate addresses these challenges by combining:
1. **Google Gemini Generative AI Engine** for structured note generation, derivations, and multi-turn doubt resolution.
2. **Cognitive Active Recall Engine** generating 3D interactive flashcards and speed quiz arenas.
3. **Interactive 3D WebGL Visualization** using Three.js for neural network spatial interaction.
4. **Neon Cloud PostgreSQL & Prisma ORM** with connection pooling for robust real-time synchronization.

---

## 2. SYSTEM ARCHITECTURE & TECH STACK

```
┌────────────────────────────────────────────────────────────────────────┐
│                        CLIENT LAYER (BROWSER)                          │
│  Next.js 16 (React 19) • Tailwind CSS v4 • Three.js 3D • Lucide Icons │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │ HTTP / REST & JWT Cookies
┌───────────────────────────────────▼────────────────────────────────────┐
│                    APPLICATION & API SERVER LAYER                      │
│      Next.js App Router API Routes • Jose JWT Auth • safeJsonParse     │
└───────────────────┬────────────────────────────────┬───────────────────┘
                    │ Prisma ORM (PgBouncer)         │ Google GenAI SDK
┌───────────────────▼──────────────┐   ┌─────────────▼───────────────────┐
│     NEON CLOUD POSTGRESQL DB     │   │     GOOGLE GEMINI AI SUITE      │
│  Users • Notes • Decks • Quizzes │   │ gemini-3.6-flash / 3.5-flash-lite│
└──────────────────────────────────┘   └─────────────────────────────────┘
```

### **Core Technologies:**
* **Frontend Framework:** Next.js 16.3.4 (Turbopack / App Router), React 19.2.8, TypeScript 5
* **Styling & Animations:** Tailwind CSS v4, Framer Motion, Canvas Confetti
* **3D Graphics:** Three.js WebGL Spatial Neural Orb
* **Database & ORM:** PostgreSQL (Neon Serverless Cloud) via Prisma 6.4.1 (PgBouncer Pooled)
* **Authentication:** Stateless JSON Web Tokens (`jose`) with HTTP-Only Cookies & `bcryptjs`
* **AI Provider:** Google GenAI SDK (`@google/genai`) using `gemini-3.6-flash` and `gemini-3.5-flash-lite`

---

## 3. FUNCTIONAL REQUIREMENTS (SRS SPECIFICATION)

### **FR-1: Nexa AI Doubt Solver (24/7 Multi-Turn Tutor)**
* Must accept student technical queries via natural language text input.
* Must provide structured answers formatted with:
  * Clear definitions and real-world engineering analogies.
  * Mathematical equations formatted with KaTeX/LaTeX syntax.
  * Step-by-step algorithms, derivations, or code snippets (Python/C).
* Contextual integration with uploaded PDF course materials.

### **FR-2: AI Smart Notes & 5/10 Mark Exam Pack Generator**
* Takes raw text or PDF course material as input.
* Generates a 3-part structured revision pack:
  1. Multi-paragraph executive summary (Definitions, Technical Flow, Applications).
  2. 12 to 16 high-yield exam bullet points.
  3. 8 to 10 categorized exam questions strictly partitioned into **10-Mark**, **5-Mark**, and **3-Mark** model answers.

### **FR-3: 3D Active Recall Flashcard System**
* Automatically extracts definitions, formulas, and theorems into 12–16 flashcards.
* Renders 3D CSS flip-cards with smooth perspective transformation.
* Tracks mastery state per card to reinforce spaced repetition.

### **FR-4: AI Speed Quiz Arena**
* Generates timed Multiple Choice Questions (MCQs) with 4 options.
* Evaluates selected answers instantly with detailed conceptual rationales.
* Calculates confidence metrics, percentage score, and identifies weak topics.

### **FR-5: AI Study Timetable Generator**
* Accepts exam title, target exam date, and list of subjects.
* Computes an optimized day-by-day revision schedule with daily duration and priority tasks.

### **FR-6: Student Study Timer (Pomodoro Engine)**
* Supports 25-minute Pomodoro, 50-minute Deep Work, and Custom Exam modes.
* Plays embedded ambient audio (Pink Noise / 10Hz Alpha Focus waves).
* Automatically syncs completed study duration to the student's profile.

### **FR-7: Student Authentication & Cloud Profile**
* Secure student registration with Name, Email, College, Department, PIN, and Password.
* Encrypted password storage using `bcryptjs` (salt rounds: 10).
* Auto-syncing streak tracking and cumulative study hour logging.

---

## 4. NON-FUNCTIONAL REQUIREMENTS

* **Performance & Latency:** AI responses generated and parsed in < 3.5 seconds.
* **Resilience & Failover:** Automatic fallback from `gemini-3.6-flash` to `gemini-3.5-flash-lite` in case of rate limits or spikes.
* **Parser Robustness:** `safeJsonParse` sanitizes LaTeX backslashes to prevent JSON parsing errors.
* **Security:** JWT authentication with HTTP-only cookies; database queries parameterized against SQL injection via Prisma.
* **Responsive Design:** Fully adaptive UI across Mobile (360px+), Tablet, and Desktop (4K).

---

## 5. DATABASE SCHEMA & ENTITIES

1. **User:** Student credentials, department, year, registration PIN, streak count, total study minutes.
2. **Document:** Uploaded syllabus chapters, lecture notes, textbook PDFs with extracted OCR/text.
3. **StudyNote:** AI-generated summary, bullet points, and 3/5/10 mark model questions.
4. **FlashcardDeck:** Array of interactive question/answer active recall cards.
5. **Quiz:** MCQ question sets, options, correct answers, and historical student scores.
6. **StudySchedule:** Generated day-by-day revision schedule blocks.
7. **ChatMessage:** Multi-turn conversational history with Nexa AI Tutor.

---

## 6. VERIFICATION & VALIDATION TEST MATRIX

| Test ID | Test Scenario | Expected Outcome | Result |
| :---: | :--- | :--- | :---: |
| **TC-01** | Student Registration & Password Hashing | User saved to PostgreSQL, Bcrypt hashed, JWT issued | `PASSED` |
| **TC-02** | Gemini API AI Model Failover | Automatic switch between `gemini-3.6-flash` and `3.5-flash-lite` | `PASSED` |
| **TC-03** | LaTeX / Mathematical Formula Parsing | `safeJsonParse` avoids crash on `\theta`, `\frac`, `\sum` | `PASSED` |
| **TC-04** | 3D Three.js WebGL Canvas | Mouse orbit controls, 60fps render with zero memory leak | `PASSED` |
| **TC-05** | Serverless Read-Only Filesystem (`EROFS`) | Safe fallback to memory/localStorage on serverless targets | `PASSED` |

---

*Submitted to: Department of Artificial Intelligence & Machine Learning, A.A.N.M. & V.V.R.S.R. Polytechnic College (2026–2027).*
