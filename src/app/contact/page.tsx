import { Mail, MessageCircle, Clock, MapPin } from "lucide-react";

const contactInfo = [
  { icon: Mail, label: "邮箱", value: "support@shanying.ai" },
  { icon: MessageCircle, label: "微信", value: "shanyingAI_2024" },
  { icon: Clock, label: "工作时间", value: "工作日 9:00 - 18:00" },
  { icon: MapPin, label: "地址", value: "中国·杭州" },
];

export default function ContactPage() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative px-4 pt-20 pb-16 sm:px-6 lg:px-8">
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 h-[400px] w-[600px] rounded-full bg-indigo-500/5 blur-3xl" />
        </div>
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="text-4xl font-bold sm:text-5xl">
            联系<span className="brand-text">我们</span>
          </h1>
          <p className="mt-4 text-muted-foreground text-lg max-w-lg mx-auto">
            有任何问题或合作意向，欢迎通过以下方式联系我们
          </p>
        </div>
      </section>

      {/* Contact Info */}
      <section className="px-4 pb-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl">
          <div className="grid gap-4 sm:grid-cols-2">
            {contactInfo.map((item) => (
              <div
                key={item.label}
                className="rounded-xl border border-border bg-card/50 p-6 flex items-start gap-4"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500/10 to-purple-500/10">
                  <item.icon className="h-5 w-5 text-indigo-400" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">{item.label}</p>
                  <p className="font-medium">{item.value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
