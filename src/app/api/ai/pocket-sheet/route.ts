import { NextResponse } from "next/server";
import { generatePocketRevisionSheet } from "@/lib/gemini";
import { getCachedAIResponse, setCachedAIResponse, hashString } from "@/lib/aiCache";

export async function POST(req: Request) {
  try {
    const authHeader = req.headers.get("authorization");
    const headerKey = req.headers.get("x-gemini-key");
    const customKey = (authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : undefined) || headerKey || undefined;

    const body = await req.json();
    const subject = (body.subject || "Engineering & Polytechnic").trim();
    const topics = Array.isArray(body.topics) ? body.topics : undefined;

    const cacheKey = `pocket_sheet_${hashString(subject)}`;
    const cached = getCachedAIResponse<any>(cacheKey);
    if (cached) {
      return NextResponse.json({ success: true, sheet: cached, cached: true });
    }

    const sheetData = await generatePocketRevisionSheet(subject, topics, customKey);
    setCachedAIResponse(cacheKey, sheetData);

    return NextResponse.json({ success: true, sheet: sheetData, cached: false });
  } catch (error: any) {
    console.error("Pocket Sheet API error:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to generate pocket revision sheet" },
      { status: 500 }
    );
  }
}
