import Image from "next/image";
import { Globe2, Calendar, MapPin, Trophy, LayoutGrid } from "lucide-react";

export default function TournamentInfo() {
  const stats = [
    { icon: <Globe2 className="w-6 h-6" />, label: "Teams", value: "48" },
    { icon: <Calendar className="w-6 h-6" />, label: "Matches", value: "104" },
    { icon: <MapPin className="w-6 h-6" />, label: "Cities", value: "16" },
    { icon: <LayoutGrid className="w-6 h-6" />, label: "Stadiums", value: "16" },
    { icon: <Trophy className="w-6 h-6" />, label: "Days", value: "39" },
  ];

  return (
    <div className="w-full py-24 bg-background">
      <div className="max-w-7xl mx-auto px-6">
        <div className="bg-card border border-border rounded-3xl p-8 lg:p-12 shadow-sm overflow-hidden relative">
          
          <div className="absolute top-0 right-0 p-8 opacity-25 pointer-events-none">
            <Image src="/world-cup-logo.png" alt="World Cup Logo" width={256} height={256} className="object-contain" />
          </div>

          <div className="relative z-10">
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-foreground mb-4">The Largest World Cup in History</h2>
              <p className="text-muted-foreground text-lg max-w-2xl">The 2026 FIFA World Cup introduces an expanded format, bringing more nations, more matches, and more unforgettable moments to North America.</p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-5 gap-6 mb-16">
              {stats.map((stat, idx) => (
                <div key={idx} className="bg-muted rounded-2xl p-6 text-center border border-border shadow-sm flex flex-col items-center">
                  <div className="text-primary mb-3 bg-background p-3 rounded-full shadow-sm">{stat.icon}</div>
                  <div className="text-3xl font-black text-foreground mb-1">{stat.value}</div>
                  <div className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">{stat.label}</div>
                </div>
              ))}
            </div>

            <div className="bg-muted/50 rounded-2xl p-8 border border-border">
              <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                <LayoutGrid className="w-5 h-5 text-primary" /> Tournament Format
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div>
                  <h4 className="font-bold text-foreground mb-2">1. Group Stage</h4>
                  <p className="text-muted-foreground text-sm">48 teams are drawn into 12 groups of 4. Each team plays 3 matches within their group.</p>
                </div>
                <div>
                  <h4 className="font-bold text-foreground mb-2">2. Knockout Progression</h4>
                  <p className="text-muted-foreground text-sm">The top 2 teams from each group, plus the 8 best third-placed teams, advance to the Round of 32.</p>
                </div>
                <div>
                  <h4 className="font-bold text-foreground mb-2">3. Knockout Stage</h4>
                  <p className="text-muted-foreground text-sm">Straight single-elimination matches (R32, R16, QF, SF, Final) determine the ultimate World Champion.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
