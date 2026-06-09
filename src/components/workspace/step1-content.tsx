"use client";

import { useState } from "react";
import { useWorkspaceStore } from "@/stores/workspace-store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { Link2, Edit3, Loader2, ArrowRight, Sparkles, FileText } from "lucide-react";

export function Step1Content() {
  const {
    sourceUrl, sourceText, inputMode,
    fetchedTitle, fetchedContent, isFetching, fetchError,
    setSourceUrl, setSourceText, setInputMode,
    setFetchedContent, setIsFetching, setFetchError,
    setStep,
  } = useWorkspaceStore();

  const handleFetch = async () => {
    if (inputMode === "url" && !sourceUrl) {
      toast.error("请输入商品链接");
      return;
    }
    if (inputMode === "text" && !sourceText) {
      toast.error("请输入文案内容");
      return;
    }

    if (inputMode === "text") {
      setFetchedContent("手动输入文案", sourceText);
      toast.success("文案已就绪");
      return;
    }

    setIsFetching(true);
    setFetchError("");

    try {
      const res = await fetch("/api/fetch-content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: sourceUrl }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setFetchedContent(data.title, data.content);
      toast.success("内容抓取成功！");
    } catch (err) {
      const msg = err instanceof Error ? err.message : "抓取失败";
      setFetchError(msg);
      toast.error(msg);
    } finally {
      setIsFetching(false);
    }
  };

  const charCount = fetchedContent.length;

  return (
    <Card className="border-border bg-card/50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 text-white text-xs font-bold">
            1
          </div>
          内容输入
        </CardTitle>
        <CardDescription>
          输入商品链接自动抓取内容，或手动粘贴文案
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        {!fetchedContent ? (
          <>
            <Tabs value={inputMode} onValueChange={(v) => setInputMode(v as "url" | "text")}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="url" className="gap-2">
                  <Link2 className="h-4 w-4" />
                  商品链接
                </TabsTrigger>
                <TabsTrigger value="text" className="gap-2">
                  <Edit3 className="h-4 w-4" />
                  手动输入
                </TabsTrigger>
              </TabsList>
              <TabsContent value="url" className="space-y-3 mt-3">
                <div className="space-y-2">
                  <Label htmlFor="url">商品链接</Label>
                  <Input
                    id="url"
                    placeholder="https://item.jd.com/xxx 或 https://detail.tmall.com/xxx"
                    value={sourceUrl}
                    onChange={(e) => setSourceUrl(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleFetch()}
                  />
                </div>
              </TabsContent>
              <TabsContent value="text" className="space-y-3 mt-3">
                <div className="space-y-2">
                  <Label htmlFor="text">文案内容</Label>
                  <Textarea
                    id="text"
                    placeholder="在此粘贴商品文案（建议100-500字）"
                    className="min-h-[120px]"
                    value={sourceText}
                    onChange={(e) => setSourceText(e.target.value)}
                  />
                </div>
              </TabsContent>
            </Tabs>

            <Button
              onClick={handleFetch}
              disabled={isFetching}
              className="w-full brand-gradient text-white"
            >
              {isFetching ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  正在抓取内容...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-4 w-4" />
                  {inputMode === "url" ? "抓取内容" : "确认文案"}
                </>
              )}
            </Button>
          </>
        ) : (
          <div className="space-y-4">
            {/* Result */}
            <div className="rounded-xl border border-green-500/20 bg-green-500/5 p-4">
              <div className="flex items-center gap-2 mb-2">
                <FileText className="h-4 w-4 text-green-400" />
                <span className="font-medium text-sm">{fetchedTitle}</span>
                <span className="text-xs text-muted-foreground">{charCount} 字</span>
              </div>
              <p className="text-sm text-muted-foreground line-clamp-6 whitespace-pre-wrap">
                {fetchedContent}
              </p>
            </div>

            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => setFetchedContent("", "")}
                className="flex-1"
              >
                重新输入
              </Button>
              <Button
                onClick={() => setStep(2)}
                className="flex-1 brand-gradient text-white"
              >
                下一步：AI改写
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
