import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { generateTeachingLesson } from "@/lib/gemini";
import { getCachedAI, setCachedAI, hashString } from "@/lib/aiCache";

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    const body = await req.json();
    const topic = (body.topic || "Neural Networks").trim();
    const subject = (body.subject || "AI & Machine Learning").trim();
    const customKey = req.headers.get("x-gemini-key") || body.apiKey || undefined;

    const cacheKey = `teaching_${hashString(topic + subject)}`;
    const cached = getCachedAI(cacheKey);
    if (cached) {
      return NextResponse.json({ success: true, lesson: cached, cached: true });
    }

    const lesson = await generateTeachingLesson(topic, subject, customKey);
    setCachedAI(cacheKey, lesson);

    return NextResponse.json({ success: true, lesson });
  } catch (err: any) {
    console.error("Teaching Lesson error:", err);
    return NextResponse.json({ error: err?.message || "Failed to generate lesson" }, { status: 500 });
  }
}
