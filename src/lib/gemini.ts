import Groq from "groq-sdk";

const CANDIDATE_MODELS = ["qwen/qwen3.6-27b", "openai/gpt-oss-20b"];

function getGroqClient(customApiKey?: string) {
  const key = (customApiKey || process.env.GEMINI_API_KEY || "").trim();
  if (key && key.length > 5) {
    return new Groq({ apiKey: key });
  }
  return null;
}

async function callGroq(client: Groq, prompt: string, json = false): Promise<string> {
  let lastError: any = null;

  for (const model of CANDIDATE_MODELS) {
    try {
      const response = await client.chat.completions.create({
        model,
        messages: [{ role: "user", content: prompt }],
        max_tokens: 4096,
        ...(json ? { response_format: { type: "json_object" } } : {}),
      });
      const text = response.choices?.[0]?.message?.content || "";
      if (text) return text;
    } catch (err: any) {
      console.warn(`Model ${model} failed:`, err?.message || err);
      lastError = err;
    }
  }

  throw new Error(
    `AI call failed: ${lastError?.message || "Please check your Groq API key."}`
  );
}

export async function askGemini(prompt: string, context?: string, customKey?: string): Promise<string> {
  const client = getGroqClient(customKey);

  if (!client) {
    throw new Error(
      "AI API key is not configured. Please enter your free Groq API key in the 'AI Engine' settings (top bar) to get real AI answers."
    );
  }

  const fullPrompt = context
    ? `You are Nexa, the intelligent AI Academic Mentor and Doubt Solver for ScholarMate (developed by the Department of AI & ML for polytechnic and engineering students).
You are encouraging, academically rigorous, and crystal-clear.

Context / Uploaded Study Material:
"""
${context}
"""

Student Question:
${prompt}

Please provide an accurate, clear, comprehensive, and well-structured answer with definitions, step-by-step explanations, formulas, and examples.`
    : `You are Nexa, the intelligent AI Academic Mentor and Doubt Solver for ScholarMate (developed by the Department of AI & ML for polytechnic and engineering students).
You are encouraging, academically rigorous, and crystal-clear.

Student Question:
${prompt}

Please provide an accurate, clear, comprehensive, and well-structured answer with definitions, step-by-step explanations, formulas, and examples.`;

  return callGroq(client, fullPrompt);
}

export async function generateAIStudyNotes(content: string, subject: string, customKey?: string) {
  const client = getGroqClient(customKey);

  if (!client) {
    throw new Error(
      "AI API key is not configured. Please enter your free Groq API key in the 'AI Engine' settings (top bar) to generate real study notes."
    );
  }

  const prompt = `You are ScholarMate, an expert academic professor for polytechnic diploma students in "${subject}".
Analyze the study material below and generate a rich, highly comprehensive revision pack for semester exams.

Strict Requirements:
1. "summary": Provide a rich, detailed 3-part structured summary covering:
   - Fundamental Definitions & Concepts
   - Technical Principles, Flow & Formulas
   - Real-World Engineering / AI Applications
2. "bulletPoints": Generate exactly 12 to 16 high-yield, exam-focused revision bullet points covering all critical definitions, formulas, laws, advantages, and key differences.
3. "importantQuestions": Generate 8 to 10 important exam questions strictly categorized by mark weightage:
   - Two to Three 10-Mark Questions (Essay/Architectural/Derivations) with comprehensive, multi-point model answers.
   - Three to Four 5-Mark Questions (Short essays, working principles, algorithm steps) with clear structured model answers.
   - Three to Four 3-Mark Questions (Definitions, formula statements, units, simple distinctions) with crisp model answers.

Required JSON format:
{
  "summary": "Detailed multi-paragraph comprehensive summary...",
  "bulletPoints": [
    "High-yield revision bullet point 1",
    "High-yield revision bullet point 2",
    "High-yield revision bullet point 3",
    "High-yield revision bullet point 4",
    "High-yield revision bullet point 5",
    "High-yield revision bullet point 6",
    "High-yield revision bullet point 7",
    "High-yield revision bullet point 8",
    "High-yield revision bullet point 9",
    "High-yield revision bullet point 10",
    "High-yield revision bullet point 11",
    "High-yield revision bullet point 12"
  ],
  "importantQuestions": [
    {
      "question": "10-Mark comprehensive question statement?",
      "answer": "Detailed step-by-step model answer covering diagrams, principles, formulas, and points.",
      "marks": 10
    },
    {
      "question": "5-Mark analytical or procedural question statement?",
      "answer": "Structured model answer with key bullet points.",
      "marks": 5
    },
    {
      "question": "3-Mark definition question statement?",
      "answer": "Crisp model answer with formula or diagram reference.",
      "marks": 3
    }
  ]
}

Study Material:
"""
${content.slice(0, 18000)}
"""

Return strictly valid JSON only. Do not wrap in extra prose.`;

  const text = await callGroq(client, prompt, true);
  const cleaned = text.replace(/```json/g, "").replace(/```/g, "").trim();
  return JSON.parse(cleaned);
}

export async function generateAIFlashcards(content: string, subject: string, customKey?: string) {
  const client = getGroqClient(customKey);

  if (!client) {
    throw new Error(
      "AI API key is not configured. Please enter your free Groq API key in the 'AI Engine' settings to generate flashcards."
    );
  }

  const prompt = `You are ScholarMate. Generate an extensive active-recall flashcard deck of 12 to 16 high-yield study cards based on this material for "${subject}".
Include cards for:
- Key technical definitions and terms
- Mathematical formulas, loss functions, or theorems
- Algorithmic steps and architectures
- Key differences between related concepts
- Exam memory anchors and real-world engineering applications

Format strictly as a JSON array of 12 to 16 cards:
[
  {
    "front": "Prompt, Question, or Concept (e.g. What is Backpropagation?)",
    "back": "Clear, high-retention explanation, formula, or breakdown",
    "category": "${subject}"
  }
]

Material:
"""
${content.slice(0, 15000)}
"""

Return strictly valid JSON array only.`;

  const text = await callGroq(client, prompt, true);
  const cleaned = text.replace(/```json/g, "").replace(/```/g, "").trim();
  return JSON.parse(cleaned);
}

export async function generateAIQuiz(content: string, subject: string, customKey?: string) {
  const client = getGroqClient(customKey);

  if (!client) {
    throw new Error(
      "AI API key is not configured. Please enter your free Groq API key in the 'AI Engine' settings to generate quizzes."
    );
  }

  const prompt = `You are ScholarMate. Create a comprehensive 8 to 10 question multiple choice quiz (MCQ) testing deep understanding of this material for "${subject}".
Include a blend of:
- Conceptual understanding questions
- Formula and mathematical calculation questions
- Architecture / algorithm step-order questions
- Real-world scenario and diagnosis questions

Format strictly as a JSON array:
[
  {
    "id": 1,
    "question": "Clear question statement?",
    "options": ["Option A", "Option B", "Option C", "Option D"],
    "answer": 0,
    "explanation": "Detailed explanation of why this option is correct and why other options are incorrect."
  }
]
Important: "answer" must be the 0-based index (0, 1, 2, or 3) indicating which option is correct.

Material:
"""
${content.slice(0, 15000)}
"""

Return strictly valid JSON array only.`;

  const text = await callGroq(client, prompt, true);
  const cleaned = text.replace(/```json/g, "").replace(/```/g, "").trim();
  return JSON.parse(cleaned);
}

export async function generateAISchedule(
  targetExam: string,
  examDate: string,
  subjectsList: string[],
  customKey?: string
) {
  const client = getGroqClient(customKey);

  if (!client) {
    throw new Error(
      "AI API key is not configured. Please enter your free Groq API key in the 'AI Engine' settings to generate study schedules."
    );
  }

  const prompt = `Generate a realistic day-by-day revision timetable for a student preparing for "${targetExam}" scheduled on ${examDate}.
Subjects to cover: ${subjectsList.join(", ")}.

Format strictly as a JSON array of 5 to 7 daily blocks:
[
  {
    "day": "Day 1",
    "focusSubject": "Subject Name",
    "topic": "Specific chapter or topics to cover today",
    "durationMinutes": 120,
    "tasks": [
      "Review theory & derivations",
      "Solve 5 practice problems",
      "Active recall recap"
    ]
  }
]

Return strictly valid JSON only.`;

  const text = await callGroq(client, prompt, true);
  const cleaned = text.replace(/```json/g, "").replace(/```/g, "").trim();
  return JSON.parse(cleaned);
}
