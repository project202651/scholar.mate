import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { generateMockExam } from "@/lib/gemini";
import { getCachedAI, setCachedAI, hashString } from "@/lib/aiCache";

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    const body = await req.json();
    const subject = (body.subject || "Artificial Intelligence & ML").trim();
    const units = body.units || body.topics || [];
    const customKey = req.headers.get("x-gemini-key") || body.apiKey || undefined;

    const cacheKey = `mock_exam_${hashString(subject + JSON.stringify(units))}`;
    const cached = getCachedAI(cacheKey);
    if (cached) {
      return NextResponse.json({ success: true, mockExam: cached, cached: true });
    }

    const mockExam = await generateMockExam(subject, units, customKey);
    setCachedAI(cacheKey, mockExam);

    return NextResponse.json({ success: true, mockExam });
  } catch (err: any) {
    console.error("Mock Exam error:", err);
    return NextResponse.json({ error: err?.message || "Failed to generate mock exam" }, { status: 500 });
  }
}
