import jwt from "jsonwebtoken";
import { User } from "../entities/user.entity";
import { config } from "dotenv";

config();

const JWT_SECRET = process.env.JWT_SECRET ?? "defaultSecret";
const ACCESS_TOKEN_EXPIRY = "15m";
const REFRESH_TOKEN_EXPIRY = "7d";

export const generateAccessToken = (user: User) => {
  return jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET, {
    expiresIn: ACCESS_TOKEN_EXPIRY,
  });
};

export const generateRefreshToken = (user: User) => {
  return jwt.sign({ userId: user.id }, JWT_SECRET, {
    expiresIn: REFRESH_TOKEN_EXPIRY,
  });
};

export const verifyToken = (token: string) => {
  return jwt.verify(token, JWT_SECRET);
};
