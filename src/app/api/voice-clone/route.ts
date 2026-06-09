import { NextRequest, NextResponse } from "next/server";
import { cloneVoice } from "@/lib/volcengine-voice";

export async function POST(request: NextRequest) {
  try {
    const { audioBase64, referenceText, voiceName } = await request.json();

    if (!audioBase64) {
      return NextResponse.json({ error: "请上传音频样本" }, { status: 400 });
    }

    if (!voiceName) {
      return NextResponse.json({ error: "请提供声音名称" }, { status: 400 });
    }

    // Check if Volcengine key is configured
    if (!process.env.VOLCENGINE_VOICE_API_KEY) {
      return NextResponse.json({
        voiceId: `clone_${Date.now()}`,
        status: "demo",
        demo: true,
        message: "声音克隆 API Key 未配置，演示模式",
      });
    }

    const result = await cloneVoice(audioBase64, referenceText || "", voiceName);
    return NextResponse.json(result);
  } catch (error) {
    console.error("Voice clone error:", error);
    const message = error instanceof Error ? error.message : "声音克隆失败";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
