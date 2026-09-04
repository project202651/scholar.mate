import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const tasks = await prisma.studyTask.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ tasks });
  } catch (err) {
    console.error("Fetch tasks error:", err);
    return NextResponse.json({ error: "Failed to load tasks" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { title, subject, priority, dueDate } = body;

    if (!title || title.trim().length === 0) {
      return NextResponse.json({ error: "Task title cannot be empty" }, { status: 400 });
    }

    const task = await prisma.studyTask.create({
      data: {
        userId: user.id,
        title: title.trim(),
        subject: subject || "Study",
        priority: priority || "medium",
        dueDate: dueDate || null,
        completed: false,
      },
    });

    return NextResponse.json({ success: true, task });
  } catch (err) {
    console.error("Create task error:", err);
    return NextResponse.json({ error: "Failed to create task" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { taskId, completed } = body;

    const updated = await prisma.studyTask.update({
      where: { id: taskId, userId: user.id },
      data: { completed: Boolean(completed) },
    });

    // If completed, add 15 study minutes
    if (completed) {
      await prisma.user.update({
        where: { id: user.id },
        data: { studyMinutes: { increment: 15 } },
      });
    }

    return NextResponse.json({ success: true, task: updated });
  } catch (err) {
    console.error("Update task error:", err);
    return NextResponse.json({ error: "Failed to update task" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const taskId = searchParams.get("id");

    if (!taskId) {
      return NextResponse.json({ error: "Task ID required" }, { status: 400 });
    }

    await prisma.studyTask.delete({
      where: { id: taskId, userId: user.id },
    });

    return NextResponse.json({ success: true, message: "Task removed" });
  } catch (err) {
    console.error("Delete task error:", err);
    return NextResponse.json({ error: "Failed to delete task" }, { status: 500 });
  }
}
