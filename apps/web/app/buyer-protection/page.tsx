import { ShieldCheck, Truck, RotateCcw, Handshake } from "lucide-react";
import Link from "next/link";

export default function BuyerProtectionPage() {
  return (
    <div className="min-h-screen bg-transparent">
      <div className="bg-[#111827] text-white py-24 text-center relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-600/20 rounded-full blur-3xl -z-10" />
        <div className="max-w-4xl mx-auto px-6 relative z-10">
          <ShieldCheck className="w-24 h-24 text-blue-500 mx-auto mb-6" />
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter mb-6">TixProtect Guarantee</h1>
          <p className="text-xl md:text-2xl opacity-90 max-w-2xl mx-auto">
            100% Buyer Protection. Every transaction. Every time.
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className="flex gap-6">
            <div className="w-16 h-16 shrink-0 bg-blue-500/10 text-blue-600 rounded-full flex items-center justify-center"><Handshake className="w-8 h-8" /></div>
            <div>
              <h3 className="text-2xl font-bold mb-3">Valid Tickets Guaranteed</h3>
              <p className="text-muted-foreground leading-relaxed">
                Every ticket sold on Ticket Universe is cryptographically verified before it reaches your inbox. If you are denied entry to the stadium due to an invalid ticket, we will refund you 120% of your purchase price.
              </p>
            </div>
          </div>
          <div className="flex gap-6">
            <div className="w-16 h-16 shrink-0 bg-blue-500/10 text-blue-600 rounded-full flex items-center justify-center"><Truck className="w-8 h-8" /></div>
            <div>
              <h3 className="text-2xl font-bold mb-3">On-Time Delivery</h3>
              <p className="text-muted-foreground leading-relaxed">
                Tickets are delivered instantly via email. If a seller fails to transfer the ticket on time, we will step in and source replacement tickets of equal or better value at no extra cost to you.
              </p>
            </div>
          </div>
          <div className="flex gap-6">
            <div className="w-16 h-16 shrink-0 bg-blue-500/10 text-blue-600 rounded-full flex items-center justify-center"><RotateCcw className="w-8 h-8" /></div>
            <div>
              <h3 className="text-2xl font-bold mb-3">Cancellations & Reschedules</h3>
              <p className="text-muted-foreground leading-relaxed">
                If a match is cancelled and not rescheduled, you will receive a full refund. If a match is rescheduled, your tickets will remain valid for the new date, or you can opt for a refund.
              </p>
            </div>
          </div>
          <div className="flex gap-6">
            <div className="w-16 h-16 shrink-0 bg-blue-500/10 text-blue-600 rounded-full flex items-center justify-center"><ShieldCheck className="w-8 h-8" /></div>
            <div>
              <h3 className="text-2xl font-bold mb-3">Secure Payments</h3>
              <p className="text-muted-foreground leading-relaxed">
                Your payment data is fully encrypted and never shared with the seller. We hold the seller's payout in escrow until after the match has successfully taken place.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-20 bg-muted border border-border p-12 rounded-3xl text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to secure your seat?</h2>
          <Link href="/matches" className="bg-primary text-primary-foreground px-8 py-4 rounded-xl font-bold hover:bg-primary/90 transition-colors inline-block shadow-lg">Find Tickets</Link>
        </div>
      </div>
    </div>
  );
}
