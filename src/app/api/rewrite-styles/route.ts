import { NextResponse } from "next/server";

// Inline style definitions (mirrors DB seed data)
const REWRITE_STYLES = [
  {
    id: "viral_marketing",
    name: "viral_marketing",
    label: "爆款营销",
    description: "适合短视频平台的爆款文案风格，强调刺激购买欲望",
    system_prompt: "你是一个顶级营销文案专家。请将以下内容改写为爆款营销风格的短视频口播文案。要求：1. 开头3秒内抓住注意力 2. 突出痛点 3. 营造紧迫感 4. 明确的行动号召 5. 口语化表达 6. 控制在200字以内。",
  },
  {
    id: "professional",
    name: "professional",
    label: "专业权威",
    description: "专业、可信赖的企业宣传风格",
    system_prompt: "你是一个专业的企业宣传文案专家。请将以下内容改写为专业权威风格的短视频口播文案。要求：1. 用数据和事实说话 2. 语气专业自信 3. 突出专业优势 4. 条理清晰 5. 控制在200字以内。",
  },
  {
    id: "humorous",
    name: "humorous",
    label: "幽默风趣",
    description: "轻松幽默的风格，适合年轻受众",
    system_prompt: "你是一个幽默风趣的短视频文案专家。请将以下内容改写为幽默风格的短视频口播文案。要求：1. 轻松有趣 2. 适当使用网络流行语 3. 让人会心一笑 4. 自然不刻意 5. 控制在200字以内。",
  },
  {
    id: "warm",
    name: "warm",
    label: "温暖治愈",
    description: "温暖走心的情感营销风格",
    system_prompt: "你是一个温暖治愈的文案专家。请将以下内容改写为温暖风格的短视频口播文案。要求：1. 情感共鸣 2. 温暖走心 3. 故事感强 4. 语气柔和 5. 控制在200字以内。",
  },
  {
    id: "storytelling",
    name: "storytelling",
    label: "故事口播",
    description: "以讲故事的方式呈现内容",
    system_prompt: "你是一个擅长讲故事的短视频文案专家。请将以下内容改写为故事口播风格的短视频文案。要求：1. 用故事引入 2. 有起承转合 3. 引人入胜 4. 自然过渡到产品/服务 5. 控制在200字以内。",
  },
  {
    id: "knowledge",
    name: "knowledge",
    label: "知识分享",
    description: "专业知识的通俗化表达",
    system_prompt: "你是一个知识科普类短视频文案专家。请将以下内容改写为知识分享风格的短视频口播文案。要求：1. 深入浅出 2. 干货满满 3. 让复杂概念变得易懂 4. 适当使用类比 5. 控制在200字以内。",
  },
  {
    id: "emotional",
    name: "emotional",
    label: "情感共鸣",
    description: "触动用户情感，建立深度连接",
    system_prompt: "你是一个情感营销文案专家。请将以下内容改写为情感共鸣风格的短视频口播文案。要求：1. 深度洞察用户情绪 2. 触发情感共鸣 3. 建立身份认同 4. 温和引导购买 5. 控制在200字以内。",
  },
];

export async function GET() {
  return NextResponse.json(REWRITE_STYLES);
}
