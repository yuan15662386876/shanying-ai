"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { Sparkles, Phone, Lock, User, Gift, Loader2 } from "lucide-react";

export default function RegisterPage() {
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!/^1[3-9]\d{9}$/.test(phone)) {
      toast.error("请输入正确的手机号");
      return;
    }

    if (password.length < 6) {
      toast.error("密码至少需要6个字符");
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, password, displayName }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error || "注册失败");
        return;
      }

      toast.success("注册成功！已赠送 3,000 积分 🎉");
      router.push("/workspace");
      router.refresh();
    } catch {
      toast.error("注册失败，请重试");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-3.5rem)] items-center justify-center px-4 py-12">
      {/* Background glow */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 h-96 w-96 rounded-full bg-purple-500/10 blur-3xl" />
      </div>

      <Card className="w-full max-w-sm border-border bg-card/80 backdrop-blur-sm">
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center mb-2">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg shadow-purple-500/20">
              <Sparkles className="h-6 w-6 text-white" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold">注册闪映AI</CardTitle>
          <CardDescription>注册即送 3,000 积分，开始创作营销视频</CardDescription>
        </CardHeader>

        <form onSubmit={handleRegister}>
          <CardContent className="space-y-4">
            {/* Gift banner */}
            <div className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border border-indigo-500/20 px-3 py-2">
              <Gift className="h-4 w-4 text-indigo-400 shrink-0" />
              <p className="text-xs text-muted-foreground">
                新用户注册即送 <span className="text-indigo-400 font-semibold">3,000</span> 积分
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="displayName">昵称</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="displayName"
                  type="text"
                  placeholder="选填，默认为用户+手机尾号"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="pl-10"
                  maxLength={20}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">手机号</Label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="phone"
                  type="tel"
                  placeholder="请输入手机号"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="pl-10"
                  required
                  maxLength={11}
                  pattern="[0-9]{11}"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">密码</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="password"
                  type="password"
                  placeholder="至少6个字符"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10"
                  required
                  minLength={6}
                />
              </div>
            </div>

            <Button type="submit" className="w-full brand-gradient text-white" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  注册中...
                </>
              ) : (
                "注册并领取 3,000 积分"
              )}
            </Button>
          </CardContent>
        </form>

        <CardFooter className="flex-col gap-3">
          <p className="text-xs text-muted-foreground text-center">
            注册即表示同意{" "}
            <Link href="/terms" className="hover:underline text-primary">
              服务条款
            </Link>{" "}
            和{" "}
            <Link href="/disclaimer" className="hover:underline text-primary">
              免责声明
            </Link>
          </p>
          <Separator />
          <p className="text-sm text-muted-foreground text-center">
            已有账号？{" "}
            <Link href="/login" className="text-primary hover:underline font-medium">
              立即登录
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
