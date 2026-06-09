import { Search, BookOpen, Video, MessageCircle, ChevronRight } from "lucide-react";

const faqCategories = [
  {
    title: "快速入门",
    items: [
      { q: "如何注册账号？", a: "点击「免费注册」，使用手机号完成注册即可获得3,000积分。" },
      { q: "如何开始创作视频？", a: "登录后进入「创作工作台」，按照5步流程完成：输入链接 → AI改写 → 选择声音 → 选择数字人 → 生成视频。" },
      { q: "支持哪些商品链接？", a: "目前支持淘宝、京东、拼多多等主流电商平台的商品链接，以及任意外部文章URL。" },
    ],
  },
  {
    title: "创作功能",
    items: [
      { q: "AI改写有哪些风格？", a: "目前支持7种风格：爆款营销、专业权威、幽默风趣、温暖治愈、故事口播、知识分享、情感共鸣。" },
      { q: "如何克隆自己的声音？", a: "在「声音选择」步骤中，上传30秒以上的音频样本，系统将自动克隆您的声音。首次克隆消耗5积分。" },
      { q: "如何创建数字分身？", a: "在「数字人形象」步骤中，上传1-5分钟正面视频，系统将创建您的数字分身。" },
    ],
  },
  {
    title: "积分与付费",
    items: [
      { q: "积分如何消耗？", a: "不同功能消耗不同积分：内容抓取按次、AI改写按次、声音克隆5积分/次、TTS按字符计费、视频合成按分钟计费。" },
      { q: "如何充值积分？", a: "在「个人中心」使用管理员提供的充值码进行充值。更多充值方式即将上线。" },
      { q: "积分会过期吗？", a: "积分永久有效，不会过期。" },
    ],
  },
  {
    title: "视频管理",
    items: [
      { q: "视频生成需要多长时间？", a: "通常3-10分钟完成。具体时间取决于视频时长和服务器负载。" },
      { q: "如何下载生成的视频？", a: "在「我的作品」中找到视频，点击下载按钮即可保存到本地。" },
      { q: "视频可以保存多久？", a: "生成的视频永久保存，您可以随时查看和下载。" },
    ],
  },
];

export default function HelpPage() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative px-4 pt-20 pb-16 sm:px-6 lg:px-8">
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 h-[400px] w-[600px] rounded-full bg-indigo-500/5 blur-3xl" />
        </div>
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="text-4xl font-bold sm:text-5xl">
            帮助<span className="brand-text">中心</span>
          </h1>
          <p className="mt-4 text-muted-foreground text-lg">
            快速了解如何使用闪映AI
          </p>
        </div>
      </section>

      {/* FAQ */}
      <section className="px-4 pb-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl space-y-12">
          {faqCategories.map((category) => (
            <div key={category.title}>
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-indigo-400" />
                {category.title}
              </h2>
              <div className="space-y-3">
                {category.items.map((item) => (
                  <details key={item.q} className="group rounded-xl border border-border bg-card/50">
                    <summary className="flex items-center justify-between p-4 cursor-pointer">
                      <span className="font-medium text-sm pr-4">{item.q}</span>
                      <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground transition-transform group-open:rotate-90" />
                    </summary>
                    <p className="px-4 pb-4 text-sm text-muted-foreground leading-relaxed">
                      {item.a}
                    </p>
                  </details>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
