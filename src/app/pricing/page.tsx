import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, Sparkles, ArrowRight, Zap } from "lucide-react";

const plans = [
  {
    name: "免费体验",
    description: "适合初次尝试",
    price: "¥0",
    credits: "3,000积分",
    features: ["3,000积分（注册赠送）", "5步完整创作流程", "7种改写风格", "内置语音合成", "预设数字人形象", "720P视频输出"],
    popular: false,
    cta: "免费注册",
    href: "/register",
    variant: "secondary" as const,
  },
  {
    name: "创作者",
    description: "适合个人创作者",
    price: "¥99",
    credits: "10,000积分",
    features: ["10,000积分", "全部免费版功能", "声音克隆（可重复使用）", "数字人形象克隆", "1080P高清输出", "优先处理队列", "永久保存作品"],
    popular: true,
    cta: "立即购买",
    href: "/register",
    variant: "default" as const,
  },
  {
    name: "专业版",
    description: "适合团队和企业",
    price: "¥299",
    credits: "50,000积分",
    features: ["50,000积分", "全部创作者功能", "批量视频生成", "API接口访问", "团队协作", "专属客户支持", "自定义品牌水印"],
    popular: false,
    cta: "立即购买",
    href: "/register",
    variant: "secondary" as const,
  },
];

const faqItems = [
  { q: "积分有有效期吗？", a: "积分永久有效，不会过期。您可以随时充值和使用。" },
  { q: "如何充值积分？", a: "目前支持充值码充值。您可以在「个人中心」输入管理员提供的充值码来完成充值。" },
  { q: "生成的视频可以商用吗？", a: "当然可以！您拥有生成视频的全部商业使用权。" },
  { q: "支持退款吗？", a: "未使用的积分支持7天内退款。已消费的积分不支持退款。" },
  { q: "视频生成需要多长时间？", a: "通常3-10分钟即可完成。具体时间取决于视频时长和复杂度。" },
];

export default function PricingPage() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative px-4 pt-20 pb-16 sm:px-6 lg:px-8">
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 h-[400px] w-[600px] rounded-full bg-indigo-500/5 blur-3xl" />
        </div>
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="text-4xl font-bold sm:text-5xl">
            选择适合你的<span className="brand-text">方案</span>
          </h1>
          <p className="mt-4 text-muted-foreground text-lg">
            所有方案均可完整体验5步创作流程
          </p>
        </div>
      </section>

      {/* Plans */}
      <section className="px-4 pb-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl grid gap-8 md:grid-cols-3">
          {plans.map((plan) => (
            <Card
              key={plan.name}
              className={`relative border ${
                plan.popular
                  ? "border-indigo-500/40 shadow-lg shadow-indigo-500/10"
                  : "border-border"
              } bg-card/50`}
            >
              {plan.popular && (
                <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-indigo-500 to-purple-600">
                  <Zap className="mr-1 h-3 w-3" />
                  最受欢迎
                </Badge>
              )}
              <CardHeader className="text-center pb-4">
                <CardTitle className="text-xl">{plan.name}</CardTitle>
                <CardDescription>{plan.description}</CardDescription>
                <div className="mt-4">
                  <span className="text-4xl font-bold">{plan.price}</span>
                  <span className="text-muted-foreground text-sm">/{plan.credits}</span>
                </div>
              </CardHeader>
              <CardContent className="pb-4">
                <ul className="space-y-3">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm">
                      <Check className="h-4 w-4 text-green-400 mt-0.5 shrink-0" />
                      <span className="text-muted-foreground">{f}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Button
                  variant={plan.popular ? "default" : "secondary"}
                  className={`w-full ${plan.popular ? "brand-gradient text-white" : ""}`}
                  render={<Link href={plan.href} />}
                >
                  {plan.cta}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="px-4 py-20 border-t border-border sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-3xl font-bold text-center mb-12">常见问题</h2>
          <div className="space-y-4">
            {faqItems.map((item) => (
              <div key={item.q} className="rounded-xl border border-border bg-card/50 p-6">
                <h3 className="font-semibold mb-2">{item.q}</h3>
                <p className="text-sm text-muted-foreground">{item.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center rounded-3xl border border-indigo-500/20 bg-gradient-to-br from-indigo-500/5 to-purple-500/5 p-12">
          <h2 className="text-2xl font-bold">还有疑问？</h2>
          <p className="mt-2 text-muted-foreground">
            联系我们的团队，获取个性化方案建议
          </p>
          <Button className="mt-6 brand-gradient text-white" render={<Link href="/contact" />}>
            联系我们
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </section>
    </div>
  );
}
