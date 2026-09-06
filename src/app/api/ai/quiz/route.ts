import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { generateAIQuiz } from "@/lib/gemini";

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    const body = await req.json();
    const { documentId, topic, subject } = body;

    let contentToAnalyze = "";
    let finalSubject = subject || "Computer Engineering";
    let finalTitle = topic || "Speed Quiz";

    if (documentId) {
      const doc = await prisma.document.findFirst({
        where: user ? { id: documentId, userId: user.id } : { id: documentId },
      });
      if (doc) {
        contentToAnalyze = doc.extractedText;
        finalSubject = doc.subject || finalSubject;
        finalTitle = doc.title || finalTitle;
      }
    } else if (user && (!topic || topic.trim().length === 0)) {
      const latestDoc = await prisma.document.findFirst({
        where: { userId: user.id },
        orderBy: { createdAt: "desc" },
      });
      if (latestDoc) {
        contentToAnalyze = latestDoc.extractedText;
        finalSubject = latestDoc.subject;
        finalTitle = latestDoc.title;
      }
    }

    if (!contentToAnalyze) {
      contentToAnalyze = `Important syllabus review for ${finalTitle} under ${finalSubject}. Key questions, definitions, technical operations, and exam patterns.`;
    }

    const customKey = req.headers.get("x-gemini-key") || body.apiKey || undefined;

    const quizQuestions = await generateAIQuiz(contentToAnalyze, finalSubject, customKey);

    let quizId = `guest_quiz_${Date.now()}`;

    if (user) {
      const quiz = await prisma.quiz.create({
        data: {
          userId: user.id,
          documentId: documentId || null,
          title: finalTitle,
          subject: finalSubject,
          questions: JSON.stringify(quizQuestions),
          totalQuestions: quizQuestions.length,
          completed: false,
        },
      });
      quizId = quiz.id;
    }

    return NextResponse.json({
      success: true,
      quiz: {
        id: quizId,
        title: finalTitle,
        subject: finalSubject,
        questions: quizQuestions,
      },
    });
  } catch (err: any) {
    console.error("AI Quiz generation error:", err);
    return NextResponse.json(
      { error: err?.message || "Failed to generate quiz questions" },
      { status: 400 }
    );
  }
}

export async function PUT(req: Request) {
  try {
    const user = await getCurrentUser();
    const body = await req.json();
    const { quizId, score, total } = body;

    if (!quizId || score === undefined || !total) {
      return NextResponse.json({ error: "Invalid score payload" }, { status: 400 });
    }

    if (user && !quizId.startsWith("guest_")) {
      const updated = await prisma.quiz.update({
        where: { id: quizId, userId: user.id },
        data: {
          score: Number(score),
          completed: true,
        },
      });

      await prisma.user.update({
        where: { id: user.id },
        data: { studyMinutes: { increment: 10 } },
      });

      return NextResponse.json({ success: true, quiz: updated });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Save score error:", err);
    return NextResponse.json({ error: "Failed to record quiz score" }, { status: 500 });
  }
}

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ quizzes: [] });
    }

    const quizzes = await prisma.quiz.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
    });

    const formatted = quizzes.map((q) => ({
      id: q.id,
      title: q.title,
      subject: q.subject,
      score: q.score,
      completed: q.completed,
      questions: JSON.parse(q.questions || "[]"),
      createdAt: q.createdAt,
    }));

    return NextResponse.json({ quizzes: formatted });
  } catch (err) {
    console.error("Fetch quiz error:", err);
    return NextResponse.json({ error: "Failed to load quizzes" }, { status: 500 });
  }
}
