import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { generateAISchedule } from "@/lib/gemini";

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized. Please login." }, { status: 401 });
    }

    const body = await req.json();
    const { targetExam, examDate, subjects } = body;

    const subjectsArray = Array.isArray(subjects)
      ? subjects
      : (subjects || "Data Structures, Computer Networks, Operating Systems, Software Engineering")
          .split(",")
          .map((s: string) => s.trim())
          .filter(Boolean);

    const examTitle = targetExam || "Polytechnic Board Exams";
    const dateStr = examDate || "Upcoming Semester Exam";

    // Calculate days remaining if valid date
    let daysRemaining = 30;
    if (examDate && !isNaN(Date.parse(examDate))) {
      const diffTime = Math.max(0, new Date(examDate).getTime() - new Date().getTime());
      daysRemaining = Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
    }

    const customKey = req.headers.get("x-gemini-key") || body.apiKey || undefined;

    const planData = await generateAISchedule(examTitle, dateStr, subjectsArray, customKey);

    const schedule = await prisma.studySchedule.create({
      data: {
        userId: user.id,
        targetExam: examTitle,
        examDate: dateStr,
        daysRemaining: daysRemaining,
        plan: JSON.stringify(planData),
      },
    });

    return NextResponse.json({
      success: true,
      schedule: {
        id: schedule.id,
        targetExam: schedule.targetExam,
        examDate: schedule.examDate,
        daysRemaining: schedule.daysRemaining,
        plan: planData,
        createdAt: schedule.createdAt,
      },
    });
  } catch (err: any) {
    console.error("Schedule error:", err);
    return NextResponse.json(
      { error: err?.message || "Failed to generate study schedule" },
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

    const schedules = await prisma.studySchedule.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
    });

    const formatted = schedules.map((s) => ({
      id: s.id,
      targetExam: s.targetExam,
      examDate: s.examDate,
      daysRemaining: s.daysRemaining,
      plan: JSON.parse(s.plan || "[]"),
      createdAt: s.createdAt,
    }));

    return NextResponse.json({ schedules: formatted });
  } catch (err) {
    console.error("Fetch schedule error:", err);
    return NextResponse.json({ error: "Failed to fetch study schedule" }, { status: 500 });
  }
}
