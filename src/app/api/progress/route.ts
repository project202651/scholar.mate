import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const [docCount, noteCount, decks, quizzes, tasks] = await Promise.all([
      prisma.document.count({ where: { userId: user.id } }),
      prisma.studyNote.count({ where: { userId: user.id } }),
      prisma.flashcardDeck.findMany({ where: { userId: user.id } }),
      prisma.quiz.findMany({ where: { userId: user.id } }),
      prisma.studyTask.findMany({ where: { userId: user.id } }),
    ]);

    // Flashcard stats
    let totalCards = 0;
    let masteredCards = 0;
    decks.forEach((d) => {
      try {
        const cards = JSON.parse(d.cards || "[]");
        totalCards += cards.length;
        masteredCards += cards.filter((c: { mastered?: boolean }) => c.mastered).length;
      } catch {}
    });

    // Quiz stats
    const completedQuizzes = quizzes.filter((q) => q.completed && q.score !== null);
    let totalScore = 0;
    let maxScore = 0;
    completedQuizzes.forEach((q) => {
      totalScore += q.score || 0;
      maxScore += q.totalQuestions || 5;
    });
    const avgQuizPercentage = maxScore > 0 ? Math.round((totalScore / maxScore) * 100) : 75;

    // Task stats
    const completedTasks = tasks.filter((t) => t.completed).length;
    const taskCompletionRate = tasks.length > 0 ? Math.round((completedTasks / tasks.length) * 100) : 60;

    // Calculate Exam Readiness Score (0 - 100%)
    const readinessScore = Math.min(
      100,
      Math.round(
        (noteCount > 0 ? 25 : 10) +
        (avgQuizPercentage * 0.35) +
        (taskCompletionRate * 0.25) +
        (masteredCards > 0 ? 15 : 5)
      )
    );

    return NextResponse.json({
      progress: {
        docCount,
        noteCount,
        totalCards,
        masteredCards,
        quizzesTaken: completedQuizzes.length,
        avgQuizScore: avgQuizPercentage,
        tasksTotal: tasks.length,
        tasksCompleted: completedTasks,
        taskCompletionRate,
        studyHours: (user.studyMinutes / 60).toFixed(1),
        streakCount: user.streakCount,
        readinessScore,
        college: user.college,
        department: user.department,
        year: user.year,
      },
    });
  } catch (err) {
    console.error("Progress calculation error:", err);
    return NextResponse.json({ error: "Failed to calculate progress" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const minutes = Math.max(1, Math.min(360, parseInt(body.minutes || "25", 10)));

    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: {
        studyMinutes: { increment: minutes },
      },
      select: {
        id: true,
        studyMinutes: true,
        streakCount: true,
      },
    });

    return NextResponse.json({
      success: true,
      addedMinutes: minutes,
      totalStudyMinutes: updatedUser.studyMinutes,
      studyHours: (updatedUser.studyMinutes / 60).toFixed(1),
    });
  } catch (err: any) {
    console.error("Failed to record study session:", err);
    return NextResponse.json({ error: "Failed to record study session" }, { status: 500 });
  }
}
