import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Fetch latest study schedule if exists
    const latestSchedule = await prisma.studySchedule.findFirst({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
    });

    let parsedPlan: any = null;
    if (latestSchedule && latestSchedule.plan) {
      try {
        parsedPlan = typeof latestSchedule.plan === "string" ? JSON.parse(latestSchedule.plan) : latestSchedule.plan;
      } catch {
        parsedPlan = null;
      }
    }

    return NextResponse.json({
      success: true,
      plan: parsedPlan,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        college: user.college,
        department: user.department,
        year: user.year,
        targetExam: user.targetExam,
        streakCount: user.streakCount,
        studyMinutes: user.studyMinutes,
      },
    });
  } catch (err: any) {
    console.error("Fetch study plan error:", err);
    return NextResponse.json({ error: "Failed to retrieve study plan" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized. Please log in." }, { status: 401 });
    }

    const body = await req.json();
    const planData = body.plan || body;

    const examName = planData.examName || user.targetExam || "Semester End University Examination";
    const examDate = planData.examDate || "2026-10-15";
    const daysRemaining = parseInt(planData.daysRemaining || "18", 10);
    const planString = typeof planData === "string" ? planData : JSON.stringify(planData);

    // 1. Update user profile target exam and department if provided
    await prisma.user.update({
      where: { id: user.id },
      data: {
        targetExam: examName,
        department: planData.branch || user.department,
      },
    });

    // 2. Persist StudySchedule record in PostgreSQL
    const schedule = await prisma.studySchedule.create({
      data: {
        userId: user.id,
        targetExam: examName,
        examDate: examDate,
        daysRemaining: daysRemaining,
        plan: planString,
      },
    });

    // 3. Create initial diagnostic study tasks if subjects are present
    if (Array.isArray(planData.subjects) && planData.subjects.length > 0) {
      const existingTaskCount = await prisma.studyTask.count({ where: { userId: user.id } });
      if (existingTaskCount === 0) {
        for (const sub of planData.subjects.slice(0, 4)) {
          await prisma.studyTask.create({
            data: {
              userId: user.id,
              title: `Master High-Yield Derivations for ${sub}`,
              subject: sub,
              dueDate: examDate,
              priority: "high",
              completed: false,
            },
          });
        }
      }
    }

    return NextResponse.json({
      success: true,
      message: "Study plan successfully persisted to database!",
      scheduleId: schedule.id,
      plan: planData,
    });
  } catch (err: any) {
    console.error("Save study plan error:", err);
    return NextResponse.json({ error: "Failed to persist study plan" }, { status: 500 });
  }
}
