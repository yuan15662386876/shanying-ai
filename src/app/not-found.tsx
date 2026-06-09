import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex min-h-[calc(100vh-3.5rem)] items-center justify-center px-4">
      <div className="text-center">
        <h1 className="text-8xl font-bold brand-text">404</h1>
        <p className="mt-4 text-xl text-muted-foreground">页面不存在</p>
        <p className="mt-2 text-sm text-muted-foreground">
          您访问的页面可能已被移除或地址有误
        </p>
        <Button
          className="mt-8 brand-gradient text-white"
          render={<Link href="/" />}
        >
          <Home className="mr-2 h-4 w-4" />
          返回首页
        </Button>
      </div>
    </div>
  );
}
