import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { AuthUser, SignupData, LoginCredentials } from '@/types';
import { createUserAccount, getUserByEmail } from './cosmic';

const JWT_SECRET = process.env.JWT_SECRET as string;

export async function hashPassword(password: string): Promise<string> {
  return await bcrypt.hash(password, 10);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return await bcrypt.compare(password, hash);
}

export function generateToken(user: AuthUser): string {
  return jwt.sign(user, JWT_SECRET, { expiresIn: '7d' });
}

export function verifyToken(token: string): AuthUser | null {
  try {
    return jwt.verify(token, JWT_SECRET) as AuthUser;
  } catch (error) {
    return null;
  }
}

export async function signup(data: SignupData) {
  // Check if user already exists
  const existingUser = await getUserByEmail(data.email);
  if (existingUser) {
    throw new Error('User already exists with this email');
  }

  // Hash password
  const passwordHash = await hashPassword(data.password);

  // Create user account
  const userAccount = await createUserAccount({
    email: data.email,
    passwordHash,
    accountType: data.accountType
  });

  // Generate JWT token
  const authUser: AuthUser = {
    id: userAccount.id,
    email: userAccount.metadata.email,
    accountType: userAccount.metadata.account_type.key,
    profileReference: userAccount.metadata.profile_reference
  };

  const token = generateToken(authUser);

  return { user: authUser, token };
}

export async function login(credentials: LoginCredentials) {
  const user = await getUserByEmail(credentials.email);
  if (!user) {
    throw new Error('User not found');
  }

  const isValidPassword = await verifyPassword(
    credentials.password,
    user.metadata.password_hash
  );

  if (!isValidPassword) {
    throw new Error('Invalid password');
  }

  const authUser: AuthUser = {
    id: user.id,
    email: user.metadata.email,
    accountType: user.metadata.account_type.key,
    profileReference: user.metadata.profile_reference
  };

  const token = generateToken(authUser);

  return { user: authUser, token };
}