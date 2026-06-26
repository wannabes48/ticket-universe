import { NextResponse } from "next/server";
import { prisma } from "@ticketuniverse/database";
import bcrypt from "bcryptjs";

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      if (existingUser.hashedPassword) {
        return NextResponse.json(
          { error: "Email already exists. Please sign in." },
          { status: 400 }
        );
      } else {
        // User exists via Google but has no password. We could link accounts.
        // For simplicity, let's just hash the password and update the user.
        const hashedPassword = await bcrypt.hash(password, 10);
        await prisma.user.update({
          where: { email },
          data: { hashedPassword },
        });
        return NextResponse.json({ message: "Password added to existing account" });
      }
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        email,
        name: email.split('@')[0],
        hashedPassword,
        role: "BUYER",
      },
    });

    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
    });
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
