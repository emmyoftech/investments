import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { AppError } from "./errorHandler";
import logger from "./logger";

const JWT_SECRET = process.env.JWT_SECRET || "fallback-jwt-secret-change-in-production";
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || "fallback-refresh-secret-change-in-production";
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "1h";
const JWT_REFRESH_EXPIRES_IN = process.env.JWT_REFRESH_EXPIRES_IN || "7d";
const BCRYPT_SALT_ROUNDS = 12; // Confirmed salt rounds

export interface JWTPayload {
  userId: number;
  email: string;
  firstName: string;
  lastName: string;
  username: string;
}

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
}

export class AuthService {
  static async hashPassword(password: string): Promise<string> {
    try {
      const hashedPassword = await bcrypt.hash(password, BCRYPT_SALT_ROUNDS);
      logger.info({ message: "Password hashed successfully", saltRounds: BCRYPT_SALT_ROUNDS });
      return hashedPassword;
    } catch (error) {
      logger.error({ message: "Password hashing failed", error });
      throw new AppError("Password hashing failed", 500);
    }
  }

  static async verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
    try {
      const isValid = await bcrypt.compare(password, hashedPassword);
      logger.info({ message: "Password verification completed", isValid });
      return isValid;
    } catch (error) {
      logger.error({ message: "Password verification failed", error });
      throw new AppError("Password verification failed", 500);
    }
  }

  static generateTokenPair(payload: JWTPayload): TokenPair {
    try {
      const accessToken = jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN as string });
      const refreshToken = jwt.sign({ userId: payload.userId }, JWT_REFRESH_SECRET, {
        expiresIn: JWT_REFRESH_EXPIRES_IN as string,
      });

      logger.info({ message: "Token pair generated", userId: payload.userId, email: payload.email });
      return { accessToken, refreshToken };
    } catch (error) {
      logger.error({ message: "Token generation failed", error, userId: payload.userId });
      throw new AppError("Token generation failed", 500);
    }
  }

  static verifyAccessToken(token: string): JWTPayload {
    try {
      const decoded = jwt.verify(token, JWT_SECRET) as JWTPayload;
      logger.info({ message: "Access token verified", userId: decoded.userId });
      return decoded;
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        logger.warn({ message: "Access token expired", error: error.message });
        throw new AppError("Access token expired", 401);
      }
      if (error instanceof jwt.JsonWebTokenError) {
        logger.warn({ message: "Invalid access token", error: error.message });
        throw new AppError("Invalid access token", 401);
      }
      logger.error({ message: "Access token verification failed", error });
      throw new AppError("Token verification failed", 500);
    }
  }

  static verifyRefreshToken(token: string): { userId: number } {
    try {
      const decoded = jwt.verify(token, JWT_REFRESH_SECRET) as { userId: number };
      logger.info({ message: "Refresh token verified", userId: decoded.userId });
      return decoded;
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        logger.warn({ message: "Refresh token expired", error: error.message });
        throw new AppError("Refresh token expired", 401);
      }
      if (error instanceof jwt.JsonWebTokenError) {
        logger.warn({ message: "Invalid refresh token", error: error.message });
        throw new AppError("Invalid refresh token", 401);
      }
      logger.error({ message: "Refresh token verification failed", error });
      throw new AppError("Token verification failed", 500);
    }
  }

  static refreshAccessToken(refreshToken: string): TokenPair {
    try {
      const { userId } = this.verifyRefreshToken(refreshToken);

      // In a real implementation, you'd fetch user data from DB here
      // For now, we'll create a minimal payload and note that user data should be refreshed
      const payload: JWTPayload = {
        userId,
        email: "", // Would be fetched from DB
        firstName: "",
        lastName: "",
        username: "",
      };

      const tokenPair = this.generateTokenPair(payload);
      logger.info({ message: "Access token refreshed", userId });
      return tokenPair;
    } catch (error) {
      logger.error({ message: "Token refresh failed", error });
      throw error;
    }
  }
}
