import { NextRequest, NextResponse } from "next/server";
import { textToSpeech, PRESET_VOICES } from "@/lib/volcengine-voice";

export async function POST(request: NextRequest) {
  try {
    const { text, voiceId } = await request.json();

    if (!text) {
      return NextResponse.json({ error: "请提供要合成的文本" }, { status: 400 });
    }

    if (!voiceId) {
      return NextResponse.json({ error: "请选择声音" }, { status: 400 });
    }

    // Check if Volcengine key is configured
    if (!process.env.VOLCENGINE_VOICE_APP_ID || !process.env.VOLCENGINE_VOICE_API_KEY) {
      // Demo mode: return a simulated result
      return NextResponse.json({
        audioUrl: "",
        duration: text.length / 3,
        demo: true,
        message: "TTS API Key 未配置，演示模式",
      });
    }

    const result = await textToSpeech(text, voiceId);
    return NextResponse.json(result);
  } catch (error) {
    console.error("TTS error:", error);
    const message = error instanceof Error ? error.message : "语音合成失败";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function GET() {
  // Return preset voices from Volcengine
  return NextResponse.json(PRESET_VOICES);
}
