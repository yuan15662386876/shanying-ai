import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { hashPassword, setAuthCookie } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const { phone, password, displayName } = await request.json();

    if (!phone || !password) {
      return NextResponse.json(
        { error: "请填写手机号和密码" },
        { status: 400 }
      );
    }

    if (!/^1[3-9]\d{9}$/.test(phone)) {
      return NextResponse.json(
        { error: "请输入正确的手机号" },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: "密码至少需要6个字符" },
        { status: 400 }
      );
    }

    const existing = await prisma.user.findUnique({ where: { phone } });
    if (existing) {
      return NextResponse.json(
        { error: "该手机号已注册" },
        { status: 409 }
      );
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

    return NextResponse.json({
      user: {
        id: user.id,
        phone: user.phone,
        displayName: user.displayName,
        role: user.role,
        credits: user.credits,
      },
    });
  } catch (error) {
    console.error("Register error:", error);
    return NextResponse.json({ error: "注册失败" }, { status: 500 });
  }
}
