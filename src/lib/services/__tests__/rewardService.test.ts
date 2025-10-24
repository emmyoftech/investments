import { RewardService } from "../rewardService";
import prisma from "@/lib/prisma";

// Mock prisma
jest.mock("@/lib/prisma", () => ({
  __esModule: true,
  default: {
    user: {
      findUnique: jest.fn(),
      update: jest.fn(),
    },
    rewardLedger: {
      findFirst: jest.fn(),
      create: jest.fn(),
      findMany: jest.fn(),
    },
    transaction: {
      create: jest.fn(),
    },
    $transaction: jest.fn(),
  },
}));

// Mock logger
jest.mock("@/lib/logger", () => ({
  __esModule: true,
  default: {
    info: jest.fn(),
  },
}));

describe("RewardService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("awardReferralReward", () => {
    it("should award referral reward on first deposit", async () => {
      const mockReferredUser = { referredById: 1 };
      const mockReferrer = { id: 1, rewardPoints: 100 };

      (prisma.user.findUnique as jest.Mock).mockResolvedValue(mockReferredUser);
      (prisma.rewardLedger.findFirst as jest.Mock).mockResolvedValue(null); // No existing reward
      (prisma.user.update as jest.Mock).mockResolvedValue(mockReferrer);
      (prisma.rewardLedger.create as jest.Mock).mockResolvedValue({});

      await RewardService.awardReferralReward(2, 100, "deposit", 10);

      expect(prisma.user.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: { rewardPoints: { increment: 200 } },
      });
      expect(prisma.rewardLedger.create).toHaveBeenCalledWith({
        data: {
          userId: 1,
          type: "earned",
          points: 200,
          description: "Referral reward for deposit of $100 by referred user",
          refId: 10,
        },
      });
    });

    it("should not award duplicate reward for same deposit", async () => {
      const mockReferredUser = { referredById: 1 };
      const mockExistingReward = { id: 1, type: "earned", refId: 10 };

      (prisma.user.findUnique as jest.Mock).mockResolvedValue(mockReferredUser);
      (prisma.rewardLedger.findFirst as jest.Mock).mockResolvedValue(mockExistingReward);

      await RewardService.awardReferralReward(2, 100, "deposit", 10);

      expect(prisma.user.update).not.toHaveBeenCalled();
      expect(prisma.rewardLedger.create).not.toHaveBeenCalled();
    });

    it("should not award if no referrer", async () => {
      (prisma.user.findUnique as jest.Mock).mockResolvedValue({ referredById: null });

      await RewardService.awardReferralReward(2, 100, "deposit", 10);

      expect(prisma.user.update).not.toHaveBeenCalled();
      expect(prisma.rewardLedger.create).not.toHaveBeenCalled();
    });
  });

  describe("redeemRewards", () => {
    it("should redeem rewards successfully", async () => {
      const mockUser = { id: 1, rewardPoints: 500, mainBalance: 100 };
      const mockTx = {
        user: {
          update: jest.fn(),
        },
        rewardLedger: {
          create: jest.fn(),
        },
        transaction: {
          create: jest.fn(),
        },
      };

      (prisma.user.findUnique as jest.Mock).mockResolvedValue(mockUser);
      (prisma.$transaction as jest.Mock).mockImplementation(async (callback) => {
        await callback(mockTx);
      });

      const result = await RewardService.redeemRewards("test@example.com", 200);

      expect(result.success).toBe(true);
      expect(result.cashValue).toBe(2);
      expect(mockTx.user.update).toHaveBeenCalledTimes(2); // Deduct points and add balance
      expect(mockTx.rewardLedger.create).toHaveBeenCalled();
      expect(mockTx.transaction.create).toHaveBeenCalled();
    });

    it("should throw error for insufficient points", async () => {
      const mockUser = { id: 1, rewardPoints: 50 };

      (prisma.user.findUnique as jest.Mock).mockResolvedValue(mockUser);

      await expect(RewardService.redeemRewards("test@example.com", 100)).rejects.toThrow("Insufficient reward points");
    });

    it("should throw error for minimum redemption", async () => {
      const mockUser = { id: 1, rewardPoints: 500 };

      (prisma.user.findUnique as jest.Mock).mockResolvedValue(mockUser);

      await expect(RewardService.redeemRewards("test@example.com", 50)).rejects.toThrow("Minimum redemption is 100 points");
    });
  });

  describe("getUserRewards", () => {
    it("should return user rewards and ledger", async () => {
      const mockUser = { id: 1, rewardPoints: 300 };
      const mockLedger = [{ id: 1, type: "earned", points: 200 }];

      (prisma.user.findUnique as jest.Mock).mockResolvedValue(mockUser);
      (prisma.rewardLedger.findMany as jest.Mock).mockResolvedValue(mockLedger);

      const result = await RewardService.getUserRewards("test@example.com");

      expect(result.rewardPoints).toBe(300);
      expect(result.ledger).toEqual(mockLedger);
    });

    it("should throw error for non-existent user", async () => {
      (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);

      await expect(RewardService.getUserRewards("test@example.com")).rejects.toThrow("User not found");
    });
  });
});
