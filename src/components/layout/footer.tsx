import Link from "next/link";
import { Sparkles } from "lucide-react";

const footerLinks = {
  product: [
    { href: "/workspace", label: "创作工作台" },
    { href: "/pricing", label: "定价" },
    { href: "/help", label: "帮助中心" },
  ],
  company: [
    { href: "/about", label: "关于我们" },
    { href: "/contact", label: "联系我们" },
  ],
  legal: [
    { href: "/terms", label: "服务条款" },
    { href: "/disclaimer", label: "免责声明" },
  ],
};

export function Footer() {
  return (
    <footer className="border-t border-border bg-card/50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600">
                <Sparkles className="h-4 w-4 text-white" />
              </div>
              <span className="text-lg font-bold">
                闪映<span className="brand-text">AI</span>
              </span>
            </Link>
            <p className="text-sm text-muted-foreground">
              AI驱动的营销视频生成平台
              <br />
              让每个商家都能轻松创作专业视频
            </p>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h3 className="text-sm font-semibold text-foreground mb-3 capitalize">
                {category === "product" ? "产品" : category === "company" ? "公司" : "法律"}
              </h3>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-10 pt-6 border-t border-border text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} 闪映AI. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
