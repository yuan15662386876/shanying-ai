import { Sparkles, Target, Users, Zap } from "lucide-react";

const values = [
  {
    icon: Target,
    title: "使命",
    desc: "让每个商家都能轻松创作专业级营销视频，降低视频营销门槛",
  },
  {
    icon: Zap,
    title: "技术",
    desc: "深度整合最新AI技术，提供从文案到成片的一站式自动化创作体验",
  },
  {
    icon: Users,
    title: "用户优先",
    desc: "持续倾听用户反馈，以最低成本提供最优质的AI视频生成服务",
  },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative px-4 pt-20 pb-16 sm:px-6 lg:px-8">
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 h-[400px] w-[600px] rounded-full bg-indigo-500/5 blur-3xl" />
        </div>
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="text-4xl font-bold sm:text-5xl">
            关于<span className="brand-text">闪映AI</span>
          </h1>
          <p className="mt-6 text-lg text-muted-foreground max-w-2xl mx-auto">
            闪映AI是一个AI驱动的营销视频生成平台。我们致力于让视频创作变得简单、
            高效、低成本，帮助每一位商家用专业的视频内容触达用户。
          </p>
        </div>
      </section>

      {/* Values */}
      <section className="px-4 py-20 sm:px-6 lg:px-8 border-t border-border">
        <div className="mx-auto max-w-5xl">
          <div className="grid gap-8 md:grid-cols-3">
            {values.map((v) => (
              <div key={v.title} className="text-center p-8">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500/10 to-purple-500/10 mx-auto mb-4">
                  <v.icon className="h-7 w-7 text-indigo-400" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{v.title}</h3>
                <p className="text-sm text-muted-foreground">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Story */}
      <section className="px-4 py-20 border-t border-border sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-3xl font-bold text-center mb-8">我们的故事</h2>
          <div className="space-y-4 text-muted-foreground leading-relaxed">
            <p>
              在短视频时代，视频营销已经成为商家获客的必备手段。但我们发现，大量的中小商家
              因为缺乏专业设备、视频制作技能和预算，无法享受到视频营销的红利。
            </p>
            <p>
              闪映AI的创始团队来自AI和视频技术领域，我们深信AI技术可以彻底改变视频创作的方式。
              通过整合最新的AI大模型、语音合成和数字人技术，我们打造了一站式的营销视频生成平台。
            </p>
            <p>
              无论是电商卖家、本地商家还是内容创作者，只需输入一个商品链接，闪映AI就能在几分钟内
              自动生成专业的口播营销视频 — 无需真人出镜，无需专业设备。
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
