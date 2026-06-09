import { Card, CardContent } from "@/components/ui/card";
import { FileText, Play, BookOpen } from "lucide-react";

const docs = [
  {
    icon: Play,
    title: "快速开始",
    desc: "5分钟了解如何开始使用闪映AI创作第一个营销视频",
    sections: [
      "1. 注册账号并获取3,000积分",
      "2. 进入创作工作台",
      "3. 输入商品链接，AI自动抓取内容",
      "4. 选择合适的改写风格",
      "5. 选择声音和数字人形象",
      "6. 点击生成，等待3-10分钟",
      "7. 下载或分享您的视频",
    ],
  },
  {
    icon: FileText,
    title: "API 文档",
    desc: "开发者文档 — 即将上线",
    sections: [
      "RESTful API 接口",
      "API Key 认证",
      "视频生成接口",
      "Webhook 回调通知",
      "SDK 下载",
    ],
  },
  {
    icon: BookOpen,
    title: "最佳实践",
    desc: "提高视频质量和营销效果的建议",
    sections: [
      "选择合适的产品链接（详情页优于列表页）",
      "AI改写后手动微调关键信息",
      "选择与产品调性匹配的声音风格",
      "数字人形象要与品牌形象一致",
      "视频标题包含关键词利于传播",
    ],
  },
];

export default function DocsPage() {
  return (
    <div className="min-h-screen">
      <section className="relative px-4 pt-20 pb-16 sm:px-6 lg:px-8">
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 h-[400px] w-[600px] rounded-full bg-indigo-500/5 blur-3xl" />
        </div>
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="text-4xl font-bold sm:text-5xl">
            文档<span className="brand-text">中心</span>
          </h1>
          <p className="mt-4 text-muted-foreground text-lg">
            详细的使用指南和技术文档
          </p>
        </div>
      </section>

      <section className="px-4 pb-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl space-y-8">
          {docs.map((doc) => (
            <Card key={doc.title} className="border-border bg-card/50">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500/10 to-purple-500/10">
                    <doc.icon className="h-5 w-5 text-indigo-400" />
                  </div>
                  <div className="flex-1">
                    <h2 className="text-lg font-semibold mb-1">{doc.title}</h2>
                    <p className="text-sm text-muted-foreground mb-4">{doc.desc}</p>
                    <ul className="space-y-2">
                      {doc.sections.map((s) => (
                        <li key={s} className="text-sm text-muted-foreground flex items-center gap-2">
                          <span className="h-1.5 w-1.5 rounded-full bg-indigo-400 shrink-0" />
                          {s}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
