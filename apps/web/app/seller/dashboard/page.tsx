import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@ticketuniverse/database";
import { redirect } from "next/navigation";
import Stripe from "stripe";
import Link from "next/link";
import { PlusCircle, ExternalLink, Activity, DollarSign, CheckCircle2 } from "lucide-react";

export default async function SellerDashboard() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    redirect("/api/auth/signin?callbackUrl=/seller/dashboard");
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: {
      listings: {
        include: {
          match: {
            include: { homeTeam: true, awayTeam: true }
          },
          orders: true
        },
        orderBy: { id: 'desc' }
      }
    }
  });

  if (!user) redirect("/");

  let isStripeConnected = false;
  let hasPendingRequirements = false;

  if (user.stripeConnectId && process.env.STRIPE_SECRET_KEY) {
    try {
      const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: "2026-06-24.dahlia" });
      const account = await stripe.accounts.retrieve(user.stripeConnectId);
      isStripeConnected = account.details_submitted;
      hasPendingRequirements = (account.requirements?.currently_due?.length ?? 0) > 0;
    } catch (err) {
      console.error("Failed to fetch Stripe account", err);
    }
  }

  // Calculate some stats
  const activeListingsCount = user.listings.filter(l => l.status === 'ACTIVE').length;
  let totalSales = 0;
  
  user.listings.forEach(listing => {
    listing.orders.forEach(order => {
      if (['PAID', 'DELIVERED', 'COMPLETED'].includes(order.status)) {
        totalSales += order.total;
      }
    });
  });

  return (
    <main className="min-h-screen bg-muted/30 pt-24 pb-12">
      <div className="container max-w-6xl mx-auto px-4">
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-4xl font-black tracking-tighter mb-2">Seller Dashboard</h1>
            <p className="text-muted-foreground">Manage your listings, fulfill orders, and track payouts.</p>
          </div>
          <Link href="/sell/list" className="bg-primary text-primary-foreground px-6 py-3 rounded-xl font-bold hover:bg-primary/90 transition-colors flex items-center gap-2">
            <PlusCircle className="w-5 h-5" />
            Create Listing
          </Link>
        </div>

        {/* Onboarding Alert */}
        {(!isStripeConnected || hasPendingRequirements) && (
          <div className="bg-amber-500/10 border border-amber-500/20 p-6 rounded-2xl mb-8 flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="font-bold text-amber-600 dark:text-amber-400 text-lg mb-1">
                {user.stripeConnectId ? "Action Required: Complete Payout Setup" : "Set Up Payouts to Start Selling"}
              </h3>
              <p className="text-muted-foreground text-sm">
                You must link a bank account and complete identity verification before your listings can go live.
              </p>
            </div>
            <form action="/api/seller/onboard" method="POST">
              <button type="submit" className="bg-amber-500 text-white px-6 py-3 rounded-xl font-bold whitespace-nowrap shadow-sm hover:bg-amber-600 transition-colors">
                Complete Setup with Stripe
              </button>
            </form>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-card border border-border p-6 rounded-2xl shadow-sm">
            <div className="flex items-center gap-3 mb-2 text-muted-foreground">
              <Activity className="w-5 h-5" />
              <h3 className="font-semibold">Active Listings</h3>
            </div>
            <p className="text-4xl font-black">{activeListingsCount}</p>
          </div>
          <div className="bg-card border border-border p-6 rounded-2xl shadow-sm">
            <div className="flex items-center gap-3 mb-2 text-muted-foreground">
              <CheckCircle2 className="w-5 h-5" />
              <h3 className="font-semibold">Tickets Sold</h3>
            </div>
            <p className="text-4xl font-black">
              {user.listings.reduce((acc, l) => acc + l.orders.filter(o => o.status !== 'PENDING' && o.status !== 'FAILED' && o.status !== 'CANCELLED').length, 0)}
            </p>
          </div>
          <div className="bg-card border border-border p-6 rounded-2xl shadow-sm">
            <div className="flex items-center gap-3 mb-2 text-muted-foreground">
              <DollarSign className="w-5 h-5" />
              <h3 className="font-semibold">Total Revenue</h3>
            </div>
            <p className="text-4xl font-black">${totalSales.toFixed(2)}</p>
          </div>
        </div>

        <div className="bg-card border border-border rounded-2xl shadow-sm overflow-hidden">
          <div className="p-6 border-b border-border">
            <h3 className="font-bold text-xl">Your Listings & Orders</h3>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-muted/50 text-sm text-muted-foreground border-b border-border">
                  <th className="p-4 font-semibold">Match</th>
                  <th className="p-4 font-semibold">Category/Seat</th>
                  <th className="p-4 font-semibold">Qty</th>
                  <th className="p-4 font-semibold">Price</th>
                  <th className="p-4 font-semibold">Status</th>
                  <th className="p-4 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {user.listings.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-8 text-center text-muted-foreground">
                      No listings found. Create one to get started!
                    </td>
                  </tr>
                ) : (
                  user.listings.map((listing) => (
                    <tr key={listing.id} className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
                      <td className="p-4">
                        <p className="font-bold">{listing.match.homeTeam?.name} vs {listing.match.awayTeam?.name}</p>
                        <p className="text-xs text-muted-foreground">ID: {listing.id.substring(0,8)}</p>
                      </td>
                      <td className="p-4">
                        <p className="font-medium">{listing.category}</p>
                        <p className="text-xs text-muted-foreground">Sec {listing.section || 'N/A'}, Row {listing.row || 'N/A'}</p>
                      </td>
                      <td className="p-4 font-mono">{listing.quantity}</td>
                      <td className="p-4 font-medium">${listing.pricePerTicket.toFixed(2)}</td>
                      <td className="p-4">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wide
                          ${listing.status === 'ACTIVE' ? 'bg-green-500/10 text-green-600 dark:text-green-400' : 
                            listing.status === 'SOLD' ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400' : 
                            'bg-muted text-muted-foreground'}`}>
                          {listing.status}
                        </span>
                      </td>
                      <td className="p-4">
                        <button className="text-sm font-semibold text-primary hover:underline flex items-center gap-1">
                          Manage <ExternalLink className="w-3 h-3" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </main>
  );
}
