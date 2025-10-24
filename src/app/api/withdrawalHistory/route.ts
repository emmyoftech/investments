import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const email = searchParams.get("user");

    if (!email)
      return NextResponse.json(
        { success: false, message: "Email is required" },
        { status: 400 }
      );

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user)
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );

    const withdrawals = await prisma.withdrawal.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
    });

    const pendingWithdrawals = withdrawals.filter(
      (w) => w.status === "Pending"
    );
    const withdrawalHistory = withdrawals.filter(
      (w) => w.status !== "Pending"
    );

    return NextResponse.json({
      success: true,
      pendingWithdrawals,
      withdrawalHistory,
    });
  } catch (error) {
    console.error("History fetch error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch history" },
      { status: 500 }
    );
  }
}
