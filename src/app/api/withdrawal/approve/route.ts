import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { sendWithdrawalStatusEmail } from "@/lib/email";

export const runtime = "nodejs";

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const withdrawalId = url.searchParams.get('withdrawalId');
    const action = url.searchParams.get('action');
    const adminEmail = url.searchParams.get('adminEmail');

    if (!withdrawalId || !action) {
      return NextResponse.json(
        { success: false, message: "Missing required parameters: withdrawalId and action" },
        { status: 400 }
      );
    }

    // Admin email check
    const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
    if (!ADMIN_EMAIL || adminEmail !== ADMIN_EMAIL) {
      return NextResponse.json(
        { success: false, message: "Unauthorized: Admin access required" },
        { status: 403 }
      );
    }

    // Validate withdrawalId is a valid number
    const id = parseInt(withdrawalId);
    if (isNaN(id)) {
      return NextResponse.json(
        { success: false, message: "Invalid withdrawal ID" },
        { status: 400 }
      );
    }

    let newStatus: "Completed" | "Rejected";
    if (action === 'approve') {
      newStatus = 'Completed';
    } else if (action === 'reject') {
      newStatus = 'Rejected';
    } else {
      return NextResponse.json(
        { success: false, message: "Invalid action. Must be 'approve' or 'reject'" },
        { status: 400 }
      );
    }

    // Find the withdrawal
    const withdrawal = await prisma.withdrawal.findUnique({
      where: { id: id },
      include: { user: true },
    });

    if (!withdrawal) {
      return NextResponse.json(
        { success: false, message: "Withdrawal not found" },
        { status: 404 }
      );
    }

    // Ensure this withdrawal is pending before updating
    if (withdrawal.status !== "Pending") {
      return NextResponse.json(
        { success: false, message: "Withdrawal is not in a pending state" },
        { status: 400 }
      );
    }

    // Run updates atomically
    await prisma.$transaction(async (tx) => {
      // Update withdrawal status
      await tx.withdrawal.update({
        where: { id: id },
        data: { status: newStatus },
      });

      // Update transaction status
      await tx.transaction.updateMany({
        where: {
          userId: withdrawal.userId,
          type: "withdraw",
          status: "Pending",
        },
        data: { status: newStatus === "Completed" ? "Success" : "Failed" },
      });

      // Handle balance updates
      if (newStatus === "Completed") {
        // Deduct balance and update totals
        await tx.user.update({
          where: { id: withdrawal.userId },
          data: {
            mainBalance: { decrement: withdrawal.amount },
            totalWithdrawals: { increment: withdrawal.amount },
          },
        });
        console.log(`Withdrawal ${id} completed for user ${withdrawal.user.email}`);
      } else {
        // For rejected withdrawals, no balance changes needed since balance wasn't deducted
        console.log(`Withdrawal ${id} rejected for user ${withdrawal.user.email}`);
      }
    });

    // Send notification email using email lib
    try {
      await sendWithdrawalStatusEmail({
        userEmail: withdrawal.user.email,
        amount: withdrawal.amount,
        status: newStatus,
      });
      console.log("Withdrawal status email sent to user");
    } catch (emailError) {
      console.error("Failed to send withdrawal status email:", emailError);
      // Don't fail the approval process if email fails
    }

    return NextResponse.json(
      { success: true, message: `Withdrawal ${newStatus.toLowerCase()}` },
      { status: 200 }
    );
  } catch (error) {
    console.error("Withdrawal approval error:", error);
    return NextResponse.json(
      { success: false, message: "Withdrawal approval failed" },
      { status: 500 }
    );
  }
}

export const dynamic = "force-dynamic";
