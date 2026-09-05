import { NextResponse } from 'next/server';
import { generateExamMap } from '@/lib/gemini';
import { getCachedAIResponse, setCachedAIResponse } from '@/lib/aiCache';

export async function POST(req: Request) {
  try {
    const authHeader = req.headers.get('authorization');
    const customApiKey = authHeader?.startsWith('Bearer ')
      ? authHeader.slice(7)
      : undefined;

    const body = await req.json();
    const subject = body.subject || 'Engineering Subject';
    const syllabusOverview = body.syllabusOverview || subject;
    const examName = body.examName || `${subject} Final Exam`;

    const cacheKey = `exam_map_${subject}_${examName}`;
    const cached = getCachedAIResponse<any>(cacheKey);
    if (cached) {
      return NextResponse.json({ examMap: cached, cached: true });
    }

    const examMap = await generateExamMap(subject, syllabusOverview, customApiKey);
    setCachedAIResponse(cacheKey, examMap);

    return NextResponse.json({ examMap, cached: false });
  } catch (error: any) {
    console.error('Error in exam-map route:', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to generate syllabus exam map' },
      { status: 500 }
    );
  }
}