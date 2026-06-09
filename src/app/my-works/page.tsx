"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import {
  Play, Download, Trash2, FolderOpen, Clock, Video, Loader2,
  Eye, MoreHorizontal, ExternalLink,
} from "lucide-react";

interface VideoItem {
  id: string;
  title: string;
  thumbnailUrl: string;
  videoUrl: string;
  durationSeconds: number;
  status: "processing" | "ready" | "error";
  createdAt: string;
}

// Demo data
const DEMO_VIDEOS: VideoItem[] = [
  {
    id: "1",
    title: "夏季爆款连衣裙营销视频",
    thumbnailUrl: "",
    videoUrl: "",
    durationSeconds: 35,
    status: "ready",
    createdAt: "2026-06-07 14:30",
  },
  {
    id: "2",
    title: "智能手表专业评测口播",
    thumbnailUrl: "",
    videoUrl: "",
    durationSeconds: 48,
    status: "ready",
    createdAt: "2026-06-06 10:15",
  },
  {
    id: "3",
    title: "儿童教育课程推广",
    thumbnailUrl: "",
    videoUrl: "",
    durationSeconds: 0,
    status: "processing",
    createdAt: "2026-06-08 09:00",
  },
];

function formatDuration(seconds: number): string {
  if (!seconds) return "--";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleDateString("zh-CN", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });
}

export default function MyWorksPage() {
  const [videos, setVideos] = useState<VideoItem[]>(DEMO_VIDEOS);

  const handleDelete = (id: string) => {
    setVideos((prev) => prev.filter((v) => v.id !== id));
    toast.success("视频已删除");
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">我的作品</h1>
        <p className="mt-2 text-muted-foreground">
          管理您生成的所有营销视频
        </p>
      </div>

      {videos.length === 0 ? (
        <Card className="border-border bg-card/50">
          <CardContent className="py-16 text-center">
            <div className="flex justify-center mb-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500/10 to-purple-500/10">
                <FolderOpen className="h-8 w-8 text-muted-foreground" />
              </div>
            </div>
            <h3 className="text-lg font-semibold mb-2">暂无作品</h3>
            <p className="text-sm text-muted-foreground mb-6">
              前往创作工作台，生成您的第一个营销视频
            </p>
            <Button className="brand-gradient text-white" render={<a href="/workspace" />}>
              开始创作
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {videos.map((video) => (
            <Card key={video.id} className="border-border bg-card/50 hover:border-indigo-500/20 transition-colors">
              <CardContent className="p-4">
                <div className="flex items-start gap-4">
                  {/* Thumbnail */}
                  <div className="w-40 h-24 shrink-0 rounded-lg bg-gradient-to-br from-indigo-500/20 to-purple-500/20 flex items-center justify-center">
                    {video.status === "processing" ? (
                      <Loader2 className="h-6 w-6 text-indigo-400 animate-spin" />
                    ) : (
                      <Video className="h-6 w-6 text-indigo-400" />
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h3 className="font-medium text-sm truncate">{video.title}</h3>
                        <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {formatDuration(video.durationSeconds)}
                          </span>
                          <span>{formatDate(video.createdAt)}</span>
                        </div>
                      </div>
                      <Badge
                        variant="outline"
                        className={`text-xs shrink-0 ${
                          video.status === "ready"
                            ? "border-green-500/30 text-green-400"
                            : video.status === "processing"
                            ? "border-amber-500/30 text-amber-400"
                            : "border-red-500/30 text-red-400"
                        }`}
                      >
                        {video.status === "ready" ? "已完成" : video.status === "processing" ? "生成中" : "失败"}
                      </Badge>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-1 mt-3">
                      {video.status === "ready" && (
                        <>
                          <Button variant="ghost" size="sm" className="h-8 text-xs gap-1">
                            <Eye className="h-3.5 w-3.5" />
                            预览
                          </Button>
                          <Button variant="ghost" size="sm" className="h-8 text-xs gap-1">
                            <Download className="h-3.5 w-3.5" />
                            下载
                          </Button>
                        </>
                      )}
                      <div className="flex-1" />
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 text-xs text-destructive gap-1"
                        onClick={() => handleDelete(video.id)}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                        删除
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
