import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { prisma } from "@ticketuniverse/database";
import { SellForm } from "./sell-form";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import Stripe from "stripe";
import { redirect } from "next/navigation";

export default async function SellListPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    redirect("/api/auth/signin?callbackUrl=/sell/list");
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email }
  });

  if (!user) redirect("/");

  const matches = await prisma.match.findMany({
    include: {
      homeTeam: true,
      awayTeam: true
    },
    orderBy: { kickoffUtc: 'asc' }
  });

  let isStripeConnected = false;
  if (user.stripeConnectId && process.env.STRIPE_SECRET_KEY) {
    try {
      const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: "2024-04-10" });
      const account = await stripe.accounts.retrieve(user.stripeConnectId);
      isStripeConnected = account.details_submitted && (account.requirements?.currently_due?.length ?? 0) === 0;
    } catch (err) {
      console.error("Failed to check stripe account status on sell list", err);
    }
  }

  return (
    <div className="min-h-screen bg-transparent py-16">
      <div className="max-w-3xl mx-auto px-6">
        <Link href="/sell" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground font-medium mb-8 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back
        </Link>
        
        <h1 className="text-4xl font-black tracking-tighter mb-2">List a Ticket</h1>
        <p className="text-muted-foreground mb-8">Please fill out the details below to list your ticket on the marketplace.</p>

        <div className="bg-card border border-border p-8 rounded-2xl shadow-sm">
          <SellForm matches={matches} isStripeConnected={isStripeConnected} />
        </div>
      </div>
    </div>
  );
}
