import { NextRequest, NextResponse } from "next/server";
import { fetchContentFromUrl } from "@/lib/jina";

export async function POST(request: NextRequest) {
  try {
    const { url } = await request.json();

    if (!url) {
      return NextResponse.json({ error: "请提供URL" }, { status: 400 });
    }

    // Validate URL format
    try {
      new URL(url);
    } catch {
      return NextResponse.json({ error: "URL格式不正确" }, { status: 400 });
    }

    const result = await fetchContentFromUrl(url);
    return NextResponse.json(result);
  } catch (error) {
    console.error("Content fetch error:", error);
    const message = error instanceof Error ? error.message : "内容抓取失败";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
