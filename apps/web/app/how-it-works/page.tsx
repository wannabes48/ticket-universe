import Link from "next/link";
import { Search, Ticket, CheckCircle2, ShieldCheck, CreditCard, Banknote } from "lucide-react";

export default function HowItWorksPage() {
  return (
    <div className="min-h-screen bg-transparent">
      <div className="bg-primary text-primary-foreground py-20 text-center">
        <div className="max-w-4xl mx-auto px-6">
          <h1 className="text-4xl md:text-6xl font-black tracking-tighter mb-6">How Ticket Universe Works</h1>
          <p className="text-xl opacity-90">
            A frictionless, secure, and instant marketplace for the 2026 FIFA World Cup. No hidden fees. No account required to buy.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-20">
        <div className="mb-20">
          <h2 className="text-3xl font-bold text-center mb-12">For Buyers (No Account Required)</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-card border border-border p-8 rounded-2xl text-center relative overflow-hidden">
              <div className="absolute top-0 right-0 bg-primary/10 text-primary font-black text-6xl opacity-30 -mr-4 -mt-4">1</div>
              <div className="w-16 h-16 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-6"><Search className="w-8 h-8" /></div>
              <h3 className="text-xl font-bold mb-4">Find Your Match</h3>
              <p className="text-muted-foreground">Browse all 104 matches of the 2026 World Cup. Filter by your favorite team, host city, or exact date.</p>
            </div>
            <div className="bg-card border border-border p-8 rounded-2xl text-center relative overflow-hidden">
              <div className="absolute top-0 right-0 bg-primary/10 text-primary font-black text-6xl opacity-30 -mr-4 -mt-4">2</div>
              <div className="w-16 h-16 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-6"><CreditCard className="w-8 h-8" /></div>
              <h3 className="text-xl font-bold mb-4">Guest Checkout</h3>
              <p className="text-muted-foreground">Select your tickets and proceed to our 5-step guest checkout. Enter your details and pay securely via Stripe.</p>
            </div>
            <div className="bg-card border border-border p-8 rounded-2xl text-center relative overflow-hidden">
              <div className="absolute top-0 right-0 bg-primary/10 text-primary font-black text-6xl opacity-30 -mr-4 -mt-4">3</div>
              <div className="w-16 h-16 bg-green-500/10 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6"><CheckCircle2 className="w-8 h-8" /></div>
              <h3 className="text-xl font-bold mb-4">Instant Delivery</h3>
              <p className="text-muted-foreground">Your e-tickets are instantly transferred to your email. You're ready for the stadium!</p>
            </div>
          </div>
          <div className="text-center mt-12">
            <Link href="/matches" className="bg-primary text-primary-foreground px-8 py-4 rounded-xl font-bold hover:bg-primary/90 transition-colors inline-block shadow-lg">Browse Matches Now</Link>
          </div>
        </div>

        <div className="bg-muted p-12 rounded-3xl border border-border">
          <h2 className="text-3xl font-bold text-center mb-12">For Sellers</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-background border border-border rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm"><Ticket className="w-8 h-8" /></div>
              <h3 className="text-xl font-bold mb-4">1. List for Free</h3>
              <p className="text-muted-foreground">Create an account and list your spare tickets. You set the price.</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-background border border-border rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm"><ShieldCheck className="w-8 h-8" /></div>
              <h3 className="text-xl font-bold mb-4">2. Automatic Transfer</h3>
              <p className="text-muted-foreground">When a buyer purchases, our API instantly transfers the ticket. No manual work required.</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-background border border-border rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm"><Banknote className="w-8 h-8" /></div>
              <h3 className="text-xl font-bold mb-4">3. Get Paid</h3>
              <p className="text-muted-foreground">Funds are sent straight to your bank account via Stripe Connect within 48 hours of the match.</p>
            </div>
          </div>
          <div className="text-center mt-12">
            <Link href="/sell" className="bg-background border border-border text-foreground px-8 py-4 rounded-xl font-bold hover:bg-muted-foreground/10 transition-colors inline-block shadow-sm">Start Selling</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
