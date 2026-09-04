import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { GoogleGenAI } from "@google/genai";

export async function POST(req: Request) {
  try {
    const { apiKey } = await req.json();

    if (!apiKey || typeof apiKey !== "string" || apiKey.trim().length === 0) {
      return NextResponse.json({ error: "API key cannot be empty" }, { status: 400 });
    }

    const trimmedKey = apiKey.trim();

    // Verify key against Google Gemini API before saving
    const testAi = new GoogleGenAI({ apiKey: trimmedKey });
    let verifiedModel = "";

    const candidateModels = ["gemini-3.6-flash", "gemini-3.5-flash-lite", "gemini-3.1-pro-preview"];
    for (const m of candidateModels) {
      try {
        const testRes = await testAi.models.generateContent({
          model: m,
          contents: "Hello",
        });
        if (testRes.text) {
          verifiedModel = m;
          break;
        }
      } catch (err: any) {
        console.warn(`Test model ${m} failed:`, err?.message || err);
      }
    }

    if (!verifiedModel) {
      return NextResponse.json(
        {
          error:
            "Could not verify this Gemini API key with Google's servers. Please ensure it is active and has Gemini access from Google AI Studio (https://aistudio.google.com/).",
        },
        { status: 400 }
      );
    }

    // Update process.env in memory immediately
    process.env.GEMINI_API_KEY = trimmedKey;

    // Persist into .env file
    const envPath = path.join(process.cwd(), ".env");
    let envContent = "";
    if (fs.existsSync(envPath)) {
      envContent = fs.readFileSync(envPath, "utf-8");
      if (envContent.includes("GEMINI_API_KEY=")) {
        envContent = envContent.replace(/GEMINI_API_KEY=.*/g, `GEMINI_API_KEY="${trimmedKey}"`);
      } else {
        envContent += `\nGEMINI_API_KEY="${trimmedKey}"\n`;
      }
    } else {
      envContent = `DATABASE_URL="file:./dev.db"\nJWT_SECRET="scholarmate-super-secret-key-2026-aanm-vvrsr-polytechnic"\nGEMINI_API_KEY="${trimmedKey}"\n`;
    }

    fs.writeFileSync(envPath, envContent, "utf-8");

    return NextResponse.json({
      success: true,
      model: verifiedModel,
      message: `Gemini API key verified and saved successfully! Connected model: ${verifiedModel}`,
    });
  } catch (err: any) {
    console.error("Save API Key error:", err);
    return NextResponse.json(
      { error: err.message || "Failed to verify and save API key" },
      { status: 500 }
    );
  }
}

export async function GET() {
  const currentKey = process.env.GEMINI_API_KEY || "";
  const isSet = Boolean(currentKey && currentKey.trim().length > 5);
  const maskedKey = isSet
    ? `${currentKey.slice(0, 6)}...${currentKey.slice(-4)}`
    : "";

  return NextResponse.json({
    isConfigured: isSet,
    maskedKey: maskedKey,
  });
}
