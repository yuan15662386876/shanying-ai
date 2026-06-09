/**
 * 火山引擎豆包语音 2.0 API client (V3 协议)
 * Voice cloning + Text-to-Speech
 *
 * 鉴权方式：X-Api-App-Key + X-Api-Access-Key + X-Api-Resource-Id
 * 端点：openspeech.bytedance.com/api/v3
 *
 * 文档：https://www.volcengine.com/docs/6561
 */

const BASE = "https://openspeech.bytedance.com/api/v3";

const APP_ID = process.env.VOLCENGINE_VOICE_APP_ID || "";
const ACCESS_KEY = process.env.VOLCENGINE_VOICE_API_KEY || "";

/** TTS 资源标识 */
const RESOURCE_TTS = "seed-tts-2.0";
/** 声音复刻资源标识 */
const RESOURCE_CLONE = "seed-icl-2.0";

function authHeaders(resourceId: string): Record<string, string> {
  return {
    "Content-Type": "application/json",
    "X-Api-App-Key": APP_ID,
    "X-Api-Access-Key": ACCESS_KEY,
    "X-Api-Resource-Id": resourceId,
  };
}

// Preset voice IDs（豆包语音内置音色）
export const PRESET_VOICES = [
  { id: "zh_female_qingxin", name: "清新女声", gender: "female", category: "preset" },
  { id: "zh_male_chunhou", name: "醇厚男声", gender: "male", category: "preset" },
  { id: "zh_female_huopo", name: "活泼女声", gender: "female", category: "preset" },
  { id: "zh_male_wenrun", name: "温润男声", gender: "male", category: "preset" },
  { id: "zh_female_tianmei", name: "甜美客服", gender: "female", category: "preset" },
  { id: "zh_male_cixing", name: "磁性男声", gender: "male", category: "preset" },
];

interface TTSResult {
  audioUrl: string;
  duration: number;
}

/**
 * Text-to-Speech：文本转语音
 * 豆包语音合成 2.0 — V3 单向流式
 */
export async function textToSpeech(
  text: string,
  voiceId: string
): Promise<TTSResult> {
  const response = await fetch(`${BASE}/tts/unidirectional`, {
    method: "POST",
    headers: authHeaders(RESOURCE_TTS),
    body: JSON.stringify({
      user: { uid: "shanying_dev" },
      audio_params: {
        voice_type: voiceId,
        format: "mp3",
        sample_rate: 24000,
      },
      text,
    }),
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`豆包语音 TTS 错误: ${response.status} - ${err}`);
  }

  // 返回音频二进制
  const arrayBuffer = await response.arrayBuffer();
  const base64 = Buffer.from(arrayBuffer).toString("base64");
  const dataUrl = `data:audio/mp3;base64,${base64}`;

  // 估算时长（中文约 3 字/秒）
  return {
    audioUrl: dataUrl,
    duration: text.length / 3,
  };
}

/**
 * Voice Clone：从参考音频克隆声音
 * 豆包声音复刻 2.0 — V3 协议
 * 返回 speaker_id 可用于后续 TTS
 */
export async function cloneVoice(
  audioBase64: string,
  referenceText: string,
  voiceName: string
): Promise<{ voiceId: string; status: string }> {
  const response = await fetch(`${BASE}/tts/unidirectional`, {
    method: "POST",
    headers: authHeaders(RESOURCE_CLONE),
    body: JSON.stringify({
      user: { uid: "shanying_dev" },
      audio_data: audioBase64,
      reference_text: referenceText,
      voice_name: voiceName,
      operation: "submit",
    }),
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`豆包语音克隆错误: ${response.status} - ${err}`);
  }

  const data = await response.json();
  return {
    voiceId: data.speaker_id || data.voice_id || data.id || `vc_${Date.now()}`,
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
  const response = await fetch(
    `${BASE}/tts/unidirectional`,
    {
      method: "POST",
      headers: authHeaders(RESOURCE_CLONE),
      body: JSON.stringify({
        user: { uid: "shanying_dev" },
        speaker_id: voiceId,
        operation: "query",
      }),
    }
  );

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`豆包语音状态查询错误: ${response.status} - ${err}`);
  }

  const data = await response.json();
  return {
    status: data.status || "unknown",
    voiceId: data.speaker_id || voiceId,
  };
}
