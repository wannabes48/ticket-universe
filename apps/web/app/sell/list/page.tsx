import { ArrowLeft, Upload, CheckCircle2 } from "lucide-react";
import Link from "next/link";

export default function SellListPage() {
  return (
    <div className="min-h-screen bg-background py-16">
      <div className="max-w-3xl mx-auto px-6">
        <Link href="/sell" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground font-medium mb-8 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back
        </Link>
        
        <h1 className="text-4xl font-black tracking-tighter mb-2">List a Ticket</h1>
        <p className="text-muted-foreground mb-8">Please fill out the details below to list your ticket on the marketplace.</p>

        <div className="bg-card border border-border p-8 rounded-2xl shadow-sm">
          <form className="space-y-6">
            
            <div className="bg-primary/5 border border-primary/20 p-4 rounded-xl flex items-start gap-4 mb-8">
              <CheckCircle2 className="w-6 h-6 text-primary shrink-0" />
              <div>
                <h4 className="font-bold text-primary mb-1">Authenticated as Verified Seller</h4>
                <p className="text-sm text-primary/80">Your Stripe Connect account is linked and ready to receive payouts.</p>
              </div>
            </div>

            <div>
              <label className="text-sm font-bold mb-2 block">Select Match</label>
              <select className="w-full bg-background border border-border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary">
                <option value="">Select a match...</option>
                <option value="1">Match 1 - Mexico vs TBD</option>
                <option value="2">Match 2 - USA vs TBD</option>
                <option value="3">Match 3 - Canada vs TBD</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-bold mb-2 block">Category</label>
                <select className="w-full bg-background border border-border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary">
                  <option value="1">Category 1</option>
                  <option value="2">Category 2</option>
                  <option value="3">Category 3</option>
                  <option value="4">Category 4</option>
                  <option value="vip">Hospitality / VIP</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-bold mb-2 block">Quantity</label>
                <input type="number" min="1" max="10" className="w-full bg-background border border-border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary" defaultValue={1} />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-bold mb-2 block">Block/Section</label>
                <input type="text" className="w-full bg-background border border-border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary" placeholder="e.g. 104" />
              </div>
              <div>
                <label className="text-sm font-bold mb-2 block">Row</label>
                <input type="text" className="w-full bg-background border border-border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary" placeholder="e.g. B" />
              </div>
              <div>
                <label className="text-sm font-bold mb-2 block">Seats</label>
                <input type="text" className="w-full bg-background border border-border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary" placeholder="e.g. 1, 2" />
              </div>
            </div>

            <div>
              <label className="text-sm font-bold mb-2 block">Price per Ticket (USD)</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-muted-foreground">$</span>
                <input type="number" className="w-full bg-background border border-border rounded-lg px-4 py-3 pl-8 focus:outline-none focus:ring-2 focus:ring-primary text-lg font-bold" placeholder="0.00" />
              </div>
              <p className="text-xs text-muted-foreground mt-2">You will receive the full amount entered here. We add a 10% service fee to the buyer's price.</p>
            </div>

            <div>
              <label className="text-sm font-bold mb-2 block">Upload Proof of Purchase</label>
              <div className="border-2 border-dashed border-border rounded-xl p-8 text-center hover:bg-muted/50 transition-colors cursor-pointer">
                <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-4" />
                <p className="font-bold mb-1">Click to upload or drag and drop</p>
                <p className="text-sm text-muted-foreground">PDF or image of confirmation email</p>
              </div>
            </div>

            <button type="button" className="w-full bg-primary text-primary-foreground py-4 rounded-xl font-bold text-lg hover:bg-primary/90 transition-colors">
              Submit Listing for Review
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}