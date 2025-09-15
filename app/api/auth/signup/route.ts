import { NextRequest, NextResponse } from "next/server";
import { signup } from "@/lib/server-auth";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, password, accountType } = body;

    // Validation
    if (!name || !email || !password || !accountType) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: "Password must be at least 6 characters" },
        { status: 400 }
      );
    }

    if (!["content-creator", "product-creator"].includes(accountType)) {
      return NextResponse.json(
        { error: "Invalid account type" },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 }
      );
    }

    const result = await signup({
      name,
      email,
      password,
      accountType,
    });

    return NextResponse.json({
      user: result.user,
      token: result.token,
    });
  } catch (error: any) {
    console.error("Signup API error:", error);

    if (error.message === "User already exists with this email") {
      return NextResponse.json(
        { error: "An account with this email already exists" },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { error: "Failed to create account. Please try again." },
      { status: 500 }
    );
  }
}
