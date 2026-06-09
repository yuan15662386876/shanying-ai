-- 闪映AI Database Schema
-- Migration 001: Initial schema

-- User Profiles
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  phone TEXT UNIQUE NOT NULL,
  display_name TEXT,
  role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  credits INTEGER DEFAULT 3000,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- API Configurations
CREATE TABLE IF NOT EXISTS public.api_configs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  api_type TEXT NOT NULL,
  provider_name TEXT NOT NULL,
  api_key TEXT,
  base_url TEXT,
  is_enabled BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Credit Transactions
CREATE TABLE IF NOT EXISTS public.credit_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  amount INTEGER NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('grant', 'consume', 'recharge', 'refund')),
  description TEXT,
  balance_after INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Recharge Codes
CREATE TABLE IF NOT EXISTS public.recharge_codes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT UNIQUE NOT NULL,
  credits INTEGER NOT NULL,
  is_used BOOLEAN DEFAULT false,
  used_by UUID REFERENCES profiles(id),
  used_at TIMESTAMPTZ,
  created_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- User Voices (cloned/preset)
CREATE TABLE IF NOT EXISTS public.user_voices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  voice_name TEXT NOT NULL,
  audio_url TEXT,
  provider_voice_id TEXT,
  reference_text TEXT,
  status TEXT DEFAULT 'processing' CHECK (status IN ('processing', 'ready', 'error')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Generated Audios (TTS results)
CREATE TABLE IF NOT EXISTS public.generated_audios (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  voice_id UUID REFERENCES user_voices(id),
  text_content TEXT NOT NULL,
  audio_url TEXT,
  duration_seconds FLOAT,
  status TEXT DEFAULT 'processing' CHECK (status IN ('processing', 'ready', 'error')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- User Avatars (digital human)
CREATE TABLE IF NOT EXISTS public.user_avatars (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  avatar_name TEXT,
  video_url TEXT,
  provider_avatar_id TEXT,
  result_url TEXT,
  status TEXT DEFAULT 'processing' CHECK (status IN ('processing', 'ready', 'error')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Preset Avatars
CREATE TABLE IF NOT EXISTS public.avatars (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  thumbnail_url TEXT,
  provider_avatar_id TEXT NOT NULL,
  category TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Digital Human Videos (final output)
CREATE TABLE IF NOT EXISTS public.digital_human_videos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  title TEXT,
  video_url TEXT,
  thumbnail_url TEXT,
  duration_seconds FLOAT,
  status TEXT DEFAULT 'processing' CHECK (status IN ('processing', 'ready', 'error')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Video Generations (tracking)
CREATE TABLE IF NOT EXISTS public.video_generations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  audio_id UUID REFERENCES generated_audios(id),
  avatar_id TEXT,
  provider_task_id TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'error')),
  video_url TEXT,
  storage_path TEXT,
  credits_consumed INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- System Configuration
CREATE TABLE IF NOT EXISTS public.system_config (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key TEXT UNIQUE NOT NULL,
  value JSONB,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Rewrite Styles
CREATE TABLE IF NOT EXISTS public.rewrite_styles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  label TEXT NOT NULL,
  description TEXT,
  system_prompt TEXT NOT NULL,
  is_active BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_profiles_phone ON profiles(phone);
CREATE INDEX IF NOT EXISTS idx_profiles_role ON profiles(role);
CREATE INDEX IF NOT EXISTS idx_credit_transactions_user ON credit_transactions(user_id, created_at);
CREATE INDEX IF NOT EXISTS idx_recharge_codes_code ON recharge_codes(code);
CREATE INDEX IF NOT EXISTS idx_user_voices_user ON user_voices(user_id);
CREATE INDEX IF NOT EXISTS idx_generated_audios_user ON generated_audios(user_id);
CREATE INDEX IF NOT EXISTS idx_user_avatars_user ON user_avatars(user_id);
CREATE INDEX IF NOT EXISTS idx_digital_human_videos_user ON digital_human_videos(user_id);
CREATE INDEX IF NOT EXISTS idx_video_generations_user ON video_generations(user_id);

-- RLS Policies
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE credit_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_voices ENABLE ROW LEVEL SECURITY;
ALTER TABLE generated_audios ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_avatars ENABLE ROW LEVEL SECURITY;
ALTER TABLE digital_human_videos ENABLE ROW LEVEL SECURITY;
ALTER TABLE video_generations ENABLE ROW LEVEL SECURITY;

-- Profiles: users can read own, admin can read all
CREATE POLICY "Users can read own profile" ON profiles
  FOR SELECT USING (auth.uid() = id OR EXISTS (
    SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'
  ));

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- Credit transactions: users can read own
CREATE POLICY "Users can read own transactions" ON credit_transactions
  FOR SELECT USING (user_id = auth.uid() OR EXISTS (
    SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'
  ));

-- User voices: users can CRUD own
CREATE POLICY "Users can manage own voices" ON user_voices
  FOR ALL USING (user_id = auth.uid());

-- Generated audios: users can read own
CREATE POLICY "Users can manage own audios" ON generated_audios
  FOR ALL USING (user_id = auth.uid());

-- User avatars: users can read own
CREATE POLICY "Users can manage own avatars" ON user_avatars
  FOR ALL USING (user_id = auth.uid());

-- Digital human videos: users can read own
CREATE POLICY "Users can manage own videos" ON digital_human_videos
  FOR ALL USING (user_id = auth.uid());

-- Video generations: users can read own
CREATE POLICY "Users can manage own generations" ON video_generations
  FOR ALL USING (user_id = auth.uid());

-- Avatars: public read
ALTER TABLE avatars ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Avatars are publicly readable" ON avatars
  FOR SELECT USING (true);

-- Admin-only tables
ALTER TABLE api_configs ENABLE ROW LEVEL SECURITY;
ALTER TABLE recharge_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE system_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE rewrite_styles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage api_configs" ON api_configs
  FOR ALL USING (EXISTS (
    SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'
  ));

CREATE POLICY "Admins can manage recharge_codes" ON recharge_codes
  FOR ALL USING (EXISTS (
    SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'
  ));

CREATE POLICY "Admins can manage system_config" ON system_config
  FOR ALL USING (EXISTS (
    SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'
  ));

CREATE POLICY "Rewrite styles are publicly readable" ON rewrite_styles
  FOR SELECT USING (true);

CREATE POLICY "Admins can manage rewrite_styles" ON rewrite_styles
  FOR ALL USING (EXISTS (
    SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'
  ));

-- Function: Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, phone, display_name, credits)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data ->> 'phone', NEW.phone),
    COALESCE(NEW.raw_user_meta_data ->> 'display_name', split_part(NEW.email, '@', 1)),
    3000
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger on auth.users insert
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function: Consume credits
CREATE OR REPLACE FUNCTION public.consume_credits(
  p_user_id UUID,
  p_amount INTEGER,
  p_description TEXT DEFAULT '消费积分'
)
RETURNS BOOLEAN AS $$
DECLARE
  current_balance INTEGER;
BEGIN
  SELECT credits INTO current_balance FROM profiles WHERE id = p_user_id FOR UPDATE;

  IF current_balance < p_amount THEN
    RETURN false;
  END IF;

  UPDATE profiles SET credits = credits - p_amount, updated_at = NOW() WHERE id = p_user_id;

  INSERT INTO credit_transactions (user_id, amount, type, description, balance_after)
  VALUES (p_user_id, -p_amount, 'consume', p_description, current_balance - p_amount);

  RETURN true;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function: Grant credits
CREATE OR REPLACE FUNCTION public.grant_credits(
  p_user_id UUID,
  p_amount INTEGER,
  p_description TEXT DEFAULT '充值'
)
RETURNS BOOLEAN AS $$
DECLARE
  current_balance INTEGER;
BEGIN
  SELECT credits INTO current_balance FROM profiles WHERE id = p_user_id FOR UPDATE;

  UPDATE profiles SET credits = credits + p_amount, updated_at = NOW() WHERE id = p_user_id;

  INSERT INTO credit_transactions (user_id, amount, type, description, balance_after)
  VALUES (p_user_id, p_amount, 'recharge', p_description, current_balance + p_amount);

  RETURN true;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Seed: Default rewrite styles
INSERT INTO rewrite_styles (name, label, description, system_prompt, sort_order) VALUES
  ('viral_marketing', '爆款营销', '适合短视频平台的爆款文案风格，强调刺激购买欲望', '你是一个顶级营销文案专家。请将以下内容改写为爆款营销风格的短视频口播文案。要求：1. 开头3秒内抓住注意力 2. 突出痛点 3. 营造紧迫感 4. 明确的行动号召 5. 口语化表达 6. 控制在200字以内。', 1),
  ('professional', '专业权威', '专业、可信赖的企业宣传风格', '你是一个专业的企业宣传文案专家。请将以下内容改写为专业权威风格的短视频口播文案。要求：1. 用数据和事实说话 2. 语气专业自信 3. 突出专业优势 4. 条理清晰 5. 控制在200字以内。', 2),
  ('humorous', '幽默风趣', '轻松幽默的风格，适合年轻受众', '你是一个幽默风趣的短视频文案专家。请将以下内容改写为幽默风格的短视频口播文案。要求：1. 轻松有趣 2. 适当使用网络流行语 3. 让人会心一笑 4. 自然不刻意 5. 控制在200字以内。', 3),
  ('warm', '温暖治愈', '温暖走心的情感营销风格', '你是一个温暖治愈的文案专家。请将以下内容改写为温暖风格的短视频口播文案。要求：1. 情感共鸣 2. 温暖走心 3. 故事感强 4. 语气柔和 5. 控制在200字以内。', 4),
  ('storytelling', '故事口播', '以讲故事的方式呈现内容', '你是一个擅长讲故事的短视频文案专家。请将以下内容改写为故事口播风格的短视频文案。要求：1. 用故事引入 2. 有起承转合 3. 引人入胜 4. 自然过渡到产品/服务 5. 控制在200字以内。', 5),
  ('knowledge', '知识分享', '专业知识的通俗化表达', '你是一个知识科普类短视频文案专家。请将以下内容改写为知识分享风格的短视频口播文案。要求：1. 深入浅出 2. 干货满满 3. 让复杂概念变得易懂 4. 适当使用类比 5. 控制在200字以内。', 6),
  ('emotional', '情感共鸣', '触动用户情感，建立深度连接', '你是一个情感营销文案专家。请将以下内容改写为情感共鸣风格的短视频口播文案。要求：1. 深度洞察用户情绪 2. 触发情感共鸣 3. 建立身份认同 4. 温和引导购买 5. 控制在200字以内。', 7)
ON CONFLICT DO NOTHING;
