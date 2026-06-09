"use client";

import { useEffect, useState } from "react";
import { useWorkspaceStore, type RewriteStyle } from "@/stores/workspace-store";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Sparkles, ArrowRight, ArrowLeft, Loader2, Check, Copy } from "lucide-react";

export function Step2Rewrite() {
  const {
    fetchedContent, fetchedTitle,
    selectedStyle, rewrittenContent, isRewriting, rewriteError,
    setSelectedStyle, setRewrittenContent, setIsRewriting, setRewriteError,
    setStep,
  } = useWorkspaceStore();

  const [styles, setStyles] = useState<RewriteStyle[]>([]);
  const [editedContent, setEditedContent] = useState(rewrittenContent);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetch("/api/rewrite-styles")
      .then((r) => r.json())
      .then(setStyles)
      .catch(() => {
        // Fallback to hardcoded styles if API fails
        setStyles([]);
      });
  }, []);

  const selectedStyleData = styles.find((s) => s.name === selectedStyle);

  const handleRewrite = async () => {
    if (!fetchedContent) {
      toast.error("请先输入内容");
      setStep(1);
      return;
    }

    if (!selectedStyleData) {
      toast.error("请选择改写风格");
      return;
    }

    setIsRewriting(true);
    setRewriteError("");

    try {
      const res = await fetch("/api/ai-rewrite", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: fetchedContent,
          styleName: selectedStyle,
          systemPrompt: selectedStyleData.system_prompt,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setRewrittenContent(data.content);
      setEditedContent(data.content);
      toast.success("AI改写完成！");
    } catch (err) {
      const msg = err instanceof Error ? err.message : "改写失败";
      setRewriteError(msg);
      toast.error(msg);
    } finally {
      setIsRewriting(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(editedContent);
    setCopied(true);
    toast.success("已复制到剪贴板");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Card className="border-border bg-card/50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 text-white text-xs font-bold">
            2
          </div>
          AI智能改写
        </CardTitle>
        <CardDescription>
          选择改写风格，AI自动生成营销口播文案
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Style selector */}
        <div className="space-y-2">
          <Label>改写风格</Label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {styles.map((style) => (
              <button
                key={style.name}
                onClick={() => setSelectedStyle(style.name)}
                className={`text-left p-3 rounded-lg border text-sm transition-all duration-200 ${
                  selectedStyle === style.name
                    ? "border-indigo-500 bg-indigo-500/10 text-foreground shadow-sm shadow-indigo-500/10"
                    : "border-border bg-secondary/30 text-muted-foreground hover:border-indigo-500/30"
                }`}
              >
                <div className="font-medium text-xs mb-0.5">{style.label}</div>
                <div className="text-[10px] opacity-60 line-clamp-1">{style.description}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Rewrite button */}
        {!rewrittenContent ? (
          <Button
            onClick={handleRewrite}
            disabled={isRewriting}
            className="w-full brand-gradient text-white"
          >
            {isRewriting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                AI正在改写...
              </>
            ) : (
              <>
                <Sparkles className="mr-2 h-4 w-4" />
                开始AI改写
              </>
            )}
          </Button>
        ) : (
          <div className="space-y-4">
            {/* Rewrite result */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>改写结果（可编辑）</Label>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">
                    {editedContent.length} 字
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleCopy}
                    className="h-7 text-xs"
                  >
                    {copied ? (
                      <Check className="h-3 w-3 text-green-400" />
                    ) : (
                      <Copy className="h-3 w-3" />
                    )}
                  </Button>
                </div>
              </div>
              <Textarea
                value={editedContent}
                onChange={(e) => {
                  setEditedContent(e.target.value);
                  setRewrittenContent(e.target.value);
                }}
                className="min-h-[180px] text-sm leading-relaxed"
              />
            </div>

            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => setRewrittenContent("")}
                className="flex-1"
              >
                重新改写
              </Button>
              <Button
                onClick={handleRewrite}
                disabled={isRewriting}
                variant="outline"
              >
                {isRewriting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
              </Button>
              <Button
                onClick={() => setStep(3)}
                className="flex-1 brand-gradient text-white"
              >
                下一步：声音合成
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        )}

        {/* Navigation */}
        <div className="flex items-center gap-2 pt-2">
          <Button variant="ghost" size="sm" onClick={() => setStep(1)}>
            <ArrowLeft className="mr-1 h-3 w-3" />
            返回上一步
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
