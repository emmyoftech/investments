import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const email = searchParams.get("email");
  const id = searchParams.get("id");

  // Require either email or id parameter
  if (!email && !id) {
    return NextResponse.json({ success: false, message: "Email or id parameter required" }, { status: 400 });
  }

  if (email) {
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        username: true,
        mainBalance: true,
        investmentBalance: true,
        totalEarn: true,
        totalDeposit: true,
        totalWithdrawals: true,
        roi: true,
        redeemedRoi: true,
        speedInvest: true,
        completed: true,
        phone: true,
        createdAt: true,
      },
    });

    if (!user) {
      return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, user });
  } else if (id) {
    const userId = parseInt(id);
    if (isNaN(userId)) {
      return NextResponse.json({ success: false, message: "Invalid user id" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        username: true,
        mainBalance: true,
        investmentBalance: true,
        totalEarn: true,
        totalDeposit: true,
        totalWithdrawals: true,
        roi: true,
        redeemedRoi: true,
        speedInvest: true,
        completed: true,
        phone: true,
        createdAt: true,
      },
    });

    if (!user) {
      return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, user });
  }
}
