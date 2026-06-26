import { ShieldCheck, RefreshCcw, Headset, Ticket, CheckCircle } from "lucide-react";

export default function BuyerProtection() {
  return (
    <div className="w-full py-24 bg-transparent border-y border-border">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col lg:flex-row gap-16 items-center">
          
          {/* Left Text */}
          <div className="lg:w-1/3">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 rounded-full text-sm font-medium mb-6 border border-white/20">
              <ShieldCheck className="w-4 h-4 text-cyan-400" /> Ticket Universe Protect
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Every Ticket Covered by Our Guarantee</h2>
            <p className="text-white/70 text-lg leading-relaxed mb-8">
              We ensure a secure, transparent, and frictionless secondary market experience. Buy with total peace of mind knowing your transaction is 100% protected.
            </p>
            <button className="bg-white text-black px-6 py-3 rounded-full font-bold hover:bg-white/90 transition-colors">
              Read Full Policy
            </button>
          </div>

          {/* Right Grid */}
          <div className="lg:w-2/3 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white/5 border border-white/10 p-6 rounded-2xl">
              <RefreshCcw className="w-8 h-8 text-cyan-400 mb-4" />
              <h3 className="font-bold text-lg mb-2">100% Refund Guarantee</h3>
              <p className="text-white/60 text-sm">Full refund immediately issued if your tickets are not delivered in time for the match.</p>
            </div>
            
            <div className="bg-white/5 border border-white/10 p-6 rounded-2xl">
              <CheckCircle className="w-8 h-8 text-cyan-400 mb-4" />
              <h3 className="font-bold text-lg mb-2">Up to 150% Refund</h3>
              <p className="text-white/60 text-sm">In exceptional cases involving seller failure, we provide up to 150% compensation to protect the buyer.</p>
            </div>
            
            <div className="bg-white/5 border border-white/10 p-6 rounded-2xl">
              <Ticket className="w-8 h-8 text-cyan-400 mb-4" />
              <h3 className="font-bold text-lg mb-2">Safe Replacements</h3>
              <p className="text-white/60 text-sm">If an issue arises, we prioritize finding you equal or better replacement tickets whenever available.</p>
            </div>
            
            <div className="bg-white/5 border border-white/10 p-6 rounded-2xl">
              <Headset className="w-8 h-8 text-cyan-400 mb-4" />
              <h3 className="font-bold text-lg mb-2">24/7 Multilingual Support</h3>
              <p className="text-white/60 text-sm">Our dedicated global team is available around the clock to assist you before, during, and after the match.</p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
