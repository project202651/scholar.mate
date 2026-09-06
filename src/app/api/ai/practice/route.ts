import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { generateExamMarkAnswer } from "@/lib/gemini";
import { getCachedAI, setCachedAI, hashString } from "@/lib/aiCache";

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    const body = await req.json();
    let topic = (body.topic || "Normalization in DBMS").trim();
    const marks = Number(body.marks || 10) as 1 | 2 | 5 | 10;
    let subject = (body.subject || "Database Management Systems").trim();
    const documentId = body.documentId || null;
    const customKey = req.headers.get("x-gemini-key") || body.apiKey || undefined;

    let textbookContext = "";
    if (documentId) {
      const doc = await prisma.document.findFirst({
        where: user ? { id: documentId, userId: user.id } : { id: documentId },
      });
      if (doc) {
        textbookContext = doc.extractedText;
        if (!body.subject && doc.subject) subject = doc.subject;
        if (!body.topic && doc.title) topic = doc.title;
      }
    } else if (user && !body.topic) {
      const latestDoc = await prisma.document.findFirst({
        where: { userId: user.id },
        orderBy: { createdAt: "desc" },
      });
      if (latestDoc) {
        textbookContext = latestDoc.extractedText;
        subject = latestDoc.subject || subject;
        topic = latestDoc.title || topic;
      }
    }

    const cacheKey = `practice_${marks}m_${hashString(topic + subject + (documentId || ""))}`;
    const cached = getCachedAI(cacheKey);
    if (cached) {
      return NextResponse.json({ success: true, practice: cached, practiceAnswer: cached, cached: true });
    }

    const practiceAnswer = await generateExamMarkAnswer(topic, marks, subject, customKey, textbookContext);
    setCachedAI(cacheKey, practiceAnswer);

    return NextResponse.json({ success: true, practice: practiceAnswer, practiceAnswer });
  } catch (err: any) {
    console.error("Practice Answer error:", err);
    return NextResponse.json({ error: err?.message || "Failed to generate answer" }, { status: 500 });
  }
}
