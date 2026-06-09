"use client";

import { useState, useEffect } from "react";
import { useAuthStore } from "@/stores/auth-store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import {
  Users, Ticket, Settings, Key, Palette, BarChart3,
  UserCog, Copy, Check, Plus, Trash2, Loader2, Shield,
  RefreshCw, Wrench, Sparkles, Eye, EyeOff, Save,
} from "lucide-react";
import { useRouter } from "next/navigation";

// ---- User Management ----
function UserManagement() {
  const [users] = useState([
    { id: "1", phone: "138****8888", displayName: "张三", role: "user", credits: 2500, createdAt: "2026-06-01" },
    { id: "2", phone: "139****9999", displayName: "管理员", role: "admin", credits: 99999, createdAt: "2026-05-15" },
  ]);

  const toggleRole = (userId: string) => {
    toast.success("用户角色已更新");
  };

  return (
    <Card className="border-border bg-card/50">
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <UserCog className="h-5 w-5 text-indigo-400" />
          用户管理
        </CardTitle>
        <CardDescription>管理用户角色和权限</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-muted-foreground">
                <th className="text-left py-3 px-2">用户</th>
                <th className="text-left py-3 px-2">手机号</th>
                <th className="text-left py-3 px-2">积分</th>
                <th className="text-left py-3 px-2">角色</th>
                <th className="text-left py-3 px-2">注册时间</th>
                <th className="text-right py-3 px-2">操作</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id} className="border-b border-border/50">
                  <td className="py-3 px-2 font-medium">{u.displayName}</td>
                  <td className="py-3 px-2 text-muted-foreground">{u.phone}</td>
                  <td className="py-3 px-2">{u.credits.toLocaleString()}</td>
                  <td className="py-3 px-2">
                    <Badge variant={u.role === "admin" ? "default" : "outline"} className="text-xs">
                      {u.role === "admin" ? "管理员" : "用户"}
                    </Badge>
                  </td>
                  <td className="py-3 px-2 text-muted-foreground">{u.createdAt}</td>
                  <td className="py-3 px-2 text-right">
                    <Button variant="ghost" size="sm" onClick={() => toggleRole(u.id)} className="text-xs">
                      {u.role === "admin" ? "降级" : "升级为管理员"}
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}

// ---- Recharge Codes ----
function RechargeCodes() {
  const [codes, setCodes] = useState<Array<{ code: string; credits: number; isUsed: boolean }>>([
    { code: "SHANYING-2026-0001", credits: 1000, isUsed: false },
    { code: "SHANYING-2026-0002", credits: 5000, isUsed: true },
  ]);
  const [newCredits, setNewCredits] = useState("1000");
  const [newCount, setNewCount] = useState("1");
  const [showCodes, setShowCodes] = useState<Record<string, boolean>>({});

  const generateCodes = () => {
    const count = parseInt(newCount) || 1;
    const credits = parseInt(newCredits) || 1000;
    const newCodes = Array.from({ length: Math.min(count, 100) }, (_, i) => ({
      code: `SHANYING-${Date.now().toString(36).toUpperCase()}-${String(i + 1).padStart(4, "0")}`,
      credits,
      isUsed: false,
    }));
    setCodes((prev) => [...newCodes, ...prev]);
    toast.success(`已生成 ${newCodes.length} 个充值码`);
  };

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    toast.success("已复制充值码");
  };

  return (
    <Card className="border-border bg-card/50">
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Ticket className="h-5 w-5 text-indigo-400" />
          充值码管理
        </CardTitle>
        <CardDescription>生成和管理充值码</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Generate */}
        <div className="rounded-xl border border-border bg-secondary/30 p-4">
          <h4 className="text-sm font-medium mb-3">生成充值码</h4>
          <div className="flex items-end gap-3">
            <div className="space-y-1.5 flex-1">
              <Label className="text-xs">积分数量</Label>
              <Input value={newCredits} onChange={(e) => setNewCredits(e.target.value)} type="number" />
            </div>
            <div className="space-y-1.5 w-24">
              <Label className="text-xs">数量（≤100）</Label>
              <Input value={newCount} onChange={(e) => setNewCount(e.target.value)} type="number" max="100" />
            </div>
            <Button onClick={generateCodes} className="brand-gradient text-white">
              <Plus className="mr-1.5 h-4 w-4" />
              生成
            </Button>
          </div>
        </div>

        {/* Code list */}
        <div className="space-y-2">
          {codes.map((c) => (
            <div key={c.code} className="flex items-center justify-between py-2 px-3 rounded-lg bg-secondary/30 text-sm">
              <div className="flex items-center gap-3">
                <span className="font-mono text-xs">{c.code}</span>
                <Badge variant="outline" className="text-xs">{c.credits} 积分</Badge>
                <Badge
                  variant="outline"
                  className={`text-xs ${c.isUsed ? "border-red-500/30 text-red-400" : "border-green-500/30 text-green-400"}`}
                >
                  {c.isUsed ? "已使用" : "未使用"}
                </Badge>
              </div>
              {!c.isUsed && (
                <Button variant="ghost" size="sm" onClick={() => copyCode(c.code)} className="text-xs">
                  <Copy className="h-3.5 w-3.5" />
                </Button>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

// ---- Pricing Settings ----
function PricingSettings() {
  const [rates, setRates] = useState([
    { id: "fetch", name: "内容抓取", cost: 10, unit: "次" },
    { id: "rewrite", name: "AI改写", cost: 20, unit: "次" },
    { id: "voice_clone", name: "声音克隆", cost: 5, unit: "次(首次)" },
    { id: "tts", name: "语音合成", cost: 5, unit: "万字符" },
    { id: "video", name: "视频合成", cost: 50, unit: "分钟" },
  ]);

  return (
    <Card className="border-border bg-card/50">
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <BarChart3 className="h-5 w-5 text-indigo-400" />
          费率设置
        </CardTitle>
        <CardDescription>配置各功能的积分消耗</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {rates.map((rate) => (
            <div key={rate.id} className="flex items-center gap-3">
              <span className="text-sm w-24">{rate.name}</span>
              <Input
                type="number"
                value={rate.cost}
                className="w-24"
                onChange={(e) => {
                  const newRates = rates.map((r) =>
                    r.id === rate.id ? { ...r, cost: parseInt(e.target.value) || 0 } : r
                  );
                  setRates(newRates);
                }}
              />
              <span className="text-sm text-muted-foreground">积分/{rate.unit}</span>
            </div>
          ))}
          <Button
            onClick={() => toast.success("费率已保存")}
            size="sm"
            className="brand-gradient text-white mt-2"
          >
            <Save className="mr-1.5 h-4 w-4" />
            保存费率
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

// ---- API Key Management ----
function ApiKeyManagement() {
  const [apis, setApis] = useState([
    { id: "1", type: "deepseek", name: "DeepSeek", isEnabled: true, keyPreview: "sk-****a1b2" },
    { id: "2", type: "volcengine_voice", name: "火山引擎语音", isEnabled: false, keyPreview: "" },
    { id: "3", type: "volcengine_avatar", name: "火山引擎数字人", isEnabled: false, keyPreview: "" },
    { id: "4", type: "jina", name: "Jina Reader", isEnabled: true, keyPreview: "免费" },
  ]);
  const [showKey, setShowKey] = useState<Record<string, boolean>>({});
  const [editingKey, setEditingKey] = useState("");
  const [newKey, setNewKey] = useState("");

  const toggleApi = (id: string) => {
    setApis((prev) => prev.map((a) => (a.id === id ? { ...a, isEnabled: !a.isEnabled } : a)));
    toast.success("状态已更新");
  };

  const saveKey = (id: string) => {
    setApis((prev) =>
      prev.map((a) =>
        a.id === id ? { ...a, keyPreview: newKey ? `****${newKey.slice(-4)}` : a.keyPreview } : a
      )
    );
    setEditingKey("");
    setNewKey("");
    toast.success("API Key 已更新");
  };

  const testApi = (name: string) => {
    toast.success(`${name} 连接测试成功`);
  };

  return (
    <Card className="border-border bg-card/50">
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Key className="h-5 w-5 text-indigo-400" />
          API 密钥管理
        </CardTitle>
        <CardDescription>管理第三方 API 密钥和连接状态</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {apis.map((api) => (
            <div key={api.id} className="rounded-lg border border-border bg-secondary/30 p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <span className="font-medium text-sm">{api.name}</span>
                  <Badge
                    variant="outline"
                    className={`text-xs ${api.isEnabled ? "border-green-500/30 text-green-400" : "border-muted text-muted-foreground"}`}
                  >
                    {api.isEnabled ? "已启用" : "已禁用"}
                  </Badge>
                  {api.keyPreview && <span className="text-xs text-muted-foreground font-mono">{api.keyPreview}</span>}
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleApi(api.id)}
                    className="text-xs"
                  >
                    {api.isEnabled ? "禁用" : "启用"}
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => testApi(api.name)} className="text-xs">
                    <RefreshCw className="mr-1 h-3 w-3" />
                    测试
                  </Button>
                </div>
              </div>
              {editingKey === api.id ? (
                <div className="flex gap-2">
                  <Input
                    type="password"
                    placeholder="输入新的 API Key"
                    value={newKey}
                    onChange={(e) => setNewKey(e.target.value)}
                    className="flex-1 h-8 text-sm"
                  />
                  <Button size="sm" onClick={() => saveKey(api.id)}>保存</Button>
                  <Button size="sm" variant="outline" onClick={() => setEditingKey("")}>取消</Button>
                </div>
              ) : (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setEditingKey(api.id)}
                  className="text-xs"
                >
                  配置密钥
                </Button>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

// ---- Rewrite Style Management ----
function RewriteStyleManagement() {
  const [styles, setStyles] = useState([
    { id: "viral_marketing", name: "viral_marketing", label: "爆款营销", prompt: "你是一个顶级营销文案专家...", isActive: true },
    { id: "professional", name: "professional", label: "专业权威", prompt: "你是一个专业的企业宣传文案专家...", isActive: true },
    { id: "humorous", name: "humorous", label: "幽默风趣", prompt: "你是一个幽默风趣的短视频文案专家...", isActive: true },
    { id: "warm", name: "warm", label: "温暖治愈", prompt: "你是一个温暖治愈的文案专家...", isActive: true },
    { id: "storytelling", name: "storytelling", label: "故事口播", prompt: "你是一个擅长讲故事的短视频文案专家...", isActive: true },
    { id: "knowledge", name: "knowledge", label: "知识分享", prompt: "你是一个知识科普类短视频文案专家...", isActive: true },
    { id: "emotional", name: "emotional", label: "情感共鸣", prompt: "你是一个情感营销文案专家...", isActive: true },
  ]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editPrompt, setEditPrompt] = useState("");

  const toggleStyle = (id: string) => {
    setStyles((prev) => prev.map((s) => (s.id === id ? { ...s, isActive: !s.isActive } : s)));
  };

  const startEdit = (style: typeof styles[0]) => {
    setEditingId(style.id);
    setEditPrompt(style.prompt);
  };

  const saveEdit = () => {
    setStyles((prev) =>
      prev.map((s) => (s.id === editingId ? { ...s, prompt: editPrompt } : s))
    );
    setEditingId(null);
    toast.success("风格已更新");
  };

  return (
    <Card className="border-border bg-card/50">
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Palette className="h-5 w-5 text-indigo-400" />
          改写风格管理
        </CardTitle>
        <CardDescription>管理AI改写风格预设和自定义Prompt</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {styles.map((style) => (
          <div key={style.id} className="rounded-lg border border-border bg-secondary/30 p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="font-medium text-sm">{style.label}</span>
                <Badge
                  variant="outline"
                  className={`text-xs ${style.isActive ? "border-green-500/30 text-green-400" : "border-muted text-muted-foreground"}`}
                >
                  {style.isActive ? "启用" : "禁用"}
                </Badge>
              </div>
              <div className="flex gap-1">
                <Button variant="ghost" size="sm" onClick={() => startEdit(style)} className="text-xs">
                  编辑 Prompt
                </Button>
                <Button variant="ghost" size="sm" onClick={() => toggleStyle(style.id)} className="text-xs">
                  {style.isActive ? "禁用" : "启用"}
                </Button>
              </div>
            </div>
            {editingId === style.id ? (
              <div className="space-y-2">
                <Textarea
                  value={editPrompt}
                  onChange={(e) => setEditPrompt(e.target.value)}
                  className="min-h-[80px] text-sm"
                />
                <div className="flex gap-2">
                  <Button size="sm" onClick={saveEdit}>保存</Button>
                  <Button size="sm" variant="outline" onClick={() => setEditingId(null)}>取消</Button>
                </div>
              </div>
            ) : (
              <p className="text-xs text-muted-foreground line-clamp-2">{style.prompt}</p>
            )}
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

// ---- System Settings ----
function SystemSettings() {
  const [testMode, setTestMode] = useState(false);

  return (
    <Card className="border-border bg-card/50">
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Wrench className="h-5 w-5 text-indigo-400" />
          系统设置
        </CardTitle>
        <CardDescription>全局系统配置</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between py-2">
          <div>
            <p className="text-sm font-medium">测试模式</p>
            <p className="text-xs text-muted-foreground">启用后API调用将使用模拟数据</p>
          </div>
          <Button
            variant={testMode ? "default" : "outline"}
            size="sm"
            onClick={() => {
              setTestMode(!testMode);
              toast.success(`测试模式已${!testMode ? "启用" : "禁用"}`);
            }}
          >
            {testMode ? <Eye className="mr-1.5 h-4 w-4" /> : <EyeOff className="mr-1.5 h-4 w-4" />}
            {testMode ? "已开启" : "已关闭"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

// ---- Main Admin Page ----
export default function AdminPage() {
  const { user } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (user && user.role !== "admin") {
      router.push("/");
    }
  }, [user, router]);

  if (!user || user.role !== "admin") {
    return (
      <div className="flex min-h-[calc(100vh-3.5rem)] items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
      <div className="flex items-center gap-3 mb-8">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10">
          <Shield className="h-5 w-5 text-amber-400" />
        </div>
        <div>
          <h1 className="text-3xl font-bold">管理后台</h1>
          <p className="text-muted-foreground text-sm">管理员专属功能</p>
        </div>
      </div>

      <Tabs defaultValue="users" className="space-y-6">
        <TabsList className="grid grid-cols-2 sm:grid-cols-5 gap-1 w-full">
          <TabsTrigger value="users" className="text-xs gap-1">
            <Users className="h-3.5 w-3.5" /> 用户
          </TabsTrigger>
          <TabsTrigger value="codes" className="text-xs gap-1">
            <Ticket className="h-3.5 w-3.5" /> 充值码
          </TabsTrigger>
          <TabsTrigger value="pricing" className="text-xs gap-1">
            <BarChart3 className="h-3.5 w-3.5" /> 费率
          </TabsTrigger>
          <TabsTrigger value="api" className="text-xs gap-1">
            <Key className="h-3.5 w-3.5" /> API
          </TabsTrigger>
          <TabsTrigger value="styles" className="text-xs gap-1">
            <Palette className="h-3.5 w-3.5" /> 风格
          </TabsTrigger>
        </TabsList>

        <TabsContent value="users"><UserManagement /></TabsContent>
        <TabsContent value="codes"><RechargeCodes /></TabsContent>
        <TabsContent value="pricing"><PricingSettings /></TabsContent>
        <TabsContent value="api"><ApiKeyManagement /></TabsContent>
        <TabsContent value="styles"><RewriteStyleManagement /></TabsContent>
      </Tabs>

      <SystemSettings />
    </div>
  );
}
