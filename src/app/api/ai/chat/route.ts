import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { askGemini } from "@/lib/gemini";

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized. Please login." }, { status: 401 });
    }

    const body = await req.json();
    const { question, documentId } = body;

    if (!question || question.trim().length === 0) {
      return NextResponse.json({ error: "Question cannot be empty" }, { status: 400 });
    }

    let docContext = "";
    if (documentId) {
      const doc = await prisma.document.findUnique({
        where: { id: documentId, userId: user.id },
      });
      if (doc) {
        docContext = `Document Name: ${doc.title} (${doc.subject})\nContent: ${doc.extractedText.slice(0, 4000)}`;
      }
    }

    // Save student message in DB
    await prisma.chatMessage.create({
      data: {
        userId: user.id,
        documentId: documentId || null,
        role: "user",
        content: question,
      },
    });

    const customKey = req.headers.get("x-gemini-key") || body.apiKey || undefined;

    // Get response from Gemini
    const aiAnswer = await askGemini(question, docContext, customKey);

    // Save assistant response
    const assistantMsg = await prisma.chatMessage.create({
      data: {
        userId: user.id,
        documentId: documentId || null,
        role: "assistant",
        content: aiAnswer,
      },
    });

    // Award study minutes
    await prisma.user.update({
      where: { id: user.id },
      data: { studyMinutes: { increment: 5 } },
    });

    return NextResponse.json({
      success: true,
      answer: aiAnswer,
      messageId: assistantMsg.id,
    });
  } catch (err: any) {
    console.error("AI Chat error:", err);
    return NextResponse.json(
      { error: err?.message || "Failed to process question. Please verify your Gemini API key." },
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

    const messages = await prisma.chatMessage.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "asc" },
      take: 40,
    });

    return NextResponse.json({ messages });
  } catch (err) {
    console.error("Fetch chat error:", err);
    return NextResponse.json({ error: "Failed to fetch chat history" }, { status: 500 });
  }
}
