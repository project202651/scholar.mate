import { GoogleGenAI } from "@google/genai";

function getGenAIClient(customApiKey?: string) {
  const key = (customApiKey || process.env.GEMINI_API_KEY || "").trim();
  if (key && key.length > 5) {
    return { client: new GoogleGenAI({ apiKey: key }), key };
  }
  return null;
}

const CANDIDATE_MODELS = ["gemini-3-flash-preview", "gemini-3.6-flash"];

export async function askGemini(prompt: string, context?: string, customKey?: string): Promise<string> {
  const instance = getGenAIClient(customKey);

  if (!instance) {
    throw new Error(
      "Gemini API key is not configured. Please enter your free Google Gemini API key in the 'AI Engine' settings (top bar) or in .env to get real AI answers."
    );
  }

  const { client } = instance;

  const fullPrompt = context
    ? `You are ScholarMate, an expert academic tutor for polytechnic and engineering students.\n\nContext / Uploaded Study Material:\n"""\n${context}\n"""\n\nStudent Question:\n${prompt}\n\nPlease provide an accurate, clear, comprehensive, and well-structured answer with definitions, step-by-step explanations, formulas, and examples.`
    : `You are ScholarMate, an expert academic tutor for polytechnic and engineering students.\n\nStudent Question:\n${prompt}\n\nPlease provide an accurate, clear, comprehensive, and well-structured answer with definitions, step-by-step explanations, formulas, and examples.`;

  let lastError: any = null;

  for (const model of CANDIDATE_MODELS) {
    try {
      const response = await client.models.generateContent({
        model,
        contents: fullPrompt,
      });

      if (response.text) {
        return response.text;
      }
    } catch (err: any) {
      console.warn(`Model ${model} failed:`, err?.message || err);
      lastError = err;
    }
  }

  throw new Error(
    `Google Gemini API call failed: ${lastError?.message || "Please check your Gemini API key and quota in AI Studio."}`
  );
}

export async function generateAIStudyNotes(content: string, subject: string, customKey?: string) {
  const instance = getGenAIClient(customKey);

  if (!instance) {
    throw new Error(
      "Gemini API key is not configured. Please enter your free Google Gemini API key in the 'AI Engine' settings (top bar) to generate real study notes."
    );
  }

  const { client } = instance;

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
    "High-yield revision bullet point 12",
    "High-yield revision bullet point 13",
    "High-yield revision bullet point 14"
  ],
  "importantQuestions": [
    {
      "question": "10-Mark comprehensive question statement?",
      "answer": "Detailed step-by-step model answer covering diagrams, principles, formulas, and points.",
      "marks": 10
    },
    {
      "question": "10-Mark comparison or architectural question statement?",
      "answer": "Comprehensive model answer.",
      "marks": 10
    },
    {
      "question": "5-Mark analytical or procedural question statement?",
      "answer": "Structured model answer with key bullet points.",
      "marks": 5
    },
    {
      "question": "5-Mark algorithm or working principle question statement?",
      "answer": "Structured model answer.",
      "marks": 5
    },
    {
      "question": "5-Mark advantages and limitations question statement?",
      "answer": "Structured model answer.",
      "marks": 5
    },
    {
      "question": "3-Mark definition question statement?",
      "answer": "Crisp model answer with formula or diagram reference.",
      "marks": 3
    },
    {
      "question": "3-Mark formula / state law question statement?",
      "answer": "Exact law, formula, and units.",
      "marks": 3
    },
    {
      "question": "3-Mark distinction question statement?",
      "answer": "Clear two-column or comparative model answer.",
      "marks": 3
    }
  ]
}

Study Material:
"""
${content.slice(0, 18000)}
"""

Return strictly valid JSON only. Do not wrap in extra prose.`;

  let lastError: any = null;

  for (const model of CANDIDATE_MODELS) {
    try {
      const response = await client.models.generateContent({
        model,
        contents: prompt,
        config: {
          responseMimeType: "application/json",
        },
      });

      if (response.text) {
        const cleaned = response.text.replace(/```json/g, "").replace(/```/g, "").trim();
        return JSON.parse(cleaned);
      }
    } catch (err: any) {
      console.warn(`Notes generation on ${model} failed:`, err?.message || err);
      lastError = err;
    }
  }

  throw new Error(
    `Failed to generate AI notes: ${lastError?.message || "Please check your Gemini API key."}`
  );
}

export async function generateAIFlashcards(content: string, subject: string, customKey?: string) {
  const instance = getGenAIClient(customKey);

  if (!instance) {
    throw new Error(
      "Gemini API key is not configured. Please enter your free Google Gemini API key in the 'AI Engine' settings to generate flashcards."
    );
  }

  const { client } = instance;

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

  let lastError: any = null;

  for (const model of CANDIDATE_MODELS) {
    try {
      const response = await client.models.generateContent({
        model,
        contents: prompt,
        config: {
          responseMimeType: "application/json",
        },
      });

      if (response.text) {
        const cleaned = response.text.replace(/```json/g, "").replace(/```/g, "").trim();
        return JSON.parse(cleaned);
      }
    } catch (err: any) {
      console.warn(`Flashcard generation on ${model} failed:`, err?.message || err);
      lastError = err;
    }
  }

  throw new Error(
    `Failed to generate flashcards: ${lastError?.message || "Please check your Gemini API key."}`
  );
}

export async function generateAIQuiz(content: string, subject: string, customKey?: string) {
  const instance = getGenAIClient(customKey);

  if (!instance) {
    throw new Error(
      "Gemini API key is not configured. Please enter your free Google Gemini API key in the 'AI Engine' settings to generate quizzes."
    );
  }

  const { client } = instance;

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

  let lastError: any = null;

  for (const model of CANDIDATE_MODELS) {
    try {
      const response = await client.models.generateContent({
        model,
        contents: prompt,
        config: {
          responseMimeType: "application/json",
        },
      });

      if (response.text) {
        const cleaned = response.text.replace(/```json/g, "").replace(/```/g, "").trim();
        return JSON.parse(cleaned);
      }
    } catch (err: any) {
      console.warn(`Quiz generation on ${model} failed:`, err?.message || err);
      lastError = err;
    }
  }

  throw new Error(
    `Failed to generate quiz: ${lastError?.message || "Please check your Gemini API key."}`
  );
}

export async function generateAISchedule(
  targetExam: string,
  examDate: string,
  subjectsList: string[],
  customKey?: string
) {
  const instance = getGenAIClient(customKey);

  if (!instance) {
    throw new Error(
      "Gemini API key is not configured. Please enter your free Google Gemini API key in the 'AI Engine' settings to generate study schedules."
    );
  }

  const { client } = instance;

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

  let lastError: any = null;

  for (const model of CANDIDATE_MODELS) {
    try {
      const response = await client.models.generateContent({
        model,
        contents: prompt,
        config: {
          responseMimeType: "application/json",
        },
      });

      if (response.text) {
        const cleaned = response.text.replace(/```json/g, "").replace(/```/g, "").trim();
        return JSON.parse(cleaned);
      }
    } catch (err: any) {
      console.warn(`Schedule generation on ${model} failed:`, err?.message || err);
      lastError = err;
    }
  }

  throw new Error(
    `Failed to generate study schedule: ${lastError?.message || "Please check your Gemini API key."}`
  );
}
