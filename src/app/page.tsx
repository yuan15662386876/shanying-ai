import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Sparkles, Zap, Video, Wand2, ArrowRight, Check } from "lucide-react";

const features = [
  {
    icon: Wand2,
    title: "智能内容抓取",
    description: "粘贴商品链接，AI自动提取核心卖点和文案",
  },
  {
    icon: Zap,
    title: "7种改写风格",
    description: "爆款营销、专业、幽默、温暖…一键切换文案风格",
  },
  {
    icon: Video,
    title: "数字人口播",
    description: "超写实数字人形象，口型同步，告别真人出镜",
  },
];

const steps = [
  { step: "01", title: "输入商品链接", desc: "粘贴URL自动抓取内容" },
  { step: "02", title: "AI智能改写", desc: "7种风格一键生成文案" },
  { step: "03", title: "选择声音", desc: "内置语音或克隆你的声音" },
  { step: "04", title: "选择数字人", desc: "多种形象随心选择" },
  { step: "05", title: "生成视频", desc: "3-10分钟输出MP4" },
];

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative px-4 pt-20 pb-32 sm:px-6 lg:px-8">
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 h-[600px] w-[800px] rounded-full bg-indigo-500/5 blur-3xl" />
          <div className="absolute top-1/3 left-1/4 h-64 w-64 rounded-full bg-purple-500/5 blur-3xl" />
        </div>

        <div className="mx-auto max-w-4xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-indigo-500/20 bg-indigo-500/5 px-4 py-1.5 text-sm text-indigo-400 mb-8">
            <Sparkles className="h-3.5 w-3.5" />
            AI驱动的营销视频生成平台
          </div>

          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
            输入商品链接
            <br />
            <span className="brand-text">AI自动生成营销视频</span>
          </h1>

          <p className="mt-6 text-lg text-muted-foreground max-w-2xl mx-auto">
            5步完成从文案到口播视频的全流程。无需真人出镜、无需专业设备，
            每个商家都能轻松创作专业级营销视频。
          </p>

          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="brand-gradient text-white text-base h-12 px-8" render={<Link href="/register" />}>
              免费开始创作
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button size="lg" variant="secondary" className="text-base h-12 px-8" render={<Link href="/workspace" />}>
              进入工作台
            </Button>
          </div>

          <p className="mt-4 text-sm text-muted-foreground">
            <Check className="inline h-3.5 w-3.5 text-green-400 mr-1" />
            注册即送 3,000 积分，可生成多个视频
          </p>
        </div>
      </section>

      {/* Features */}
      <section className="px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold sm:text-4xl">
              三步完成专业视频制作
            </h2>
            <p className="mt-4 text-muted-foreground">
              无需任何专业技能，AI帮你处理一切
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="relative group rounded-2xl border border-border bg-card/50 p-8 hover:border-indigo-500/30 transition-all duration-300 hover:shadow-lg hover:shadow-indigo-500/5"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500/10 to-purple-500/10 mb-4 group-hover:scale-110 transition-transform">
                  <feature.icon className="h-6 w-6 text-indigo-400" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="px-4 py-20 sm:px-6 lg:px-8 border-t border-border">
        <div className="mx-auto max-w-6xl">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold sm:text-4xl">
              5步创作流程
            </h2>
            <p className="mt-4 text-muted-foreground">
              从链接到视频，一气呵成
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-5">
            {steps.map((s, i) => (
              <div key={s.step} className="relative text-center">
                <div className="flex items-center justify-center mb-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-white text-sm font-bold shadow-lg shadow-indigo-500/20">
                    {s.step}
                  </div>
                </div>
                <h4 className="font-semibold mb-1">{s.title}</h4>
                <p className="text-xs text-muted-foreground">{s.desc}</p>
                {/* Connector arrow */}
                {i < steps.length - 1 && (
                  <div className="hidden sm:block absolute top-5 -right-2 w-4 h-4 text-muted-foreground/30">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M5 12h14M13 5l7 7-7 7" />
                    </svg>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center rounded-3xl border border-indigo-500/20 bg-gradient-to-br from-indigo-500/5 to-purple-500/5 p-12 sm:p-16">
          <h2 className="text-3xl font-bold sm:text-4xl">
            准备好开始创作了吗？
          </h2>
          <p className="mt-4 text-muted-foreground max-w-lg mx-auto">
            注册即送 3,000 积分，体验 AI 驱动的营销视频创作
          </p>
          <div className="mt-8">
            <Button size="lg" className="brand-gradient text-white text-base h-12 px-10" render={<Link href="/register" />}>
              免费注册，领取 3,000 积分
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
