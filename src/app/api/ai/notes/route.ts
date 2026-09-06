import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { generateAIStudyNotes } from "@/lib/gemini";

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    const body = await req.json();
    const { documentId, topic, subject, rawContent } = body;

    let contentToAnalyze = rawContent || "";
    let finalSubject = subject || "Computer Engineering";
    let finalTitle = topic || "Study Notes Unit";

    if (documentId && user) {
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

    let savedNoteId = `guest_note_${Date.now()}`;
    let createdAt = new Date().toISOString();

    // Save study note in database if authenticated
    const combinedSummary = aiResult.summarySections && aiResult.summarySections.length > 0
      ? `${aiResult.summary}\n\n` + aiResult.summarySections.map((s: any) => `### ${s.sectionTitle}\n${s.content}`).join("\n\n")
      : aiResult.summary;

    if (user) {
      const savedNote = await prisma.studyNote.create({
        data: {
          userId: user.id,
          documentId: documentId || null,
          title: finalTitle,
          subject: finalSubject,
          summary: combinedSummary,
          bulletPoints: JSON.stringify(aiResult.bulletPoints || []),
          importantQuestions: JSON.stringify(aiResult.importantQuestions || []),
        },
      });
      savedNoteId = savedNote.id;
      createdAt = savedNote.createdAt.toISOString();

      // Award study minutes
      await prisma.user.update({
        where: { id: user.id },
        data: {
          studyMinutes: { increment: 15 },
        },
      });
    }

    return NextResponse.json({
      success: true,
      note: {
        id: savedNoteId,
        title: finalTitle,
        subject: finalSubject,
        summary: aiResult.summary,
        summarySections: aiResult.summarySections || [],
        bulletPoints: aiResult.bulletPoints,
        importantQuestions: aiResult.importantQuestions,
        createdAt,
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
      return NextResponse.json({ notes: [] });
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
