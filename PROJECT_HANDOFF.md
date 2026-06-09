# 闪映AI 项目交接文档

> 最后更新：2026-06-09 | 构建状态：✅ `next build` 零错误

---

## 1. 项目概述

**项目名称**：闪映AI（ShanYing AI）— AI驱动的营销视频生成平台

**核心问题**：中小商家制作营销视频门槛高（需真人出镜、专业设备、视频剪辑技能），通过AI全自动完成"商品链接→文案→配音→数字人口播视频"的全流程。

**目标用户**：中国国内C端用户（电商卖家、内容创作者、小微企业主）

**核心流程**（5步）：
1. 输入商品链接 → AI抓取内容
2. 选择风格 → AI改写营销口播文案
3. 选择/克隆声音 → TTS合成配音
4. 选择/克隆数字人形象
5. AI合成口型同步视频 → 输出1080P MP4

---

## 2. 技术选型

| 层级 | 选型 | 理由 |
|------|------|------|
| 前端框架 | Next.js 16 (App Router) | SSR/SSG，国内部署友好，Turbopack 构建快 |
| 样式 | Tailwind CSS 4 + shadcn/ui | 组件可定制，暗色主题内置 |
| 状态管理 | Zustand | 轻量，比 Redux 简洁 |
| 表单 | react-hook-form + zod | 性能好，类型安全 |
| 数据库 | MySQL 8.0（腾讯云 CynosDB） | 轻量、国内免翻、Serverless 弹性 |
| ORM | Prisma 6 | 类型安全，自动迁移，比手写SQL安全 |
| 鉴权 | 自建 JWT（jose + bcryptjs） | 不依赖第三方Auth服务，手机号+密码登录 |
| AI改写 | DeepSeek API（`deepseek-chat`） | 国内服务，性价比高 |
| TTS/声音克隆 | 火山引擎豆包语音 2.0 | 国内服务，音色多，API 质量好 |
| 数字人视频 | 火山引擎智能创作 | 国内服务，口型同步 |
| 内容抓取 | Jina Reader（`r.jina.ai`） | 国内有节点，提取商品页内容 |
| 文件存储 | 腾讯云 COS | 国内速度好，S3兼容 |
| 短信 | 阿里云 SMS | 国内服务，便宜 |
| 部署 | 腾讯云 CloudBase（Serverless） | 面向中国用户，无需翻墙 |

### 已放弃的方案

| 原方案 | 放弃原因 |
|--------|----------|
| Vercel 部署 | 国内访问慢/不稳定 |
| Supabase（Auth + DB） | 国内访问不稳定，Auth 依赖外部服务 |
| Fish Audio TTS | 海外服务，国内合规/速度问题 |
| HeyGen 数字人 | 海外服务，贵且国内访问不稳定 |
| PostgreSQL | 腾讯云 Serverless MySQL 更便宜轻量 |

---

## 3. 已完成的关键决策

1. **全栈国产化**：所有第三方服务必须国内可访问，面向中国C端用户
2. **自建 Auth**：手机号+密码+JWT，不依赖 Supabase Auth。JWT 存在 httpOnly Cookie，middleware 用 `jose` 验证（Edge 兼容）
3. **MySQL 替代 PostgreSQL**：UUID 主键用 `CHAR(36)`，不用自增ID
4. **Prisma 替代 Supabase SDK**：直连数据库，类型安全，`server.ts`/`client.ts`/`middleware.ts` 全删除
5. **豆包语音 2.0 替代 Fish Audio**：端点 `openspeech.bytedance.com`，但鉴权方式待确认（当前代码可能需修正，见已知Bug）
6. **火山引擎数字人替代 HeyGen**：端点待验证，代码占位符
7. **腾讯云 COS 替代 Supabase Storage**：`cos-nodejs-sdk-v5`，`src/lib/cos.ts`
8. **密码哈希用 bcryptjs 而非 bcrypt**：纯 JS，无原生依赖，部署兼容性好
9. **JWT 用 jose 而非 jsonwebtoken**：Edge Runtime 兼容，可在 middleware 中运行
10. **保留旧 SQL 迁移文件**：`supabase/migrations/001_initial_schema.sql` 未删除，作为参考

---

## 4. 当前项目结构

```
shanying-ai/
├── .env                          # Prisma CLI 读取（仅 DATABASE_URL）
├── .env.local                    # Next.js 运行时读取（全量变量，含密钥）
├── .env.local.example            # 模板（无真实密钥）
├── cloudbaserc.json              # 腾讯云 CloudBase 部署配置
├── next.config.ts                # Next.js 配置
├── package.json                  # 依赖声明
├── tsconfig.json                 # TypeScript 配置
├── components.json               # shadcn/ui 配置
├── postcss.config.mjs            # PostCSS (Tailwind)
├── eslint.config.mjs             # ESLint
│
├── prisma/
│   └── schema.prisma             # 数据库模型（MySQL，12张表）
│
├── supabase/
│   └── migrations/
│       └── 001_initial_schema.sql  # [参考] 原 Supabase SQL，不再使用
│
├── public/                       # 静态资源（SVG图标）
│
└── src/
    ├── middleware.ts              # JWT 鉴权中间件（jose，Edge兼容）
    │
    ├── app/
    │   ├── layout.tsx            # 根布局（暗色主题，AuthProvider）
    │   ├── page.tsx              # 首页（Landing Page）
    │   ├── globals.css           # 全局样式 + brand gradient
    │   ├── login/page.tsx        # 登录页
    │   ├── register/page.tsx     # 注册页
    │   ├── workspace/page.tsx    # 创作工作台（5步流程容器）
    │   ├── profile/page.tsx      # 个人中心（积分、交易记录）
    │   ├── my-works/page.tsx     # 我的作品列表
    │   ├── admin/page.tsx        # 管理后台（用户/充值码/API/风格管理）
    │   ├── about/page.tsx        # 关于页
    │   ├── pricing/page.tsx      # 定价页
    │   ├── contact/page.tsx      # 联系我们
    │   ├── help/page.tsx         # 帮助中心
    │   ├── docs/page.tsx         # 文档
    │   ├── terms/page.tsx        # 服务条款
    │   ├── disclaimer/page.tsx   # 免责声明
    │   ├── not-found.tsx         # 404页面
    │   │
    │   └── api/
    │       ├── auth/
    │       │   ├── me/route.ts       # GET  当前用户（从JWT Cookie解析）
    │       │   ├── login/route.ts    # POST 手机号+密码登录
    │       │   ├── register/route.ts # POST 注册新用户
    │       │   └── logout/route.ts   # POST 清除Cookie
    │       ├── ai-rewrite/route.ts    # POST DeepSeek AI改写
    │       ├── fetch-content/route.ts # POST Jina抓取网页内容
    │       ├── rewrite-styles/route.ts # GET 改写风格列表
    │       ├── voice-tts/route.ts     # POST TTS合成 / GET 预设音色
    │       ├── voice-clone/route.ts   # POST 声音克隆
    │       ├── avatar-clone/route.ts  # POST 数字人克隆
    │       └── video-generate/route.ts # POST 视频合成 / GET 预设形象
    │
    ├── components/
    │   ├── auth/auth-provider.tsx      # 客户端Auth初始化
    │   ├── layout/
    │   │   ├── navbar.tsx              # 导航栏（含用户下拉菜单）
    │   │   └── footer.tsx              # 页脚
    │   ├── workspace/
    │   │   ├── step-indicator.tsx      # 5步进度指示器
    │   │   ├── step1-content.tsx       # 内容输入（URL/文本）
    │   │   ├── step2-rewrite.tsx       # AI改写（风格选择+结果编辑）
    │   │   ├── step3-voice.tsx         # 声音选择/克隆+TTS合成
    │   │   ├── step4-avatar.tsx        # 数字人选择/克隆
    │   │   └── step5-generate.tsx      # 视频合成+下载
    │   └── ui/                         # shadcn/ui 组件库（17个组件）
    │
    ├── lib/
    │   ├── db.ts                  # Prisma Client 单例
    │   ├── auth.ts                # JWT签发/验证 + bcrypt密码 + Cookie管理
    │   ├── actions/auth.ts        # Server Actions（登录/注册/登出，含redirect）
    │   ├── deepseek.ts            # DeepSeek API（AI改写）
    │   ├── volcengine-voice.ts    # ⚠️ 火山引擎豆包语音（端点待修正）
    │   ├── volcengine-avatar.ts   # ⚠️ 火山引擎数字人（端点待修正）
    │   ├── cos.ts                 # 腾讯云COS上传/下载/删除
    │   ├── jina.ts                # Jina Reader内容抓取
    │   └── utils.ts               # cn() 工具函数（tailwind-merge）
    │
    └── stores/
        ├── auth-store.ts          # Zustand: 用户登录态（fetch /api/auth/me）
        └── workspace-store.ts     # Zustand: 5步工作流状态
```

---

## 5. 如何启动

### 环境依赖
- **Node.js** ≥ 22.0.0
- **npm** ≥ 10.0.0
- **MySQL 8.0**（已配置：腾讯云 CynosDB）

### 安装步骤

```bash
cd shanying-ai
npm install
```

### 环境变量

复制模板并填入真实值：

```bash
cp .env.local.example .env.local
# 编辑 .env.local
```

关键变量说明：

| 变量 | 说明 | 示例 |
|------|------|------|
| `DATABASE_URL` | MySQL 连接串 | `mysql://root:pass@host:3306/shanying_ai` |
| `JWT_SECRET` | JWT 签名密钥（生产换强密钥）| 任意随机字符串 |
| `DEEPSEEK_API_KEY` | DeepSeek API Key | `sk-xxx` |
| `DEEPSEEK_BASE_URL` | DeepSeek 端点 | `https://api.deepseek.com/v1` |
| `VOLCENGINE_VOICE_API_KEY` | 豆包语音 API Key | UUID 格式 |
| `VOLCENGINE_DIGITAL_HUMAN_KEY` | 数字人 Key | 32位hex |
| `COS_SECRET_ID` | 腾讯云 COS SecretId | `AKIDxxx` |
| `COS_SECRET_KEY` | 腾讯云 COS SecretKey | 随机字符串 |
| `COS_BUCKET` | COS 存储桶名 | `shanying-ai-dev` |
| `COS_REGION` | COS 区域 | `ap-shanghai` |
| `ALIYUN_SMS_*` | 阿里云短信（暂未接入）| 占位 |

### Prisma 配置

```bash
# 生成 Prisma Client
npx prisma generate

# 同步数据库表结构（首次或 schema 变更后）
npx prisma db push

# 查看数据库（GUI）
npx prisma studio
```

> **注意**：Prisma CLI 从 `.env` 读取 DATABASE_URL，Next.js 从 `.env.local` 读取。两个文件都需要 DATABASE_URL。

### 启动命令

```bash
npm run dev      # 开发模式 → http://localhost:3000
npm run build    # 生产构建
npm run start    # 生产启动
```

---

## 6. 当前进度

### ✅ 已完成

| 功能 | 状态 | 说明 |
|------|------|------|
| 项目架构 | ✅ | Next.js 16 + Prisma + MySQL + JWT |
| 数据库 | ✅ | 12张表已建，Prisma schema + db push 通过 |
| 用户注册/登录 | ✅ | 手机号+密码，JWT Cookie，middleware 路由保护 |
| 首页 Landing Page | ✅ | 完整UI，含feature展示和CTA |
| 创作工作台（5步流程UI） | ✅ | step-indicator + 5个step组件，Zustand状态流 |
| 内容抓取 | ✅ | Jina Reader API，支持URL和手动输入 |
| AI改写 | ✅ | DeepSeek API，7种风格预设，结果可编辑 |
| 管理后台 | ✅ | 用户管理/充值码/费率/API Key/风格管理（UI+模拟数据） |
| 辅助页面 | ✅ | 关于/定价/联系/帮助/文档/条款/免责声明 |
| 构建验证 | ✅ | `next build` 零错误，28页全部生成 |

### ⚠️ 代码已写但API待验证

| 功能 | 问题 | 需要 |
|------|------|------|
| TTS 语音合成 | API 端点可能错误 | 确认豆包语音2.0正确端点+鉴权方式 |
| 声音克隆 | 同上 | 同上，还需确认需不需要前置开通服务 |
| 数字人视频合成 | 同上 | 确认火山引擎智能创作正确端点 |
| 数字人克隆 | 同上 | 同上 |
| 文件上传（COS） | SDK已集成，未实测 | 提供真实 COS SecretId/Key |
| 短信验证码 | SDK未集成 | 提供阿里云 SMS 真实凭证 |

### 🐛 已知 Bug

1. **豆包语音 API 不可用**（P0）：`volcengine-voice.ts` 使用 `ark.cn-beijing.volces.com/api/v3/audio/speech` 端点和 `Authorization: Bearer` 鉴权 — 实测返回 401 + "load grant: requested grant not found"。正确端点应为 `openspeech.bytedance.com`，鉴权格式为 `Authorization: Bearer;<key>`（分号）。还需要火山引擎控制台开通豆包语音服务 + 获取 App ID。

2. **数字人 API 未验证**（P0）：`volcengine-avatar.ts` 端点可能类似错误。

3. **`.env.local.example` 过时**：仍包含旧变量名 `VOLCENGINE_ACCESS_KEY`、`VOLCENGINE_SECRET_KEY`、`VOLCENGINE_TTS_APP_ID`、`VOLCENGINE_AVATAR_APP_ID`，需同步更新为 `VOLCENGINE_VOICE_API_KEY` 和 `VOLCENGINE_DIGITAL_HUMAN_KEY`。

4. **Prisma CLI 需要 `.env` 文件**：Next.js 读 `.env.local`，但 Prisma CLI 读 `.env`。目前两个文件都有 DATABASE_URL，但容易忘记同步。

---

## 7. 下一步待办

### 🔴 必须做（P0）

1. **修正豆包语音 API**：将 `volcengine-voice.ts` 端点改为 `openspeech.bytedance.com/api/v1/tts`，鉴权改为 `Authorization: Bearer;<key>` + body 格式修正（`app/user/audio/request` 结构），在火山引擎控制台开通服务并获取 App ID
2. **验证数字人 API**：`volcengine-avatar.ts` 同样修正端点和鉴权
3. **提供 COS 凭证**：`COS_SECRET_ID` + `COS_SECRET_KEY` 真实值，测试上传下载
4. **同步 `.env.local.example`**：更新为当前实际使用的变量名

### 🟡 建议做（P1）

5. **接入阿里云 SMS**：在 `auth.ts` 中实现 `sendSmsCode()` 函数，注册/登录支持短信验证码
6. **积分消费逻辑**：`consume_credits` 已在 SQL 中定义，需在 API routes 中调用
7. **视频列表接入数据库**：`my-works/page.tsx` 目前用硬编码 demo 数据，需改为 Prisma 查询
8. **管理员 API 接入数据库**：`admin/page.tsx` 目前用 useState mock 数据，需改为 Prisma CRUD
9. **腾讯云 CloudBase 部署**：配置 `cloudbaserc.json` 中的真实 envId，首次部署

### 🟢 可选（P2）

10. **手机号短信验证码登录**（替代密码）：在 login/register 页面增加验证码模式
11. **微信支付集成**：秒哒项目标记，具体方案待定
12. **Middleware 迁移到 Proxy**：Next.js 警告 middleware 约定已废弃，建议迁移到新的 Proxy 约定

---

## 8. 注意事项

### 踩过的坑

1. **Prisma 读 `.env`，Next.js 读 `.env.local`**：两个文件不同，Prisma 命令需确保 `.env` 有 DATABASE_URL
2. **Prisma MySQL UUID**：MySQL 无原生 UUID 类型，需用 `@db.Char(36)` 显式声明，否则默认为 `VARCHAR(191)` 浪费空间
3. **`jose` 而不用 `jsonwebtoken`**：后者不兼容 Edge Runtime（middleware），`jose` 可以在 middleware 中验证 JWT
4. **`bcryptjs` 而不用 `bcrypt`**：后者是原生 C++ 模块，在某些部署环境（如 CloudBase Serverless）可能无法编译
5. **火山引擎 TTS ≠ 火山方舟 LLM**：两者是不同的服务入口和鉴权体系。TTS 走 `openspeech.bytedance.com`，LLM 走 `ark.cn-beijing.volces.com`
6. **`next build` 时不会连接数据库**：编译阶段只做类型检查，不执行 DB 查询。`prisma generate` 需要提前运行以生成类型
7. **双重 Base64 编码**：用户提供的数字人 Key 经过了两次 Base64 编码（外层迷惑/传输保护），需两次解码
8. **shadcn/ui 组件用 `render` prop**：如 `<Button render={<Link href="/" />}>` 而非包裹 `<Link>` 在 Button 内

### 特别注意

- **密钥不要明文写在代码里**：`.env.local` 已在 `.gitignore` 中，不要提交
- **JWT_SECRET 生产环境必须更换**：当前为弱密钥 `dev-jwt-secret-not-for-production`
- **`supabase/migrations/` 目录保留作参考**：但 Supabase SDK 已完全移除，不再使用
- **Middleware matcher 已配置**：静态资源不会被鉴权拦截
