import { prisma } from "@ticketuniverse/database";
import Link from "next/link";
import MatchCard from "@/components/match-card";

export default async function SchedulePage() {
  const matches = await prisma.match.findMany({
    where: { kickoffUtc: { gt: new Date() } },
    orderBy: { kickoffUtc: 'asc' },
    include: { homeTeam: true, awayTeam: true, stadium: true, listings: true }
  });

  // Group matches by Date string (e.g. "Jun 25")
  const groupedMatches = matches.reduce((acc, match) => {
    const dateStr = new Date(match.kickoffUtc).toLocaleDateString('en-US', { month: 'short', day: 'numeric', weekday: 'long' });
    if (!acc[dateStr]) acc[dateStr] = [];
    acc[dateStr].push(match);
    return acc;
  }, {} as Record<string, typeof matches>);

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-primary text-primary-foreground py-16">
        <div className="max-w-7xl mx-auto px-6">
          <h1 className="text-4xl md:text-5xl font-black tracking-tighter mb-4">Tournament Schedule</h1>
          <p className="text-lg opacity-90 max-w-2xl">
            The complete 104-match calendar for the 2026 FIFA World Cup. 
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12 space-y-16">
        {Object.entries(groupedMatches).map(([date, dayMatches]) => (
          <div key={date}>
            <div className="flex items-center gap-4 mb-6">
              <h2 className="text-2xl font-black tracking-tight">{date}</h2>
              <div className="h-px bg-border flex-1" />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {dayMatches.map(match => (
                <MatchCard key={match.id} match={match} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}