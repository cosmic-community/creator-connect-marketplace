import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { AuthUser, SignupData, LoginCredentials } from "@/types";
import { createUserAccount, getUserByEmail } from "./cosmic";
import { sendVerificationEmail } from "./email";

const JWT_SECRET = process.env.JWT_SECRET as string;

export async function hashPassword(password: string): Promise<string> {
  return await bcrypt.hash(password, 10);
}

export async function verifyPassword(
  password: string,
  hash: string
): Promise<boolean> {
  return await bcrypt.compare(password, hash);
}

export function generateToken(user: AuthUser): string {
  return jwt.sign(user, JWT_SECRET, { expiresIn: "7d" });
}

export async function signup(data: SignupData) {
  try {
    // Check if user already exists
    const existingUser = await getUserByEmail(data.email);
    if (existingUser) {
      throw new Error("User already exists with this email");
    }

    // Hash password
    const passwordHash = await hashPassword(data.password);

    // Generate email verification token using Web Crypto API
    const verificationToken = globalThis.crypto.randomUUID();

    // Create user account
    const userAccount = await createUserAccount({
      email: data.email,
      passwordHash,
      accountType: data.accountType,
      verificationToken,
    });

    // Send verification email before returning success
    try {
      await sendVerificationEmail(data.email, verificationToken);
    } catch (emailError) {
      console.error("Failed to send verification email:", emailError);
      // Don't fail signup if email fails, but log the error
    }

    // Generate JWT token with proper type handling
    const authUser: AuthUser = {
      id: userAccount.id,
      email: userAccount.metadata.email,
      accountType: userAccount.metadata.account_type.key,
      profileReference: userAccount.metadata.profile_reference || "",
    };

    const token = generateToken(authUser);

    return { user: authUser, token };
  } catch (error) {
    console.error("Signup error:", error);
    throw error;
  }
}

export async function login(credentials: LoginCredentials) {
  try {
    const user = await getUserByEmail(credentials.email);
    if (!user) {
      throw new Error("User not found");
    }

    const isValidPassword = await verifyPassword(
      credentials.password,
      user.metadata.password_hash
    );

    if (!isValidPassword) {
      throw new Error("Invalid password");
    }

    const authUser: AuthUser = {
      id: user.id,
      email: user.metadata.email,
      accountType: user.metadata.account_type.key,
      profileReference: user.metadata.profile_reference || "",
    };

    const token = generateToken(authUser);

    return { user: authUser, token };
  } catch (error) {
    console.error("Login error:", error);
    throw error;
  }
}
