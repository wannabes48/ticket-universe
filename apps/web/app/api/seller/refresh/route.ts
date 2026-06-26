import { NextResponse } from "next/server";

export async function GET() {
  // If the user's Stripe onboarding link expired, Stripe redirects them here to generate a new one.
  // We can just redirect them back to the seller dashboard where they can click "Connect" again.
  return NextResponse.redirect(new URL("/seller/dashboard?refresh=true", process.env.NEXTAUTH_URL || "http://localhost:3000"));
}
