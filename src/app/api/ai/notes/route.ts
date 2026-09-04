import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { generateAIStudyNotes } from "@/lib/gemini";

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized. Please login." }, { status: 401 });
    }

    const body = await req.json();
    const { documentId, topic, subject, rawContent } = body;

    let contentToAnalyze = rawContent || "";
    let finalSubject = subject || "Computer Engineering";
    let finalTitle = topic || "Study Notes Unit";

    if (documentId) {
      const doc = await prisma.document.findUnique({
        where: { id: documentId, userId: user.id },
      });
      if (doc) {
        contentToAnalyze = doc.extractedText;
        finalSubject = doc.subject;
        finalTitle = doc.title;
      }
    }

    if (!contentToAnalyze || contentToAnalyze.trim().length === 0) {
      contentToAnalyze = `Study unit on ${finalTitle} for polytechnic diploma course ${finalSubject}. Detailed analysis of core syllabus, theory, diagrams, and formulas.`;
    }

    const customKey = req.headers.get("x-gemini-key") || body.apiKey || undefined;

    // Call AI note generator
    const aiResult = await generateAIStudyNotes(contentToAnalyze, finalSubject, customKey);

    // Save study note in database
    const savedNote = await prisma.studyNote.create({
      data: {
        userId: user.id,
        documentId: documentId || null,
        title: finalTitle,
        subject: finalSubject,
        summary: aiResult.summary,
        bulletPoints: JSON.stringify(aiResult.bulletPoints || []),
        importantQuestions: JSON.stringify(aiResult.importantQuestions || []),
      },
    });

    // Also award study minutes
    await prisma.user.update({
      where: { id: user.id },
      data: {
        studyMinutes: { increment: 15 },
      },
    });

    return NextResponse.json({
      success: true,
      note: {
        id: savedNote.id,
        title: savedNote.title,
        subject: savedNote.subject,
        summary: savedNote.summary,
        bulletPoints: aiResult.bulletPoints,
        importantQuestions: aiResult.importantQuestions,
        createdAt: savedNote.createdAt,
      },
    });
  } catch (err: any) {
    console.error("AI Notes generation error:", err);
    return NextResponse.json(
      { error: err?.message || "Failed to generate AI notes" },
      { status: 400 }
    );
  }
}

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const notes = await prisma.studyNote.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
    });

    const formattedNotes = notes.map((n) => ({
      id: n.id,
      title: n.title,
      subject: n.subject,
      summary: n.summary,
      bulletPoints: JSON.parse(n.bulletPoints || "[]"),
      importantQuestions: JSON.parse(n.importantQuestions || "[]"),
      createdAt: n.createdAt,
    }));

    return NextResponse.json({ notes: formattedNotes });
  } catch (err) {
    console.error("Fetch notes error:", err);
    return NextResponse.json({ error: "Failed to load notes" }, { status: 500 });
  }
}
