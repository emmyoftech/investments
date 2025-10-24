import prisma from "@/lib/prisma";
import { AppError } from "@/lib/errorHandler";
import logger from "@/lib/logger";

export class RewardService {
  static async getUserRewards(userEmail: string) {
    const user = await prisma.user.findUnique({
      where: { email: userEmail },
      select: { id: true, rewardPoints: true },
    });

    if (!user) {
      throw new AppError("User not found", 404);
    }

    const ledger = await prisma.rewardLedger.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
    });

    return {
      rewardPoints: user.rewardPoints,
      ledger,
    };
  }

  static async redeemRewards(userEmail: string, pointsToRedeem: number) {
    const user = await prisma.user.findUnique({
      where: { email: userEmail },
      select: { id: true, rewardPoints: true, mainBalance: true },
    });

    if (!user) {
      throw new AppError("User not found", 404);
    }

    if (user.rewardPoints < pointsToRedeem) {
      throw new AppError("Insufficient reward points", 400);
    }

    if (pointsToRedeem < 100) {
      throw new AppError("Minimum redemption is 100 points", 400);
    }

    const cashValue = pointsToRedeem / 100; // 100 points = $1

    // Perform redemption in transaction
    await prisma.$transaction(async (tx) => {
      // Deduct points
      await tx.user.update({
        where: { id: user.id },
        data: { rewardPoints: { decrement: pointsToRedeem } },
      });

      // Add to main balance
      await tx.user.update({
        where: { id: user.id },
        data: { mainBalance: { increment: cashValue } },
      });

      // Log redemption
      await tx.rewardLedger.create({
        data: {
          userId: user.id,
          type: "redeemed",
          points: -pointsToRedeem,
          description: `Redeemed ${pointsToRedeem} points for $${cashValue}`,
        },
      });

      // Create transaction record
      await tx.transaction.create({
        data: {
          userId: user.id,
          type: "Reward Redemption",
          amount: cashValue,
          description: `Redeemed ${pointsToRedeem} reward points`,
          status: "Success",
        },
      });
    });

    logger.info({
      message: "Reward redemption successful",
      userId: user.id,
      pointsRedeemed: pointsToRedeem,
      cashValue,
    });

    return {
      success: true,
      message: `Successfully redeemed ${pointsToRedeem} points for $${cashValue}`,
      cashValue,
    };
  }

  static async awardReferralReward(referredUserId: number, amount: number, type: "deposit" | "investment", depositId?: number) {
    const referredUser = await prisma.user.findUnique({
      where: { id: referredUserId },
      select: { referredById: true },
    });

    if (!referredUser?.referredById) {
      return; // No referrer
    }

    const pointsToAward = type === "deposit" ? 200 : 300;

    // Check if reward already awarded for this deposit
    if (depositId) {
      const existingReward = await prisma.rewardLedger.findFirst({
        where: {
          userId: referredUser.referredById,
          type: "earned",
          refId: depositId,
        },
      });

      if (existingReward) {
        return; // Already awarded for this deposit
      }
    }

    // Award points to referrer
    await prisma.user.update({
      where: { id: referredUser.referredById },
      data: { rewardPoints: { increment: pointsToAward } },
    });

    // Log in reward ledger
    await prisma.rewardLedger.create({
      data: {
        userId: referredUser.referredById,
        type: "earned",
        points: pointsToAward,
        description: `Referral reward for ${type} of $${amount} by referred user`,
        refId: depositId || referredUserId,
      },
    });

    logger.info({
      message: "Referral reward awarded",
      referrerId: referredUser.referredById,
      referredUserId,
      pointsAwarded: pointsToAward,
      type,
      amount,
      depositId,
    });
  }
}
