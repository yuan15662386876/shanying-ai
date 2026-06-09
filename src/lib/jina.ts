/**
 * Jina Reader API client
 * Fetches and extracts content from URLs
 * Base URL: https://r.jina.ai
 */

const JINA_BASE = "https://r.jina.ai";

export async function fetchContentFromUrl(url: string): Promise<{
  content: string;
  title: string;
}> {
  const response = await fetch(`${JINA_BASE}/${encodeURIComponent(url)}`, {
    headers: {
      "Accept": "application/json",
      "X-Return-Format": "markdown",
    },
  });

  if (!response.ok) {
    throw new Error(`Jina Reader error: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();
  return {
    content: data.data?.content || data.content || "",
    title: data.data?.title || data.title || "未命名内容",
  };
}
