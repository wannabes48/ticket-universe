"use client";

import { useState } from "react";
import { createListing } from "./actions";
import { ArrowLeft, Upload, CheckCircle2 } from "lucide-react";
import { useRouter } from "next/navigation";

export function SellForm({ matches, isStripeConnected }: { matches: any[], isStripeConnected: boolean }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    setError(null);
    
    const result = await createListing(formData);
    
    if (result.error) {
      setError(result.error);
      setLoading(false);
    } else {
      router.push("/seller/dashboard");
    }
  }

  return (
    <form action={handleSubmit} className="space-y-6">
      
      {isStripeConnected ? (
        <div className="bg-primary/5 border border-primary/20 p-4 rounded-xl flex items-start gap-4 mb-8">
          <CheckCircle2 className="w-6 h-6 text-primary shrink-0" />
          <div>
            <h4 className="font-bold text-primary mb-1">Authenticated as Verified Seller</h4>
            <p className="text-sm text-primary/80">Your Stripe Connect account is linked and ready to receive payouts.</p>
          </div>
        </div>
      ) : (
        <div className="bg-amber-500/10 border border-amber-500/20 p-4 rounded-xl mb-8">
          <h4 className="font-bold text-amber-600 mb-1">Stripe Connect Required</h4>
          <p className="text-sm text-amber-600/80 mb-3">You must set up payouts before your listings can be active.</p>
          <button type="button" onClick={() => router.push('/seller/dashboard')} className="text-sm font-bold bg-amber-500 text-white px-4 py-2 rounded-lg">Go to Dashboard to Connect</button>
        </div>
      )}

      {error && (
        <div className="bg-destructive/10 border border-destructive/20 text-destructive p-4 rounded-lg font-semibold text-sm">
          {error}
        </div>
      )}

      <div>
        <label className="text-sm font-bold mb-2 block">Select Match</label>
        <select name="matchId" required className="w-full bg-background border border-border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary">
          <option value="">Select a match...</option>
          {matches.map(match => (
            <option key={match.id} value={match.id}>
              {match.homeTeam.name} vs {match.awayTeam.name} - {new Date(match.kickoffUtc).toLocaleDateString()}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-bold mb-2 block">Category</label>
          <select name="category" required className="w-full bg-background border border-border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary">
            <option value="CAT1">Category 1</option>
            <option value="CAT2">Category 2</option>
            <option value="CAT3">Category 3</option>
            <option value="CAT4">Category 4</option>
            <option value="ACCESSIBILITY">Accessibility</option>
          </select>
        </div>
        <div>
          <label className="text-sm font-bold mb-2 block">Quantity</label>
          <input type="number" name="quantity" min="1" max="10" required className="w-full bg-background border border-border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary" defaultValue={1} />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className="text-sm font-bold mb-2 block">Block/Section <span className="font-normal text-muted-foreground">(Optional)</span></label>
          <input type="text" name="section" className="w-full bg-background border border-border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary" placeholder="e.g. 104" />
        </div>
        <div>
          <label className="text-sm font-bold mb-2 block">Row <span className="font-normal text-muted-foreground">(Optional)</span></label>
          <input type="text" name="row" className="w-full bg-background border border-border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary" placeholder="e.g. B" />
        </div>
        <div>
          <label className="text-sm font-bold mb-2 block">Seats <span className="font-normal text-muted-foreground">(Optional)</span></label>
          <input type="text" name="seat" className="w-full bg-background border border-border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary" placeholder="e.g. 1, 2" />
        </div>
      </div>

      <div>
        <label className="text-sm font-bold mb-2 block">Price per Ticket (USD)</label>
        <div className="relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-muted-foreground">$</span>
          <input type="number" name="price" step="0.01" min="1" required className="w-full bg-background border border-border rounded-lg px-4 py-3 pl-8 focus:outline-none focus:ring-2 focus:ring-primary text-lg font-bold" placeholder="0.00" />
        </div>
        <p className="text-xs text-muted-foreground mt-2">You will receive the full amount entered here. We add a service fee to the buyer's price.</p>
      </div>

      <div>
        <label className="text-sm font-bold mb-2 block">Delivery Method</label>
        <select name="deliveryMethod" required className="w-full bg-background border border-border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary">
          <option value="FIFA_APP_TRANSFER">FIFA App Transfer</option>
          <option value="INSTANT_PDF">Instant PDF Download</option>
          <option value="WITHIN_72H">Deliver Within 72 Hours</option>
        </select>
      </div>

      <div>
        <label className="text-sm font-bold mb-2 block">Upload Proof of Purchase (Mocked)</label>
        <div className="border-2 border-dashed border-border rounded-xl p-8 text-center hover:bg-muted/50 transition-colors cursor-pointer relative">
          <input type="file" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" accept="image/*,.pdf" />
          <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-4" />
          <p className="font-bold mb-1">Click to upload or drag and drop</p>
          <p className="text-sm text-muted-foreground">PDF or image of confirmation email</p>
        </div>
      </div>

      <button type="submit" disabled={loading || !isStripeConnected} className="w-full bg-primary text-primary-foreground py-4 rounded-xl font-bold text-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
        {loading ? "Submitting..." : "Submit Listing for Review"}
      </button>
    </form>
  );
}
