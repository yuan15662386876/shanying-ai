"use client";

import { useState } from "react";
import { useAuthStore } from "@/stores/auth-store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import {
  User, Phone, Coins, Gift, History, Loader2,
  Shield, LogOut,
} from "lucide-react";
import { useRouter } from "next/navigation";

// Demo transactions
const DEMO_TRANSACTIONS = [
  { id: "1", amount: 3000, type: "grant", description: "新用户注册赠送", date: "2026-06-08" },
  { id: "2", amount: -10, type: "consume", description: "内容抓取", date: "2026-06-08" },
  { id: "3", amount: -20, type: "consume", description: "AI改写 - 爆款营销", date: "2026-06-08" },
];

export default function ProfilePage() {
  const { user, signOut } = useAuthStore();
  const router = useRouter();

  const [rechargeCode, setRechargeCode] = useState("");
  const [isRecharging, setIsRecharging] = useState(false);

  const handleRecharge = async () => {
    if (!rechargeCode.trim()) {
      toast.error("请输入充值码");
      return;
    }
    setIsRecharging(true);
    // Simulated recharge
    setTimeout(() => {
      toast.success("演示模式：充值成功");
      setIsRecharging(false);
      setRechargeCode("");
    }, 1000);
  };

  const handleSignOut = async () => {
    await signOut();
    router.push("/login");
    router.refresh();
  };

  if (!user) {
    return (
      <div className="flex min-h-[calc(100vh-3.5rem)] items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 space-y-6">
      <h1 className="text-3xl font-bold">个人中心</h1>

      {/* Profile Card */}
      <Card className="border-border bg-card/50">
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16">
              <AvatarFallback className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white text-xl">
                {(user.displayName || user.phone || "U").slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold">{user.displayName || "用户"}</h2>
                {user.role === "admin" && (
                  <Badge className="bg-amber-500/10 text-amber-400 border-amber-500/20 text-xs">
                    <Shield className="mr-1 h-3 w-3" />
                    管理员
                  </Badge>
                )}
              </div>
              <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                <Phone className="h-3.5 w-3.5" />
                {user.phone}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                闪映AI创作者
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Credits Card */}
      <Card className="border-indigo-500/20 bg-gradient-to-br from-indigo-500/5 to-purple-500/5">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">可用积分</p>
              <p className="text-3xl font-bold mt-1">
                <span className="brand-text">{user.credits.toLocaleString()}</span>
              </p>
            </div>
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-amber-500/10">
              <Coins className="h-7 w-7 text-amber-400" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recharge */}
      <Card className="border-border bg-card/50">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Gift className="h-5 w-5 text-indigo-400" />
            充值积分
          </CardTitle>
          <CardDescription>输入管理员提供的充值码</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex gap-3">
            <Input
              placeholder="请输入充值码"
              value={rechargeCode}
              onChange={(e) => setRechargeCode(e.target.value)}
              className="flex-1"
            />
            <Button
              onClick={handleRecharge}
              disabled={isRecharging || !rechargeCode.trim()}
              className="brand-gradient text-white"
            >
              {isRecharging ? <Loader2 className="h-4 w-4 animate-spin" /> : "充值"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Transaction History */}
      <Card className="border-border bg-card/50">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <History className="h-5 w-5 text-indigo-400" />
            积分明细
          </CardTitle>
        </CardHeader>
        <CardContent>
          {DEMO_TRANSACTIONS.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4">暂无记录</p>
          ) : (
            <div className="space-y-2">
              {DEMO_TRANSACTIONS.map((tx) => (
                <div key={tx.id} className="flex items-center justify-between py-2 text-sm">
                  <div>
                    <p>{tx.description}</p>
                    <p className="text-xs text-muted-foreground">{tx.date}</p>
                  </div>
                  <span
                    className={`font-medium ${
                      tx.amount > 0 ? "text-green-400" : "text-muted-foreground"
                    }`}
                  >
                    {tx.amount > 0 ? "+" : ""}{tx.amount}
                  </span>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Sign Out */}
      <Button
        variant="ghost"
        className="w-full text-destructive justify-center"
        onClick={handleSignOut}
      >
        <LogOut className="mr-2 h-4 w-4" />
        退出登录
      </Button>
    </div>
  );
}
