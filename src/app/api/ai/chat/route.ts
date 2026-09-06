import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { askGemini } from "@/lib/gemini";

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    const body = await req.json();
    const questionText = body.question || body.message || body.prompt || "";
    const documentId = body.documentId || null;

    if (!questionText || questionText.trim().length === 0) {
      return NextResponse.json({ error: "Question cannot be empty" }, { status: 400 });
    }
    const question = questionText.trim();

    let docContext = "";
    if (documentId) {
      const doc = await prisma.document.findFirst({
        where: user ? { id: documentId, userId: user.id } : { id: documentId },
      });
      if (doc) {
        docContext = `Document Name: ${doc.title} (${doc.subject})\nContent: ${doc.extractedText.slice(0, 12000)}`;
      }
    }

    // Save student message in DB if logged in
    if (user) {
      await prisma.chatMessage.create({
        data: {
          userId: user.id,
          documentId: documentId || null,
          role: "user",
          content: question,
        },
      });
    }

    const customKey = req.headers.get("x-gemini-key") || body.apiKey || undefined;

    // Get response from Gemini
    const aiAnswer = await askGemini(question, docContext, customKey);

    // Save assistant response if logged in
    let assistantMsgId = `guest_${Date.now()}`;
    if (user) {
      const assistantMsg = await prisma.chatMessage.create({
        data: {
          userId: user.id,
          documentId: documentId || null,
          role: "assistant",
          content: aiAnswer,
        },
      });
      assistantMsgId = assistantMsg.id;

      // Award study minutes
      await prisma.user.update({
        where: { id: user.id },
        data: { studyMinutes: { increment: 5 } },
      });
    }

    return NextResponse.json({
      success: true,
      answer: aiAnswer,
      messageId: assistantMsgId,
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
      return NextResponse.json({ messages: [] });
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
