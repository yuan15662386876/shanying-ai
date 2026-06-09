"use client";

import { useEffect, useState } from "react";
import { useWorkspaceStore } from "@/stores/workspace-store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import {
  UserRound, Upload, Loader2, ArrowRight, ArrowLeft,
  User, Check, Camera, Video,
} from "lucide-react";

interface Avatar {
  id: string;
  name: string;
  gender: string;
  style: string;
  thumbnail: string;
}

const styleLabels: Record<string, string> = {
  professional: "专业",
  casual: "亲和",
  formal: "端庄",
  anchor: "主播",
};

export function Step4Avatar() {
  const {
    selectedAvatarId, setSelectedAvatarId, setStep,
  } = useWorkspaceStore();

  const [avatars, setAvatars] = useState<Avatar[]>([]);
  const [mode, setMode] = useState<"preset" | "clone">("preset");

  // Clone state
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoBase64, setVideoBase64] = useState("");
  const [avatarName, setAvatarName] = useState("");
  const [isCloning, setIsCloning] = useState(false);
  const [clonedAvatarId, setClonedAvatarId] = useState("");

  useEffect(() => {
    fetch("/api/video-generate")
      .then((r) => r.json())
      .then((data) => setAvatars(data))
      .catch(() => {});
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("video/")) {
      toast.error("请上传视频文件");
      return;
    }

    setVideoFile(file);

    const reader = new FileReader();
    reader.onload = () => {
      const base64 = (reader.result as string).split(",")[1];
      setVideoBase64(base64);
    };
    reader.readAsDataURL(file);
  };

  const handleClone = async () => {
    if (!videoBase64) {
      toast.error("请先上传视频样本");
      return;
    }

    setIsCloning(true);
    try {
      const res = await fetch("/api/avatar-clone", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          videoBase64,
          avatarName: avatarName || "我的数字分身",
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setClonedAvatarId(data.avatarId);
      setSelectedAvatarId(data.avatarId);
      toast.success(data.demo ? "演示模式：形象克隆已模拟" : "形象克隆请求已提交");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "克隆失败");
    } finally {
      setIsCloning(false);
    }
  };

  const effectiveAvatarId = mode === "clone" ? clonedAvatarId || selectedAvatarId : selectedAvatarId;

  return (
    <Card className="border-border bg-card/50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 text-white text-xs font-bold">
            4
          </div>
          数字人形象选择
        </CardTitle>
        <CardDescription>
          选择数字人形象或创建您的数字分身
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Mode Switch */}
        <div className="flex rounded-lg border border-border overflow-hidden">
          <button
            onClick={() => setMode("preset")}
            className={`flex-1 py-2.5 text-sm font-medium transition-colors ${
              mode === "preset"
                ? "bg-indigo-500/10 text-foreground"
                : "bg-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            <UserRound className="inline h-4 w-4 mr-1.5" />
            预设形象
          </button>
          <button
            onClick={() => setMode("clone")}
            className={`flex-1 py-2.5 text-sm font-medium transition-colors ${
              mode === "clone"
                ? "bg-indigo-500/10 text-foreground"
                : "bg-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            <Camera className="inline h-4 w-4 mr-1.5" />
            形象克隆
          </button>
        </div>

        {mode === "preset" ? (
          <div className="space-y-4">
            <Label>选择数字人</Label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {avatars.map((avatar) => (
                <button
                  key={avatar.id}
                  onClick={() => setSelectedAvatarId(avatar.id)}
                  className={`p-4 rounded-xl border text-center transition-all ${
                    selectedAvatarId === avatar.id
                      ? "border-indigo-500 bg-indigo-500/10 shadow-sm shadow-indigo-500/10"
                      : "border-border bg-secondary/30 hover:border-indigo-500/30"
                  }`}
                >
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500/20 to-purple-500/20 mx-auto mb-3">
                    {avatar.gender === "female" ? (
                      <UserRound className="h-8 w-8 text-indigo-400" />
                    ) : (
                      <User className="h-8 w-8 text-blue-400" />
                    )}
                  </div>
                  <span className="text-sm font-medium">{avatar.name}</span>
                  <p className="text-[10px] text-muted-foreground mt-1">
                    {styleLabels[avatar.style] || avatar.style}
                  </p>
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="avatarName">形象名称</Label>
              <Input
                id="avatarName"
                placeholder="如：我的数字分身"
                value={avatarName}
                onChange={(e) => setAvatarName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="videoSample">上传视频样本（1-5分钟，正面半身）</Label>
              <Input
                id="videoSample"
                type="file"
                accept="video/*"
                onChange={handleFileChange}
              />
              {videoFile && (
                <p className="text-xs text-green-400 flex items-center gap-1">
                  <Check className="h-3 w-3" />
                  已选择：{videoFile.name}
                </p>
              )}
            </div>
            <Button
              onClick={handleClone}
              disabled={isCloning || !videoBase64}
              className="w-full brand-gradient text-white"
            >
              {isCloning ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  正在提交形象克隆...
                </>
              ) : (
                <>
                  <Upload className="mr-2 h-4 w-4" />
                  提交形象克隆
                </>
              )}
            </Button>
          </div>
        )}

        <Separator />

        <div className="flex gap-3">
          <Button variant="ghost" size="sm" onClick={() => setStep(3)}>
            <ArrowLeft className="mr-1 h-3 w-3" />
            返回上一步
          </Button>
          <Button
            onClick={() => setStep(5)}
            className="flex-1 brand-gradient text-white"
            disabled={!effectiveAvatarId}
          >
            下一步：视频合成
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
