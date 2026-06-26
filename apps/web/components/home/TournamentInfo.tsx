import { Trophy, LayoutGrid } from "lucide-react";
import Image from "next/image";

export default function TournamentInfo() {
  const stats = [
    { icon: <Image src="/icons/icon-teams.png" alt="Teams" width={24} height={24} className="object-contain" />, label: "Teams", value: "48" },
    { icon: <Image src="/icons/icon-matches.png" alt="Matches" width={24} height={24} className="object-contain" />, label: "Matches", value: "104" },
    { icon: <Image src="/icons/icon-cities.png" alt="Cities" width={24} height={24} className="object-contain" />, label: "Cities", value: "16" },
    { icon: <Image src="/icons/icon-stadiums.png" alt="Stadiums" width={24} height={24} className="object-contain" />, label: "Stadiums", value: "16" },
    { icon: <Image src="/icons/icon-days.png" alt="Days" width={24} height={24} className="object-contain" />, label: "Days", value: "39" },
  ];

  return (
    <div className="w-full py-24 relative bg-background/90">
      <div 
        className="absolute inset-0 z-0 opacity-30 mix-blend-luminosity pointer-events-none bg-[url('/bg-tournament.png')] bg-cover bg-center bg-no-repeat bg-fixed" 
        aria-hidden="true" 
      />
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="bg-card/70 backdrop-blur-xl border border-border rounded-3xl p-8 lg:p-12 shadow-2xl overflow-hidden relative">
          
          <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
            <Trophy className="w-64 h-64" />
          </div>

          <div className="relative z-10">
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-foreground mb-4">The Largest World Cup in History</h2>
              <p className="text-muted-foreground text-lg max-w-2xl">The 2026 FIFA World Cup introduces an expanded format, bringing more nations, more matches, and more unforgettable moments to North America.</p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-5 gap-6 mb-16">
              {stats.map((stat, idx) => (
                <div key={idx} className="bg-muted/80 backdrop-blur-sm rounded-2xl p-6 text-center border border-border shadow-sm flex flex-col items-center hover:bg-muted/100 transition-colors">
                  <div className="text-primary mb-3 bg-background/90 p-3 rounded-full shadow-sm">{stat.icon}</div>
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
