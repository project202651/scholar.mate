import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { generateSurvivalPlan } from "@/lib/gemini";
import { getCachedAI, setCachedAI, hashString } from "@/lib/aiCache";

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized. Please login." }, { status: 401 });
    }
    const body = await req.json();
    const subject = (body.subject || "Operating Systems & AI").trim();
    const hoursLeft = Number(body.hoursLeft || 12);
    const customKey = req.headers.get("x-gemini-key") || body.apiKey || undefined;

    const cacheKey = `survival_${hoursLeft}h_${hashString(subject)}`;
    const cached = getCachedAI(cacheKey);
    if (cached) {
      return NextResponse.json({ success: true, survivalPlan: cached, cached: true });
    }

    const survivalPlan = await generateSurvivalPlan(subject, hoursLeft, customKey);
    setCachedAI(cacheKey, survivalPlan);

    return NextResponse.json({ success: true, survivalPlan });
  } catch (err: any) {
    console.error("Survival Plan error:", err);
    return NextResponse.json({ error: err?.message || "Failed to generate survival plan" }, { status: 500 });
  }
}
