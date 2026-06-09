"use client";

import { useEffect, useState } from "react";
import { useWorkspaceStore } from "@/stores/workspace-store";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import {
  Mic, Upload, Loader2, ArrowRight, ArrowLeft, Play, Sparkles,
  User, UserRound, Volume2, Check,
} from "lucide-react";

interface Voice {
  id: string;
  name: string;
  gender: string;
  category: string;
}

export function Step3Voice() {
  const {
    rewrittenContent, selectedVoiceId,
    setSelectedVoiceId, setStep,
  } = useWorkspaceStore();

  const [voices, setVoices] = useState<Voice[]>([]);
  const [mode, setMode] = useState<"preset" | "clone">("preset");

  // Clone state
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [audioBase64, setAudioBase64] = useState("");
  const [voiceName, setVoiceName] = useState("");
  const [referenceText, setReferenceText] = useState("");
  const [isCloning, setIsCloning] = useState(false);
  const [clonedVoiceId, setClonedVoiceId] = useState("");

  // TTS state
  const [isSynthesizing, setIsSynthesizing] = useState(false);
  const [synthesizedAudio, setSynthesizedAudio] = useState("");

  useEffect(() => {
    fetch("/api/voice-tts")
      .then((r) => r.json())
      .then((data) => setVoices(data))
      .catch(() => {});
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate audio file
    if (!file.type.startsWith("audio/")) {
      toast.error("请上传音频文件");
      return;
    }

    setAudioFile(file);

    const reader = new FileReader();
    reader.onload = () => {
      const base64 = (reader.result as string).split(",")[1];
      setAudioBase64(base64);
    };
    reader.readAsDataURL(file);
  };

  const handleClone = async () => {
    if (!audioBase64) {
      toast.error("请先上传音频样本");
      return;
    }

    setIsCloning(true);
    try {
      const res = await fetch("/api/voice-clone", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          audioBase64,
          referenceText,
          voiceName: voiceName || `我的声音_${Date.now()}`,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setClonedVoiceId(data.voiceId);
      setSelectedVoiceId(data.voiceId);
      toast.success(data.demo ? "演示模式：声音克隆已模拟" : "声音克隆请求已提交！预计5-10分钟完成");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "克隆失败");
    } finally {
      setIsCloning(false);
    }
  };

  const handleSynthesize = async () => {
    const text = rewrittenContent;
    if (!text) {
      toast.error("请先完成AI改写");
      return;
    }

    const voiceId = mode === "clone" ? clonedVoiceId || selectedVoiceId : selectedVoiceId;
    if (!voiceId) {
      toast.error("请选择声音");
      return;
    }

    setIsSynthesizing(true);
    try {
      const res = await fetch("/api/voice-tts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, voiceId }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      if (data.audioUrl) {
        setSynthesizedAudio(data.audioUrl);
      }
      toast.success(data.demo ? "演示模式：TTS 合成已模拟" : "语音合成完成！");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "合成失败");
    } finally {
      setIsSynthesizing(false);
    }
  };

  const isReady = synthesizedAudio || selectedVoiceId;

  return (
    <Card className="border-border bg-card/50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 text-white text-xs font-bold">
            3
          </div>
          声音选择与合成
        </CardTitle>
        <CardDescription>
          选择预设语音或克隆您的声音，然后合成为配音
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
            预设语音
          </button>
          <button
            onClick={() => setMode("clone")}
            className={`flex-1 py-2.5 text-sm font-medium transition-colors ${
              mode === "clone"
                ? "bg-indigo-500/10 text-foreground"
                : "bg-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            <Mic className="inline h-4 w-4 mr-1.5" />
            声音克隆
          </button>
        </div>

        {mode === "preset" ? (
          <div className="space-y-4">
            <Label>选择语音</Label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {voices.map((voice) => (
                <button
                  key={voice.id}
                  onClick={() => setSelectedVoiceId(voice.id)}
                  className={`p-3 rounded-lg border text-left text-sm transition-all ${
                    selectedVoiceId === voice.id
                      ? "border-indigo-500 bg-indigo-500/10 shadow-sm shadow-indigo-500/10"
                      : "border-border bg-secondary/30 hover:border-indigo-500/30"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    {voice.gender === "female" ? (
                      <UserRound className="h-4 w-4 text-pink-400" />
                    ) : (
                      <User className="h-4 w-4 text-blue-400" />
                    )}
                    <span className="text-xs font-medium">{voice.name}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="voiceName">声音名称</Label>
              <Input
                id="voiceName"
                placeholder="如：我的营销配音"
                value={voiceName}
                onChange={(e) => setVoiceName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="audioSample">上传音频样本（30秒以上，MP3/WAV/M4A）</Label>
              <div className="flex items-center gap-3">
                <Input
                  id="audioSample"
                  type="file"
                  accept="audio/*"
                  onChange={handleFileChange}
                  className="flex-1"
                />
              </div>
              {audioFile && (
                <p className="text-xs text-green-400 flex items-center gap-1">
                  <Check className="h-3 w-3" />
                  已选择：{audioFile.name}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="refText">参考文本（音频对应的文字内容，可选）</Label>
              <Textarea
                id="refText"
                placeholder="输入音频中说的话，帮助AI更准确克隆"
                value={referenceText}
                onChange={(e) => setReferenceText(e.target.value)}
                className="min-h-[60px]"
              />
            </div>
            <Button
              onClick={handleClone}
              disabled={isCloning || !audioBase64}
              className="w-full brand-gradient text-white"
            >
              {isCloning ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  正在提交声音克隆...
                </>
              ) : (
                <>
                  <Upload className="mr-2 h-4 w-4" />
                  提交声音克隆（消耗5积分）
                </>
              )}
            </Button>
            {clonedVoiceId && (
              <p className="text-xs text-green-400 text-center">
                {clonedVoiceId ? "声音克隆请求已提交" : ""}
              </p>
            )}
          </div>
        )}

        <Separator />

        {/* Synthesize button */}
        <div className="space-y-3">
          {synthesizedAudio ? (
            <div className="rounded-xl border border-green-500/20 bg-green-500/5 p-4">
              <p className="text-sm font-medium mb-2 flex items-center gap-2">
                <Volume2 className="h-4 w-4 text-green-400" />
                配音合成完成
              </p>
              <audio controls className="w-full h-10">
                <source src={synthesizedAudio} type="audio/mp3" />
              </audio>
            </div>
          ) : null}

          <Button
            onClick={handleSynthesize}
            disabled={isSynthesizing || !selectedVoiceId}
            className="w-full brand-gradient text-white"
          >
            {isSynthesizing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                正在合成语音...
              </>
            ) : (
              <>
                <Volume2 className="mr-2 h-4 w-4" />
                合成配音
              </>
            )}
          </Button>

          <div className="flex gap-3">
            <Button variant="ghost" size="sm" onClick={() => setStep(2)}>
              <ArrowLeft className="mr-1 h-3 w-3" />
              返回上一步
            </Button>
            <Button
              onClick={() => setStep(4)}
              className="flex-1 brand-gradient text-white"
              disabled={!isReady}
            >
              下一步：数字人形象
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
