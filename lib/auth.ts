import jwt from "jsonwebtoken";
import { AuthUser } from "@/types";

const JWT_SECRET = process.env.NEXT_PUBLIC_JWT_SECRET as string;

export function verifyToken(token: string): AuthUser | null {
  try {
    return jwt.verify(token, JWT_SECRET) as AuthUser;
  } catch (error) {
    return null;
  }
}
