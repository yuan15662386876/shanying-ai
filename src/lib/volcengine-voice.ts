/**
 * 火山引擎豆包语音 2.0 API client
 * Voice cloning + Text-to-Speech
 *
 * 鉴权方式：火山方舟大模型平台 API Key（Bearer Token）
 * 不再使用旧版 AppID + Token 模式
 *
 * 文档：https://www.volcengine.com/docs/6561
 */

/** 火山方舟大模型平台基础地址 */
const ARK_BASE = "https://ark.cn-beijing.volces.com/api/v3";

const VOICE_API_KEY = process.env.VOLCENGINE_VOICE_API_KEY || "";

const authHeaders = {
  Authorization: `Bearer ${VOICE_API_KEY}`,
  "Content-Type": "application/json",
};

// Preset voice IDs（豆包语音内置音色）
export const PRESET_VOICES = [
  {
    id: "zh_female_qingxin",
    name: "清新女声",
    gender: "female",
    category: "preset",
  },
  {
    id: "zh_male_chunhou",
    name: "醇厚男声",
    gender: "male",
    category: "preset",
  },
  {
    id: "zh_female_huopo",
    name: "活泼女声",
    gender: "female",
    category: "preset",
  },
  {
    id: "zh_male_wenrun",
    name: "温润男声",
    gender: "male",
    category: "preset",
  },
  {
    id: "zh_female_tianmei",
    name: "甜美客服",
    gender: "female",
    category: "preset",
  },
  {
    id: "zh_male_cixing",
    name: "磁性男声",
    gender: "male",
    category: "preset",
  },
];

interface TTSResult {
  audioUrl: string;
  duration: number;
}

/**
 * Text-to-Speech：文本转语音
 * 火山方舟大模型平台 — 豆包语音合成 2.0
 */
export async function textToSpeech(
  text: string,
  voiceId: string
): Promise<TTSResult> {
  const response = await fetch(`${ARK_BASE}/audio/speech`, {
    method: "POST",
    headers: authHeaders,
    body: JSON.stringify({
      model: "doubao-tts",
      input: text,
      voice: voiceId,
      response_format: "mp3",
      speed: 1.0,
    }),
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`豆包语音 TTS 错误: ${response.status} - ${err}`);
  }

  // 火山方舟返回音频二进制
  const arrayBuffer = await response.arrayBuffer();
  const base64 = Buffer.from(arrayBuffer).toString("base64");
  const dataUrl = `data:audio/mp3;base64,${base64}`;

  // 估算时长（中文约 3 字/秒）
  const estimatedDuration = text.length / 3;

  return {
    audioUrl: dataUrl,
    duration: estimatedDuration,
  };
}

/**
 * Voice Clone：从参考音频克隆声音
 * 火山方舟大模型平台 — 豆包语音克隆 2.0
 * 返回 voice_id 可用于后续 TTS
 */
export async function cloneVoice(
  audioBase64: string,
  referenceText: string,
  voiceName: string
): Promise<{ voiceId: string; status: string }> {
  const response = await fetch(`${ARK_BASE}/audio/voice/clone`, {
    method: "POST",
    headers: authHeaders,
    body: JSON.stringify({
      model: "doubao-voice-clone",
      audio_data: audioBase64,
      reference_text: referenceText,
      voice_name: voiceName,
    }),
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`豆包语音克隆错误: ${response.status} - ${err}`);
  }

  const data = await response.json();
  return {
    voiceId: data.voice_id || data.id || `vc_${Date.now()}`,
    status: data.status || "processing",
  };
}

/**
 * 查询声音克隆状态
 */
export async function checkVoiceStatus(voiceId: string): Promise<{
  status: string;
  voiceId: string;
}> {
  const response = await fetch(`${ARK_BASE}/audio/voice/${voiceId}`, {
    headers: {
      Authorization: `Bearer ${VOICE_API_KEY}`,
    },
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`豆包语音状态查询错误: ${response.status} - ${err}`);
  }

  const data = await response.json();
  return {
    status: data.status || "unknown",
    voiceId: data.voice_id || voiceId,
  };
}
