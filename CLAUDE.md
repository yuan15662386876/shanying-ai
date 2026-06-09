# CLAUDE.md — 闪映AI 开发规则

## 环境

- Node.js ≥ 22, npm ≥ 10
- MySQL 8.0（腾讯云 CynosDB：`sh-cynosdbmysql-grp-edqvw9xy.sql.tencentcdb.com:23916`）
- 项目路径：`/c/Users/2024/shanying-ai`

## 启动

```bash
npm install
npx prisma generate          # 每次 schema 变更后必须运行
npm run dev                   # → http://localhost:3000
```

**注意**：Prisma CLI 从 `.env` 读 DATABASE_URL，Next.js 从 `.env.local` 读。两个文件都要有 DATABASE_URL。schema 变更后执行 `npx prisma db push`。

## 技术栈

```
Next.js 16 (App Router) + React 19 + TypeScript 5
Tailwind CSS 4 + shadcn/ui + framer-motion
Prisma 6 + MySQL 8.0
Zustand（状态管理）+ react-hook-form + zod（表单）
jose（JWT）+ bcryptjs（密码哈希）— 自建Auth
DeepSeek API（AI改写）+ 火山引擎豆包语音2.0（TTS）+ 火山引擎数字人（视频）
```

## 核心规则

1. **所有第三方服务必须国内可访问**。不用 Vercel、Supabase、Fish Audio、HeyGen。
2. **JWT 存在 httpOnly Cookie（`auth_token`）**，middleware 用 `jose` 在 Edge Runtime 验证。
3. **密码哈希用 `bcryptjs`**（不是 `bcrypt`），JWT 用 `jose`（不是 `jsonwebtoken`）。
4. **UUID 主键用 `@db.Char(36)`**（MySQL 无原生 UUID 类型）。
5. **Prisma Client 通过 `src/lib/db.ts` 单例引入**：`import { prisma } from "@/lib/db"`。
6. **Server-side 获取当前用户**：`import { getServerUser } from "@/lib/auth"`。
7. **密钥不写在代码里**，放在 `.env.local`（已在 `.gitignore`）。

## API 端点速查

| 服务 | 端点 | Auth |
|------|------|------|
| DeepSeek | `api.deepseek.com/v1` | `Authorization: Bearer sk-xxx` |
| 豆包语音 TTS | `openspeech.bytedance.com/api/v1/tts` | `Authorization: Bearer;<key>` |
| Jina Reader | `r.jina.ai` | 无需Auth（或`X-Api-Key` header）|
| COS | SDK内置 | SecretId + SecretKey |

## 已知问题（不要重复排查）

- **豆包语音 API**：`volcengine-voice.ts` 端点错误（写成 Ark 平台了），需改为 `openspeech.bytedance.com`，鉴权格式 `Bearer;`（分号非空格），body 结构 `{app, user, audio, request}`。
- **数字人 API**：`volcengine-avatar.ts` 端点同样待验证。
- **COS/阿里云SMS 凭证未提供**，占位处理。
- **`.env.local.example` 变量名过时**，需同步更新。

## 数据库表（12张）

users, api_configs, credit_transactions, recharge_codes, user_voices, generated_audios, user_avatars, avatars, digital_human_videos, video_generations, system_config, rewrite_styles

## 不要做的事

- 不要重新引入 Supabase / PostgreSQL / Fish Audio / HeyGen / Vercel
- 不要在 middleware 中使用 `jsonwebtoken` 或 `bcrypt`（Edge Runtime 不兼容）
- 不要删除 `supabase/migrations/` 目录（保留作为Schema参考）
- 不要在 `.env.local` 写注释式的 HTML 占位符（`<!-- ... -->`），会破坏 `.env` 解析
