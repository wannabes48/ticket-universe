import { ShieldCheck, Lock, CheckCircle, Zap } from "lucide-react";

export default function TrustBar() {
  return (
    <div className="w-full bg-transparent border-y border-border py-4">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-4 text-sm font-medium text-muted-foreground">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-primary" />
            <span>100% Buyer Guarantee</span>
          </div>
          <div className="flex items-center gap-2">
            <Lock className="w-5 h-5 text-primary" />
            <span>Secure Payments (Stripe)</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-primary" />
            <span>Verified Sellers</span>
          </div>
          <div className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-primary" />
            <span>Instant Ticket Delivery</span>
          </div>
        </div>
      </div>
    </div>
  );
}
