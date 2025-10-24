import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { transactionRateLimit } from "@/lib/rateLimit";

export const runtime = 'nodejs';

// In-memory rate limiting store (for production, use Redis or similar)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

// Rate limiting configuration (matching transactionRateLimit settings)
const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000; // 15 minutes
const RATE_LIMIT_MAX_REQUESTS = 20; // 20 requests per window

// Define the shape of the expected POST body
interface TransactionRequestBody {
  userId: number;
  amount: number;
  paymentMethod: string;
  status?: string;
  type: string;
}

// Define allowed transaction types
const allowedTypes = ["Deposit", "Withdrawal", "Investment", "ROI"];

// GET — fetch all transactions (or by user)
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const userIdParam = searchParams.get("userId");
    
    // Fix 1: Validate userId is a valid number
    const userId = userIdParam && !isNaN(Number(userIdParam)) ? Number(userIdParam) : undefined;

    let transactions;

    if (userId) {
      // Fetch transactions for a specific user
      transactions = await prisma.transaction.findMany({
        where: { userId },
        orderBy: { createdAt: "desc" },
      });
    } else {
      // Fetch all transactions (for admin)
      transactions = await prisma.transaction.findMany({
        orderBy: { createdAt: "desc" },
      });
    }

    return NextResponse.json({ success: true, transactions }, { status: 200 });
  } catch (error) {
    console.error("Transaction fetch error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch transactions" },
      { status: 500 }
    );
  }
}

// POST — create new transaction
export async function POST(req: Request) {
  try {
    // Get client IP for rate limiting
    const clientIP = req.headers.get('x-forwarded-for')?.split(',')[0] ||
                     req.headers.get('x-real-ip') ||
                     'unknown';

    // Check rate limit
    const now = Date.now();
    const existingEntry = rateLimitStore.get(clientIP);

    if (existingEntry) {
      if (now > existingEntry.resetTime) {
        // Reset window
        rateLimitStore.set(clientIP, { count: 1, resetTime: now + RATE_LIMIT_WINDOW_MS });
      } else if (existingEntry.count >= RATE_LIMIT_MAX_REQUESTS) {
        return NextResponse.json(
          { success: false, message: 'Too many transaction requests, please try again later.' },
          { status: 429 }
        );
      } else {
        existingEntry.count++;
      }
    } else {
      rateLimitStore.set(clientIP, { count: 1, resetTime: now + RATE_LIMIT_WINDOW_MS });
    }

    // Explicitly type the body
    const data: TransactionRequestBody = await req.json();
    const { userId, amount, paymentMethod, status, type } = data;

    // Validate required fields
    if (!userId || !amount || !paymentMethod || !type) {
      return NextResponse.json(
        { success: false, message: "Missing required fields: userId, amount, paymentMethod, and type are required" },
        { status: 400 }
      );
    }

    // Validate userId is a positive integer
    if (!Number.isInteger(userId) || userId <= 0) {
      return NextResponse.json(
        { success: false, message: "userId must be a positive integer" },
        { status: 400 }
      );
    }

    // Fix 2: Validate amount is positive and reasonable
    if (amount <= 0 || amount > 1000000) {
      return NextResponse.json(
        { success: false, message: "Amount must be positive and less than $1,000,000" },
        { status: 400 }
      );
    }

    // Fix 3: Validate transaction type
    if (!allowedTypes.includes(type)) {
      return NextResponse.json(
        { success: false, message: `Invalid transaction type. Allowed types: ${allowedTypes.join(", ")}` },
        { status: 400 }
      );
    }

    // Validate paymentMethod is not empty and reasonable length
    if (typeof paymentMethod !== 'string' || paymentMethod.trim().length === 0 || paymentMethod.length > 50) {
      return NextResponse.json(
        { success: false, message: "paymentMethod must be a non-empty string with maximum 50 characters" },
        { status: 400 }
      );
    }

    // Fix 4: Use Prisma transaction to prevent race conditions
    const result = await prisma.$transaction(async (tx) => {
      // For withdrawals, check if user has sufficient balance
      if (type === "Withdrawal") {
        const user = await tx.user.findUnique({
          where: { id: userId },
          select: { mainBalance: true }
        });

        if (!user) {
          throw new Error("User not found");
        }

        if (user.mainBalance < amount) {
          throw new Error("Insufficient balance");
        }

        // Update user balance for withdrawals
        await tx.user.update({
          where: { id: userId },
          data: { mainBalance: { decrement: amount } }
        });
      } else if (type === "Deposit") {
        // Update user balance for deposits
        await tx.user.update({
          where: { id: userId },
          data: { mainBalance: { increment: amount } }
        });
      }

      // Create the transaction
      const transaction = await tx.transaction.create({
        data: {
          userId,
          amount,
          paymentMethod,
          status: status || "Pending",
          type,
          createdAt: new Date(),
        },
      });

      return transaction;
    });

    return NextResponse.json({ success: true, transaction: result }, { status: 201 });
  } catch (error) {
    console.error("Transaction creation error:", error);
    
    // Handle specific error messages from transaction
    if (error instanceof Error) {
      if (error.message === "User not found") {
        return NextResponse.json(
          { success: false, message: "User not found" },
          { status: 404 }
        );
      }
      if (error.message === "Insufficient balance") {
        return NextResponse.json(
          { success: false, message: "Insufficient balance for withdrawal" },
          { status: 400 }
        );
      }
    }

    return NextResponse.json(
      { success: false, message: "Failed to create transaction" },
      { status: 500 }
    );
  }
}

export const dynamic = "force-dynamic";