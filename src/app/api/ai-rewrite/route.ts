import { NextRequest, NextResponse } from "next/server";
import { rewriteContent } from "@/lib/deepseek";

export async function POST(request: NextRequest) {
  try {
    const { content, styleName, systemPrompt } = await request.json();

    if (!content) {
      return NextResponse.json({ error: "请提供要改写的内容" }, { status: 400 });
    }

    if (!systemPrompt) {
      return NextResponse.json({ error: "请选择改写风格" }, { status: 400 });
    }

    const rewritten = await rewriteContent({ content, styleName, systemPrompt });
    return NextResponse.json({ content: rewritten });
  } catch (error) {
    console.error("AI rewrite error:", error);
    const message = error instanceof Error ? error.message : "AI改写失败";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
