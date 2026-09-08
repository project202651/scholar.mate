import { NextResponse } from 'next/server';
import { analyzePreviousPapers } from '@/lib/gemini';
import { getCachedAIResponse, setCachedAIResponse } from '@/lib/aiCache';

export async function POST(req: Request) {
  try {
    const authHeader = req.headers.get('authorization');
    const headerKey = req.headers.get('x-gemini-key');
    const customApiKey = (authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : undefined) || headerKey || undefined;

    const body = await req.json();
    const subject = body.subject || 'Engineering Subject';
    const paperTexts = body.paperTexts || [];

    const cacheKey = `paper_analysis_50q_v3_${subject}_${paperTexts.length}`;
    const cached = getCachedAIResponse<any>(cacheKey);
    if (cached && Array.isArray(cached.guaranteedQuestions) && cached.guaranteedQuestions.length >= 50) {
      return NextResponse.json({ analysis: cached, cached: true });
    }

    const analysis = await analyzePreviousPapers(subject, paperTexts, customApiKey);
    setCachedAIResponse(cacheKey, analysis);

    return NextResponse.json({ analysis, cached: false });
  } catch (error: any) {
    console.error('Error in paper-analysis route:', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to analyze previous papers' },
      { status: 500 }
    );
  }
}