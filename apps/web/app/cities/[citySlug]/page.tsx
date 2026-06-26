import { prisma } from "@ticketuniverse/database";
import Link from "next/link";
import { notFound } from "next/navigation";
import MatchCard from "@/components/match-card";
import { ArrowLeft, MapPin, Building, Users } from "lucide-react";

export default async function CityDetailPage({ params }: { params: { citySlug: string } }) {
  const stadiums = await prisma.stadium.findMany({
    include: {
      matches: { 
        where: { kickoffUtc: { gt: new Date() } },
        include: { homeTeam: true, awayTeam: true, stadium: true, listings: true } 
      },
    }
  });

  const stadium = stadiums.find(s => s.city.toLowerCase().replace(/[^a-z0-9]+/g, '-') === params.citySlug);

  if (!stadium) notFound();

  const sortedMatches = stadium.matches.sort((a, b) => new Date(a.kickoffUtc).getTime() - new Date(b.kickoffUtc).getTime());

  return (
    <div className="min-h-screen bg-transparent">
      <div className="bg-primary text-primary-foreground py-16">
        <div className="max-w-7xl mx-auto px-6 relative">
          <Link href="/cities" className="inline-flex items-center gap-2 text-primary-foreground/70 hover:text-white font-medium mb-8 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to Cities
          </Link>
          
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2 text-primary-foreground/80 font-bold uppercase tracking-widest text-sm mb-2">
              <MapPin className="w-4 h-4"/> {stadium.countryCode} Host City
            </div>
            <h1 className="text-4xl md:text-6xl font-black tracking-tighter mb-4">{stadium.city}</h1>
            <div className="flex gap-4">
              <span className="bg-black/20 px-4 py-2 rounded-lg font-medium flex items-center gap-2"><Building className="w-4 h-4"/> {stadium.name}</span>
              <span className="bg-black/20 px-4 py-2 rounded-lg font-medium flex items-center gap-2"><Users className="w-4 h-4"/> {stadium.capacity.toLocaleString()} Capacity</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12">
        <h2 className="text-2xl font-bold mb-8">Matches in {stadium.city}</h2>
        
        {sortedMatches.length === 0 ? (
          <div className="bg-card border border-border rounded-xl p-12 text-center">
            <p className="text-muted-foreground">No matches scheduled for this city yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedMatches.map(match => (
              <MatchCard key={match.id} match={match} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
