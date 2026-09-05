import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { evaluateStudentAnswer } from "@/lib/gemini";

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    const body = await req.json();
    const question = (body.question || "").trim();
    const studentAnswer = (body.studentAnswer || body.answer || "").trim();
    const marks = Number(body.marks || body.maxMarks || 10);
    const customKey = req.headers.get("x-gemini-key") || body.apiKey || undefined;

    if (!studentAnswer) {
      return NextResponse.json({ error: "Student answer cannot be empty" }, { status: 400 });
    }

    const evaluation = await evaluateStudentAnswer(question, studentAnswer, marks, customKey);
    return NextResponse.json({ success: true, evaluation });
  } catch (err: any) {
    console.error("Answer Evaluation error:", err);
    return NextResponse.json({ error: err?.message || "Failed to evaluate answer" }, { status: 500 });
  }
}
