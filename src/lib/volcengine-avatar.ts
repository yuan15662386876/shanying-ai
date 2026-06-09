/**
 * 火山引擎智能创作 API client
 * Digital human avatar + video synthesis
 * Documentation: https://www.volcengine.com/docs/6791
 */

const VOLC_AVATAR_HOST = "https://open.byteplusapi.com";

const VOLC_ACCESS_KEY = process.env.VOLCENGINE_DIGITAL_HUMAN_KEY || "";
const VOLC_SECRET_KEY = process.env.VOLCENGINE_DIGITAL_HUMAN_KEY || "";
const VOLC_AVATAR_APP_ID = process.env.VOLCENGINE_DIGITAL_HUMAN_KEY || "";

// Preset avatar IDs (火山引擎内置数字人形象)
export const PRESET_AVATARS = [
  {
    id: "default_female_business_1",
    name: "职场女性",
    gender: "female",
    style: "professional",
    thumbnail: "",
  },
  {
    id: "default_male_business_1",
    name: "商务男士",
    gender: "male",
    style: "professional",
    thumbnail: "",
  },
  {
    id: "default_female_casual_1",
    name: "亲和女性",
    gender: "female",
    style: "casual",
    thumbnail: "",
  },
  {
    id: "default_male_casual_1",
    name: "活力男生",
    gender: "male",
    style: "casual",
    thumbnail: "",
  },
  {
    id: "default_female_formal_1",
    name: "端庄主播",
    gender: "female",
    style: "formal",
    thumbnail: "",
  },
  {
    id: "default_male_anchor_1",
    name: "沉稳主播",
    gender: "male",
    style: "anchor",
    thumbnail: "",
  },
];

interface LipSyncResult {
  videoUrl: string;
  taskId: string;
  status: string;
}

/**
 * Submit lip-sync video generation
 * Combines audio with avatar for talking-head video
 */
export async function submitLipSync(
  audioUrl: string,
  avatarId: string,
  text: string
): Promise<LipSyncResult> {
  const body = JSON.stringify({
    req_key: "video_gen",
    binary_data_base64: [],
    task_params: {
      avatar_id: avatarId,
      audio_url: audioUrl,
      text: text,
      video_width: 1920,
      video_height: 1080,
      format: "mp4",
    },
  });

  const response = await fetch(`${VOLC_AVATAR_HOST}/api/v1/video/gen`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer;${VOLC_ACCESS_KEY}`,
    },
    body,
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(
      `Volcengine avatar video error: ${response.status} - ${err}`
    );
  }

  const data = await response.json();
  return {
    videoUrl: data.data?.video_url || "",
    taskId: data.data?.task_id || `task_${Date.now()}`,
    status: "processing",
  };
}

/**
 * Clone avatar from video
 * Uses Volcengine digital human creation API
 */
export async function cloneAvatar(
  videoBase64: string,
  avatarName: string
): Promise<{ avatarId: string; status: string }> {
  const body = JSON.stringify({
    req_key: "avatar_clone",
    binary_data_base64: [videoBase64],
    task_params: {
      avatar_name: avatarName || "我的数字分身",
    },
  });

  const response = await fetch(`${VOLC_AVATAR_HOST}/api/v1/avatar/clone`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer;${VOLC_ACCESS_KEY}`,
    },
    body,
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(
      `Volcengine avatar clone error: ${response.status} - ${err}`
    );
  }

  const data = await response.json();
  return {
    avatarId: data.data?.avatar_id || `avatar_${Date.now()}`,
    status: "processing",
  };
}

/**
 * Check video generation status
 */
export async function checkVideoStatus(taskId: string): Promise<{
  status: string;
  videoUrl: string;
}> {
  const response = await fetch(
    `${VOLC_AVATAR_HOST}/api/v1/video/status?task_id=${taskId}`,
    {
      headers: {
        Authorization: `Bearer;${VOLC_ACCESS_KEY}`,
      },
    }
  );

  if (!response.ok) {
    const err = await response.text();
    throw new Error(
      `Volcengine video status error: ${response.status} - ${err}`
    );
  }

  const data = await response.json();
  return {
    status: data.data?.status || "unknown",
    videoUrl: data.data?.video_url || "",
  };
}
