import Link from "next/link";
import { Banknote, ShieldCheck, Ticket } from "lucide-react";

export default function SellLandingPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="bg-[#111827] text-white py-24 text-center">
        <div className="max-w-4xl mx-auto px-6">
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter mb-6">Sell Your Spare Tickets</h1>
          <p className="text-xl md:text-2xl opacity-90 mb-10 max-w-2xl mx-auto">
            List for free. Reach millions of fans. Get paid straight to your bank account via Stripe.
          </p>
          <Link href="/sell/list" className="bg-primary text-primary-foreground px-8 py-4 rounded-xl font-bold text-lg hover:bg-primary/90 transition-colors inline-block shadow-lg">
            List Your Tickets Now
          </Link>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-24">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          <div className="text-center">
            <div className="w-20 h-20 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-6"><Ticket className="w-10 h-10" /></div>
            <h3 className="text-2xl font-bold mb-4">Zero Listing Fees</h3>
            <p className="text-muted-foreground leading-relaxed">It's completely free to list your tickets on Ticket Universe. You set your own price, and we only take a small commission when your tickets actually sell.</p>
          </div>
          <div className="text-center">
            <div className="w-20 h-20 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-6"><ShieldCheck className="w-10 h-10" /></div>
            <h3 className="text-2xl font-bold mb-4">Secure & Anonymous</h3>
            <p className="text-muted-foreground leading-relaxed">We handle the entire transaction. You never have to communicate directly with the buyer, and your personal information is kept strictly confidential.</p>
          </div>
          <div className="text-center">
            <div className="w-20 h-20 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-6"><Banknote className="w-10 h-10" /></div>
            <h3 className="text-2xl font-bold mb-4">Guaranteed Payouts</h3>
            <p className="text-muted-foreground leading-relaxed">Through our partnership with Stripe Connect, your funds are deposited directly into your linked bank account within 48 hours of the match taking place.</p>
          </div>
        </div>
      </div>
    </div>
  );
}