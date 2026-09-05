import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { generateExamMarkAnswer } from "@/lib/gemini";
import { getCachedAI, setCachedAI, hashString } from "@/lib/aiCache";

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized. Please login." }, { status: 401 });
    }
    const body = await req.json();
    const topic = (body.topic || "Normalization in DBMS").trim();
    const marks = Number(body.marks || 10) as 1 | 2 | 5 | 10;
    const subject = (body.subject || "Database Management Systems").trim();
    const customKey = req.headers.get("x-gemini-key") || body.apiKey || undefined;

    const cacheKey = `practice_${marks}m_${hashString(topic + subject)}`;
    const cached = getCachedAI(cacheKey);
    if (cached) {
      return NextResponse.json({ success: true, practiceAnswer: cached, cached: true });
    }

    const practiceAnswer = await generateExamMarkAnswer(topic, marks, subject, customKey);
    setCachedAI(cacheKey, practiceAnswer);

    return NextResponse.json({ success: true, practiceAnswer });
  } catch (err: any) {
    console.error("Practice Answer error:", err);
    return NextResponse.json({ error: err?.message || "Failed to generate answer" }, { status: 500 });
  }
}
