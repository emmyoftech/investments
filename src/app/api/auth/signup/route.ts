import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcrypt";
import { authRateLimit } from "@/lib/rateLimit";
import { randomBytes } from "crypto";

// POST /api/auth/signup

export const runtime = 'nodejs';

// Define the shape of the expected request body
interface SignupRequestBody {
  firstName: string;
  lastName: string;
  email: string;
  username: string;
  password: string;
  phone?: string;
  referralCode?: string;
}

export async function POST(req: Request) {
  try {
    // Explicitly type the parsed JSON body
    const data: SignupRequestBody = await req.json();
    const { firstName, lastName, email, username, password, phone, referralCode } = data;

    // Validate required fields
    if (!firstName || !lastName || !email || !username || !password) {
      return NextResponse.json(
        { error: "All required fields must be filled" },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existing = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (existing) {
      return NextResponse.json(
        { error: "User with this email already exists" },
        { status: 409 }
      );
    }

    // Handle referral if provided
    let referredById: number | null = null;
    if (referralCode) {
      const referrer = await prisma.referral.findUnique({
        where: { code: referralCode },
        include: { user: true },
      });
      if (referrer) {
        referredById = referrer.userId;
      }
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user with hashed password
    const newUser = await prisma.user.create({
      data: {
        firstName,
        lastName,
        username,
        email: email.toLowerCase(),
        password: hashedPassword,
        phone: phone || null,
        mainBalance: 0,
        investmentBalance: 0,
        totalEarn: 0,
        totalDeposit: 0,
        roi: 0,
        redeemedRoi: 0,
        speedInvest: 0,
        completed: 0,
        referredById,
      },
    });

    // Generate unique referral code for the new user
    const referralCodeGenerated = randomBytes(4).toString('hex').toUpperCase();
    await prisma.referral.create({
      data: {
        userId: newUser.id,
        code: referralCodeGenerated,
      },
    });

    // Return a sanitized response (don’t expose password)
    return NextResponse.json({
      message: "Signup successful",
      user: {
        id: newUser.id,
        email: newUser.email,
        username: newUser.username,
        mainBalance: newUser.mainBalance,
        totalDeposit: newUser.totalDeposit,
        referralCode: referralCodeGenerated,
      },
    });
  } catch (err: any) {
    console.error("Signup error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export const dynamic = "force-dynamic";
