"use server";

import { prisma } from "@/lib/db";
import { hashPassword, verifyPassword, setAuthCookie, clearAuthCookie } from "@/lib/auth";
import { redirect } from "next/navigation";

export async function signInWithPhone(formData: FormData) {
  const phone = formData.get("phone") as string;
  const password = formData.get("password") as string;

  if (!phone || !password) {
    return { error: "请输入手机号和密码" };
  }

  const user = await prisma.user.findUnique({ where: { phone } });
  if (!user) {
    return { error: "手机号未注册" };
  }

  const valid = await verifyPassword(password, user.passwordHash);
  if (!valid) {
    return { error: "密码错误" };
  }

  await setAuthCookie(user.id);
  redirect("/workspace");
}

export async function signUpWithPhone(formData: FormData) {
  const phone = formData.get("phone") as string;
  const password = formData.get("password") as string;
  const displayName = formData.get("displayName") as string;

  if (!phone || !password) {
    return { error: "请填写手机号和密码" };
  }

  if (!/^1[3-9]\d{9}$/.test(phone)) {
    return { error: "请输入正确的手机号" };
  }

  if (password.length < 6) {
    return { error: "密码至少需要6个字符" };
  }

  const existing = await prisma.user.findUnique({ where: { phone } });
  if (existing) {
    return { error: "该手机号已注册" };
  }

  const passwordHash = await hashPassword(password);

  const user = await prisma.user.create({
    data: {
      phone,
      passwordHash,
      displayName: displayName || `用户${phone.slice(-4)}`,
      credits: 3000,
    },
  });

  // Record initial credit grant
  await prisma.creditTransaction.create({
    data: {
      userId: user.id,
      amount: 3000,
      type: "grant",
      description: "新用户注册赠送",
      balanceAfter: 3000,
    },
  });

  await setAuthCookie(user.id);
  redirect("/workspace");
}

export async function signOut() {
  await clearAuthCookie();
  redirect("/login");
}
