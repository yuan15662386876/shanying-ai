import { NextRequest, NextResponse } from "next/server";
import { submitLipSync, PRESET_AVATARS } from "@/lib/volcengine-avatar";

export async function POST(request: NextRequest) {
  try {
    const { audioUrl, avatarId, text } = await request.json();

    if (!audioUrl || !avatarId) {
      return NextResponse.json(
        { error: "缺少音频或数字人形象" },
        { status: 400 }
      );
    }

    if (!process.env.VOLCENGINE_DIGITAL_HUMAN_KEY) {
      // Demo mode: return simulated success
      return NextResponse.json({
        taskId: `task_${Date.now()}`,
        status: "demo_completed",
        videoUrl: "",
        demo: true,
        message: "视频合成 API Key 未配置，演示模式。预计3-10分钟完成。",
      });
    }

    const result = await submitLipSync(audioUrl, avatarId, text || "");
    return NextResponse.json(result);
  } catch (error) {
    console.error("Video generate error:", error);
    const message = error instanceof Error ? error.message : "视频合成失败";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json(PRESET_AVATARS);
}
