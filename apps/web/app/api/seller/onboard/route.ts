import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@ticketuniverse/database";
import Stripe from "stripe";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!process.env.STRIPE_SECRET_KEY) {
      throw new Error("Stripe secret key is missing");
    }

    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: "2026-06-24.dahlia",
    });

    // Get user from DB
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    let accountId = user.stripeConnectId;

    // Create a new Express account if they don't have one
    if (!accountId) {
      const account = await stripe.accounts.create({
        type: "express",
        email: user.email || undefined,
        capabilities: {
          transfers: { requested: true },
        },
      });
      accountId = account.id;

      // Save to user profile
      await prisma.user.update({
        where: { id: user.id },
        data: { stripeConnectId: accountId },
      });
    }

    // Create account link for onboarding
    const origin = process.env.NEXTAUTH_URL || "http://localhost:3000";
    
    const accountLink = await stripe.accountLinks.create({
      account: accountId,
      refresh_url: `${origin}/api/seller/refresh`,
      return_url: `${origin}/api/seller/return`,
      type: "account_onboarding",
    });

    return NextResponse.json({ url: accountLink.url });
  } catch (error: any) {
    console.error("Stripe Onboard Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
