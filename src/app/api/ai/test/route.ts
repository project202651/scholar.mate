import { NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const keyToTest = body.apiKey || process.env.GEMINI_API_KEY;

    if (!keyToTest) {
      return NextResponse.json({
        status: "simulator",
        message: "No Gemini API key provided. Using built-in Academic Tutor Engine (Fully Active & Offline-Ready).",
      });
    }

    const ai = new GoogleGenAI({ apiKey: keyToTest });
    const modelsToTry = ["gemini-3-flash-preview", "gemini-3.6-flash"];

    let successModel = "";
    let sampleResponse = "";

    for (const model of modelsToTry) {
      try {
        const res = await ai.models.generateContent({
          model,
          contents: "Hello! Confirm you are active as ScholarMate AI study assistant for AANM & VVRSR Polytechnic.",
        });
        if (res.text) {
          successModel = model;
          sampleResponse = res.text;
          break;
        }
      } catch (e: any) {
        console.warn(`Model ${model} test failed:`, e?.message || e);
      }
    }

    if (successModel) {
      return NextResponse.json({
        status: "connected",
        model: successModel,
        message: `Successfully connected to Google Gemini (${successModel})!`,
        preview: sampleResponse.slice(0, 120),
      });
    } else {
      return NextResponse.json({
        status: "simulator_fallback",
        message: "Key verification failed or quota exceeded. ScholarMate will automatically use its built-in Academic Tutor Engine.",
      });
    }
  } catch (err: any) {
    return NextResponse.json({
      status: "error",
      message: err.message || "Failed to verify AI connection",
    });
  }
}
