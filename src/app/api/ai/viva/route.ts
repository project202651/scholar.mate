import { NextResponse } from 'next/server';
import { generateVivaQuestions, evaluateVivaResponse } from '@/lib/gemini';
import { getCachedAIResponse, setCachedAIResponse, hashString } from '@/lib/aiCache';

export async function POST(req: Request) {
  try {
    const authHeader = req.headers.get('authorization');
    const headerKey = req.headers.get('x-gemini-key');
    const customKey = (authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : undefined) || headerKey || undefined;

    const body = await req.json();
    const action = body.action || 'generate';

    if (action === 'evaluate') {
      const { question, expectedKeywords = [], studentAnswer, subject } = body;
      if (!question || !studentAnswer || !studentAnswer.trim()) {
        return NextResponse.json(
          { error: 'Question and student oral answer are required for evaluation.' },
          { status: 400 }
        );
      }

      const evaluation = await evaluateVivaResponse(
        question,
        expectedKeywords,
        studentAnswer.trim(),
        subject,
        customKey
      );

      return NextResponse.json({ success: true, evaluation });
    }

    const subject = (body.subject || 'Engineering & Polytechnic').trim();
    const topic = body.topic ? body.topic.trim() : undefined;
    const mode = body.mode || 'theory';

    const cacheKey = `viva_${mode}_${hashString(subject)}_${hashString(topic || 'all')}`;
    const cached = getCachedAIResponse<any>(cacheKey);
    if (cached) {
      return NextResponse.json({ success: true, ...cached, cached: true });
    }

    const vivaData = await generateVivaQuestions(subject, topic, mode, customKey);
    setCachedAIResponse(cacheKey, vivaData);

    return NextResponse.json({ success: true, ...vivaData, cached: false });
  } catch (error: any) {
    console.error('Viva API error:', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to process viva request' },
      { status: 500 }
    );
  }
}
