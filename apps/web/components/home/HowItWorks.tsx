import { Search, Map, CreditCard } from "lucide-react";

export default function HowItWorks() {
  const steps = [
    {
      icon: <Search className="w-8 h-8 text-primary" />,
      title: "Step 1 — Find Your Match",
      desc: "Browse all 104 World Cup 2026 matches by date, team, or host city to find the perfect game."
    },
    {
      icon: <Map className="w-8 h-8 text-primary" />,
      title: "Step 2 — Choose Your Seats",
      desc: "Filter available listings by category, price, and stadium location to secure your spot."
    },
    {
      icon: <CreditCard className="w-8 h-8 text-primary" />,
      title: "Step 3 — Buy Safely",
      desc: "Pay securely via card, Apple Pay, or PayPal without needing an account. Tickets arrive instantly by email."
    }
  ];

  return (
    <div className="w-full py-24 bg-transparent">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-foreground mb-4">How It Works</h2>
          <p className="text-muted-foreground text-lg">Your frictionless journey to the 2026 World Cup.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
          {/* Connector Line (Desktop) */}
          <div className="hidden md:block absolute top-12 left-[16%] right-[16%] h-0.5 bg-border -z-10" />

          {steps.map((step, idx) => (
            <div key={idx} className="flex flex-col items-center text-center relative z-10">
              <div className="w-24 h-24 bg-card border-4 border-background rounded-full shadow-lg flex items-center justify-center mb-6">
                {step.icon}
              </div>
              <h3 className="text-xl font-bold mb-3">{step.title}</h3>
              <p className="text-muted-foreground leading-relaxed max-w-xs">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
