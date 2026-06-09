/**
 * DeepSeek API client
 * Used for AI content rewriting
 * Model: deepseek-chat (cost-effective)
 */

const DEEPSEEK_BASE = process.env.DEEPSEEK_BASE_URL || "https://api.deepseek.com/v1";
const DEEPSEEK_KEY = process.env.DEEPSEEK_API_KEY || "";

interface RewriteParams {
  content: string;
  styleName: string;
  systemPrompt: string;
}

export async function rewriteContent(params: RewriteParams): Promise<string> {
  const { content, styleName, systemPrompt } = params;

  const response = await fetch(`${DEEPSEEK_BASE}/chat/completions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${DEEPSEEK_KEY}`,
    },
    body: JSON.stringify({
      model: "deepseek-chat",
      messages: [
        {
          role: "system",
          content: systemPrompt,
        },
        {
          role: "user",
          content: `请改写以下内容：\n\n${content}`,
        },
      ],
      temperature: 0.8,
      max_tokens: 2048,
    }),
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`DeepSeek API error: ${response.status} - ${err}`);
  }

  const data = await response.json();
  return data.choices?.[0]?.message?.content || "";
}
