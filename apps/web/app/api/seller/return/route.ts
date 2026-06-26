import { NextResponse } from "next/server";

export async function GET() {
  // If the user is redirected here, it means they completed the Stripe onboarding flow (or skipped it).
  // Redirect them to their dashboard. 
  // Optionally, we could verify their stripe account status here before redirecting.
  return NextResponse.redirect(new URL("/seller/dashboard", process.env.NEXTAUTH_URL || "http://localhost:3000"));
}
