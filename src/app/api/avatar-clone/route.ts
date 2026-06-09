import { NextRequest, NextResponse } from "next/server";
import { cloneAvatar } from "@/lib/volcengine-avatar";

export async function POST(request: NextRequest) {
  try {
    const { videoBase64, avatarName } = await request.json();

    if (!videoBase64) {
      return NextResponse.json({ error: "请上传视频样本" }, { status: 400 });
    }

    if (!process.env.VOLCENGINE_DIGITAL_HUMAN_KEY) {
      return NextResponse.json({
        avatarId: `avatar_${Date.now()}`,
        status: "demo",
        demo: true,
        message: "形象克隆 API Key 未配置，演示模式",
      });
    }

    const result = await cloneAvatar(videoBase64, avatarName || "我的数字分身");
    return NextResponse.json(result);
  } catch (error) {
    console.error("Avatar clone error:", error);
    const message = error instanceof Error ? error.message : "形象克隆失败";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
