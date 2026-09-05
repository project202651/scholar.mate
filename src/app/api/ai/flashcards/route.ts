import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { generateAIFlashcards } from "@/lib/gemini";

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    const body = await req.json();
    const { documentId, topic, subject } = body;

    let contentToAnalyze = "";
    let finalSubject = subject || "Engineering Basics";
    let finalTitle = topic || "Active Recall Deck";

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

    if (!contentToAnalyze) {
      contentToAnalyze = `Study material for ${finalTitle} under ${finalSubject}. Definitions, formulas, block diagrams, and exam concepts.`;
    }

    const customKey = req.headers.get("x-gemini-key") || body.apiKey || undefined;

    const cardsArray = await generateAIFlashcards(contentToAnalyze, finalSubject, customKey);

    // Attach local IDs and mastered state
    const cardsWithState = cardsArray.map((c: { front: string; back: string; category?: string }, idx: number) => ({
      id: idx + 1,
      front: c.front,
      back: c.back,
      category: c.category || finalSubject,
      mastered: false,
    }));

    let deckId = `guest_deck_${Date.now()}`;

    if (user) {
      const deck = await prisma.flashcardDeck.create({
        data: {
          userId: user.id,
          documentId: documentId || null,
          title: finalTitle,
          subject: finalSubject,
          cards: JSON.stringify(cardsWithState),
        },
      });
      deckId = deck.id;

      await prisma.user.update({
        where: { id: user.id },
        data: { studyMinutes: { increment: 10 } },
      });
    }

    return NextResponse.json({
      success: true,
      deck: {
        id: deckId,
        title: finalTitle,
        subject: finalSubject,
        cards: cardsWithState,
      },
    });
  } catch (err: any) {
    console.error("AI Flashcards error:", err);
    return NextResponse.json(
      { error: err?.message || "Failed to generate AI flashcards" },
      { status: 400 }
    );
  }
}

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ decks: [] });
    }

    const decks = await prisma.flashcardDeck.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
    });

    const formattedDecks = decks.map((d) => ({
      id: d.id,
      title: d.title,
      subject: d.subject,
      cards: JSON.parse(d.cards || "[]"),
      createdAt: d.createdAt,
    }));

    return NextResponse.json({ decks: formattedDecks });
  } catch (err) {
    console.error("Fetch decks error:", err);
    return NextResponse.json({ error: "Failed to load flashcard decks" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const user = await getCurrentUser();
    const body = await req.json();
    const { deckId, cards } = body;

    if (!deckId || !cards) {
      return NextResponse.json({ error: "Invalid deck payload" }, { status: 400 });
    }

    if (user && !deckId.startsWith("guest_")) {
      const updated = await prisma.flashcardDeck.update({
        where: { id: deckId, userId: user.id },
        data: { cards: JSON.stringify(cards) },
      });
      return NextResponse.json({ success: true, deck: updated });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Update deck error:", err);
    return NextResponse.json({ error: "Failed to update deck" }, { status: 500 });
  }
}
