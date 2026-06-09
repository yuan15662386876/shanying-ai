"use client";

import { useState } from "react";
import { useWorkspaceStore } from "@/stores/workspace-store";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import {
  Video, Loader2, ArrowLeft, Check, Download, Sparkles, Play,
  Clock, FileText, Mic, UserRound, RefreshCw,
} from "lucide-react";

export function Step5Generate() {
  const {
    rewrittenContent, selectedVoiceId, selectedAvatarId,
    isGenerating, videoUrl,
    setIsGenerating, setVideoUrl, setStep, reset,
  } = useWorkspaceStore();

  const [taskId, setTaskId] = useState("");
  const [progress, setProgress] = useState(0);

  const handleGenerate = async () => {
    if (!rewrittenContent) {
      toast.error("缺少视频文案");
      return;
    }
    if (!selectedVoiceId) {
      toast.error("请先选择声音");
      return;
    }
    if (!selectedAvatarId) {
      toast.error("请先选择数字人");
      return;
    }

    setIsGenerating(true);
    setProgress(10);

    try {
      // Simulate progress
      const progressInterval = setInterval(() => {
        setProgress((p) => Math.min(p + 10, 90));
      }, 1000);

      const res = await fetch("/api/video-generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          audioUrl: "", // Would be from Step 3 TTS result
          avatarId: selectedAvatarId,
          text: rewrittenContent,
        }),
      });

      clearInterval(progressInterval);

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setTaskId(data.taskId);
      setProgress(100);

      if (data.demo) {
        // Demo mode: simulate completion
        setVideoUrl(data.videoUrl || "demo_video_url");
        toast.success("演示模式：视频合成模拟完成！");
      } else {
        toast.success("视频合成请求已提交！预计3-10分钟完成");
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "视频合成失败");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleReset = () => {
    reset();
    setTaskId("");
    setProgress(0);
  };

  return (
    <Card className="border-border bg-card/50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 text-white text-xs font-bold">
            5
          </div>
          视频合成
        </CardTitle>
        <CardDescription>
          AI自动合成口型同步视频，输出1080P MP4
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Summary */}
        <div className="rounded-xl border border-border bg-secondary/30 p-4 space-y-3">
          <h3 className="text-sm font-medium flex items-center gap-2">
            <FileText className="h-4 w-4 text-muted-foreground" />
            创作总结
          </h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">文案</span>
              <span>{rewrittenContent.length > 0 ? `${rewrittenContent.slice(0, 20)}...` : "未完成"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">声音</span>
              <span>{selectedVoiceId ? "已选择" : "未选择"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">数字人</span>
              <span>{selectedAvatarId ? "已选择" : "未选择"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">输出</span>
              <Badge variant="outline" className="text-xs">1080P MP4</Badge>
            </div>
          </div>
        </div>

        {/* Progress bar */}
        {(isGenerating || progress > 0) && !videoUrl && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">
                {progress < 100 ? "正在生成视频..." : "生成完成！"}
              </span>
              <span className="font-medium">{progress}%</span>
            </div>
            <div className="h-2 rounded-full bg-secondary overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}

        {/* Generate button or result */}
        {!videoUrl ? (
          <Button
            onClick={handleGenerate}
            disabled={isGenerating}
            className="w-full brand-gradient text-white h-12 text-base"
          >
            {isGenerating ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                {progress}% - 合成中...
              </>
            ) : (
              <>
                <Video className="mr-2 h-5 w-5" />
                开始合成视频
              </>
            )}
          </Button>
        ) : (
          <div className="space-y-4">
            {/* Success */}
            <div className="rounded-xl border border-green-500/20 bg-green-500/5 p-6 text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-green-500/10 mx-auto mb-3">
                <Check className="h-7 w-7 text-green-400" />
              </div>
              <h3 className="font-semibold text-lg mb-1">视频合成完成！</h3>
              <p className="text-sm text-muted-foreground mb-4">
                1080P MP4，可随时在「我的作品」中查看和下载
              </p>
              <div className="flex items-center justify-center gap-3">
                <Button variant="outline" size="sm" className="gap-2">
                  <Play className="h-4 w-4" />
                  预览
                </Button>
                <Button size="sm" className="gap-2 brand-gradient text-white">
                  <Download className="h-4 w-4" />
                  下载视频
                </Button>
              </div>
            </div>

            <Button
              onClick={handleReset}
              variant="outline"
              className="w-full"
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              开始新的创作
            </Button>
          </div>
        )}

        <div className="flex justify-between pt-2">
          <Button variant="ghost" size="sm" onClick={() => setStep(4)} disabled={isGenerating}>
            <ArrowLeft className="mr-1 h-3 w-3" />
            返回上一步
          </Button>
          <p className="text-xs text-muted-foreground flex items-center gap-1">
            <Clock className="h-3 w-3" />
            预计 3-10 分钟
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
