import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { generateAIQuiz } from "@/lib/gemini";

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized. Please login." }, { status: 401 });
    }

    const body = await req.json();
    const { documentId, topic, subject } = body;

    let contentToAnalyze = "";
    let finalSubject = subject || "Computer Engineering";
    let finalTitle = topic || "Speed Quiz";

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

    if (!contentToAnalyze) {
      contentToAnalyze = `Important syllabus review for ${finalTitle} under ${finalSubject}. Key questions, definitions, technical operations, and exam patterns.`;
    }

    const customKey = req.headers.get("x-gemini-key") || body.apiKey || undefined;

    const quizQuestions = await generateAIQuiz(contentToAnalyze, finalSubject, customKey);

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

    return NextResponse.json({
      success: true,
      quiz: {
        id: quiz.id,
        title: quiz.title,
        subject: quiz.subject,
        questions: quizQuestions,
        totalQuestions: quizQuestions.length,
        createdAt: quiz.createdAt,
      },
    });
  } catch (err: any) {
    console.error("Quiz generation error:", err);
    return NextResponse.json(
      { error: err?.message || "Failed to generate quiz" },
      { status: 400 }
    );
  }
}

export async function PUT(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { quizId, score, totalQuestions } = body;

    const updated = await prisma.quiz.update({
      where: { id: quizId, userId: user.id },
      data: {
        score: score,
        totalQuestions: totalQuestions || 5,
        completed: true,
      },
    });

    // Reward study minutes & streak count
    await prisma.user.update({
      where: { id: user.id },
      data: {
        studyMinutes: { increment: 20 },
      },
    });

    return NextResponse.json({
      success: true,
      quiz: updated,
    });
  } catch (err) {
    console.error("Quiz submit error:", err);
    return NextResponse.json({ error: "Failed to record quiz score" }, { status: 500 });
  }
}

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const quizzes = await prisma.quiz.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
    });

    const formatted = quizzes.map((q) => ({
      id: q.id,
      title: q.title,
      subject: q.subject,
      questions: JSON.parse(q.questions || "[]"),
      score: q.score,
      totalQuestions: q.totalQuestions,
      completed: q.completed,
      createdAt: q.createdAt,
    }));

    return NextResponse.json({ quizzes: formatted });
  } catch (err) {
    console.error("Fetch quizzes error:", err);
    return NextResponse.json({ error: "Failed to load quizzes" }, { status: 500 });
  }
}
