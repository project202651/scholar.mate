import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { generateMockExam } from "@/lib/gemini";
import { getCachedAI, setCachedAI, hashString } from "@/lib/aiCache";

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    const body = await req.json();
    let subject = (body.subject || "Artificial Intelligence & ML").trim();
    const units = body.units || body.topics || [];
    const documentId = body.documentId || null;
    const customKey = req.headers.get("x-gemini-key") || body.apiKey || undefined;

    let textbookContext = "";
    if (documentId) {
      const doc = await prisma.document.findFirst({
        where: user ? { id: documentId, userId: user.id } : { id: documentId },
      });
      if (doc) {
        textbookContext = doc.extractedText;
        if (!body.subject && doc.subject) {
          subject = doc.subject;
        }
      }
    } else if (user && (!units || units.length === 0)) {
      const latestDoc = await prisma.document.findFirst({
        where: { userId: user.id },
        orderBy: { createdAt: "desc" },
      });
      if (latestDoc) {
        textbookContext = latestDoc.extractedText;
        subject = latestDoc.subject || subject;
      }
    }

    const cacheKey = `mock_exam_${hashString(subject + (documentId || "") + JSON.stringify(units))}`;
    const cached = getCachedAI(cacheKey);
    if (cached) {
      return NextResponse.json({ success: true, mockExam: cached, cached: true });
    }

    const mockExam = await generateMockExam(subject, units, customKey, textbookContext);
    setCachedAI(cacheKey, mockExam);

    return NextResponse.json({ success: true, mockExam });
  } catch (err: any) {
    console.error("Mock Exam error:", err);
    return NextResponse.json({ error: err?.message || "Failed to generate mock exam" }, { status: 500 });
  }
}
