import { ShieldCheck, Lock, Smartphone, BadgeCheck } from "lucide-react";

export function TrustBadgeStrip() {
  const badges = [
    { icon: ShieldCheck, label: "100% Guaranteed", desc: "Valid tickets or your money back" },
    { icon: Lock, label: "Secure Checkout", desc: "Encrypted payment processing" },
    { icon: Smartphone, label: "Instant Transfer", desc: "Sent directly to FIFA app" },
    { icon: BadgeCheck, label: "Verified Sellers", desc: "Strict KYC vetting process" },
  ];

  return (
    <div className="bg-card border border-border rounded-xl p-4 md:p-6 grid grid-cols-2 md:grid-cols-4 gap-4">
      {badges.map((badge, idx) => {
        const Icon = badge.icon;
        return (
          <div key={idx} className="flex flex-col items-center text-center space-y-2 p-2">
            <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-1">
              <Icon className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-sm text-foreground">{badge.label}</h4>
            <p className="text-xs text-muted-foreground">{badge.desc}</p>
          </div>
        );
      })}
    </div>
  );
}
