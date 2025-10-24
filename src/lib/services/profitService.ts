import prisma from "@/lib/prisma";
import { AppError } from "@/lib/errorHandler";
import logger from "@/lib/logger";

/**
 * Profit Calculation Service
 *
 * Deterministic Profit Formula:
 * - Daily ROI Accrual: (investmentAmount * roiRate / 100) / 365
 * - This ensures consistent, reproducible profits based on investment amount and ROI rate
 * - Profits are accrued daily for active investments
 * - Total Earn = sum of all accrued profits
 */
export class ProfitService {
  /**
   * Accrue profits for all active investments
   * This method is idempotent and can be run multiple times safely
   */
  static async accrueProfitsForAllUsers() {
    const activeInvestments = await prisma.investment.findMany({
      where: {
        status: "Active",
        endDate: { gt: new Date() }, // Only active investments not yet matured
      },
      include: { user: true },
    });

    const today = new Date();
    today.setHours(0, 0, 0, 0); // Start of day

    for (const investment of activeInvestments) {
      try {
        await this.accrueProfitForInvestment(investment, today);
      } catch (error) {
        logger.error({
          message: "Failed to accrue profit for investment",
          investmentId: investment.id,
          userId: investment.userId,
          error: error instanceof Error ? error.message : "Unknown error",
        });
      }
    }

    logger.info({
      message: "Profit accrual completed for all active investments",
      investmentCount: activeInvestments.length,
    });
  }

  /**
   * Accrue profit for a specific investment on a given date
   * Formula: dailyProfit = (amount * roi / 100) / 365
   */
  static async accrueProfitForInvestment(investment: any, accrualDate: Date) {
    // Check if profit already accrued for this date
    const existingAccrual = await prisma.transaction.findFirst({
      where: {
        userId: investment.userId,
        type: "roi",
        description: {
          contains: `Investment #${investment.id} - ${accrualDate.toISOString().split('T')[0]}`,
        },
      },
    });

    if (existingAccrual) {
      return; // Already accrued
    }

    // Calculate daily profit
    const dailyProfit = (investment.amount * investment.roi / 100) / 365;

    if (dailyProfit <= 0) {
      return; // No profit to accrue
    }

    // Accrue profit atomically
    await prisma.$transaction(async (tx) => {
      // Update user's totalEarn and mainBalance
      await tx.user.update({
        where: { id: investment.userId },
        data: {
          totalEarn: { increment: dailyProfit },
          mainBalance: { increment: dailyProfit },
        },
      });

      // Record the profit transaction
      await tx.transaction.create({
        data: {
          userId: investment.userId,
          type: "roi",
          amount: dailyProfit,
          description: `Daily ROI for Investment #${investment.id} - ${accrualDate.toISOString().split('T')[0]}`,
          status: "Success",
        },
      });
    });

    logger.info({
      message: "Profit accrued for investment",
      investmentId: investment.id,
      userId: investment.userId,
      dailyProfit,
      accrualDate: accrualDate.toISOString().split('T')[0],
    });
  }

  /**
   * Get total earned profits for a user
   */
  static async getUserTotalEarn(userId: number): Promise<number> {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { totalEarn: true },
    });

    if (!user) {
      throw new AppError("User not found", 404);
    }

    return user.totalEarn;
  }

  /**
   * Calculate potential profit for an investment (preview)
   */
  static calculatePotentialProfit(amount: number, roi: number, days: number): number {
    const dailyProfit = (amount * roi / 100) / 365;
    return dailyProfit * days;
  }
}
