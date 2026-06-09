"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuthStore } from "@/stores/auth-store";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  Sparkles,
  FolderOpen,
  User,
  Menu,
  LogOut,
  Coins,
  Settings,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

const navLinks = [
  { href: "/workspace", label: "创作工作台", icon: Sparkles },
  { href: "/my-works", label: "我的作品", icon: FolderOpen },
  { href: "/profile", label: "个人中心", icon: User },
];

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, signOut } = useAuthStore();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    router.push("/login");
    router.refresh();
  };

  return (
    <nav className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600">
            <Sparkles className="h-4 w-4 text-white" />
          </div>
          <span className="text-lg font-bold tracking-tight">
            闪映<span className="brand-text">AI</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => {
            const isActive = pathname.startsWith(link.href);
            return (
              <Button
                key={link.href}
                variant={isActive ? "secondary" : "ghost"}
                size="sm"
                render={<Link href={link.href} className="gap-2" />}
              >
                <link.icon className="h-4 w-4" />
                {link.label}
              </Button>
            );
          })}
        </div>

        {/* Right section */}
        <div className="flex items-center gap-3">
          {user && (
            <div className="hidden sm:flex items-center gap-1.5 text-sm text-muted-foreground">
              <Coins className="h-4 w-4 text-amber-400" />
              <span className="font-medium text-foreground">{user.credits.toLocaleString()}</span>
              <span>积分</span>
            </div>
          )}

          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger
                render={
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white text-xs">
                        {(user.displayName || user.phone || "U").slice(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                }
              />
              <DropdownMenuContent className="w-56" align="end">
                <div className="flex items-center justify-start gap-2 p-2">
                  <div className="flex flex-col space-y-1 leading-none">
                    <p className="font-medium text-sm">{user.displayName || "用户"}</p>
                    <p className="text-xs text-muted-foreground">{user.phone}</p>
                  </div>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => router.push("/profile")}
                  className="cursor-pointer"
                >
                  <User className="mr-2 h-4 w-4" />
                  个人中心
                </DropdownMenuItem>
                {user.role === "admin" && (
                  <DropdownMenuItem
                    onClick={() => router.push("/admin")}
                    className="cursor-pointer"
                  >
                    <Settings className="mr-2 h-4 w-4" />
                    管理后台
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="text-destructive cursor-pointer"
                  onClick={handleSignOut}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  退出登录
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : pathname !== "/login" && pathname !== "/register" ? (
            <Button size="sm" className="brand-gradient text-white" render={<Link href="/login" />}>
              登录
            </Button>
          ) : null}

          {/* Mobile menu */}
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger
              className="md:hidden"
              render={<Button variant="ghost" size="icon"><Menu className="h-5 w-5" /></Button>}
            />
            <SheetContent side="right" className="w-64 pt-12">
              <div className="flex flex-col gap-2">
                {navLinks.map((link) => {
                  const isActive = pathname.startsWith(link.href);
                  return (
                    <Button
                      key={link.href}
                      variant={isActive ? "secondary" : "ghost"}
                      className="justify-start"
                      render={<Link href={link.href} />}
                      onClick={() => setMobileOpen(false)}
                    >
                      <link.icon className="mr-2 h-4 w-4" />
                      {link.label}
                    </Button>
                  );
                })}
                <div className="mt-2 border-t border-border pt-4">
                  {user ? (
                    <Button
                      variant="ghost"
                      className="justify-start w-full text-destructive"
                      onClick={() => {
                        setMobileOpen(false);
                        handleSignOut();
                      }}
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      退出登录
                    </Button>
                  ) : (
                    <Button
                      className="w-full brand-gradient text-white"
                      render={<Link href="/login" />}
                      onClick={() => setMobileOpen(false)}
                    >
                      登录
                    </Button>
                  )}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
}
