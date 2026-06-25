import { prisma } from "@ticketuniverse/database";
import Link from "next/link";
import { notFound } from "next/navigation";
import MatchCard from "@/components/match-card";
import { ArrowLeft, Map, Building, Users } from "lucide-react";

export default async function StadiumDetailPage({ params }: { params: { stadiumSlug: string } }) {
  const stadium = await prisma.stadium.findUnique({
    where: { slug: params.stadiumSlug },
    include: {
      matches: { include: { homeTeam: true, awayTeam: true, stadium: true, listings: true } },
    }
  });

  if (!stadium) notFound();

  const sortedMatches = stadium.matches.sort((a, b) => new Date(a.kickoffUtc).getTime() - new Date(b.kickoffUtc).getTime());

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-primary text-primary-foreground py-16">
        <div className="max-w-7xl mx-auto px-6 relative">
          <Link href="/stadiums" className="inline-flex items-center gap-2 text-primary-foreground/70 hover:text-white font-medium mb-8 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to Stadiums
          </Link>
          
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2 text-primary-foreground/80 font-bold uppercase tracking-widest text-sm mb-2">
              <Building className="w-4 h-4"/> Stadium Info
            </div>
            <h1 className="text-4xl md:text-6xl font-black tracking-tighter mb-4">{stadium.name}</h1>
            <div className="flex gap-4 flex-wrap">
              <span className="bg-black/20 px-4 py-2 rounded-lg font-medium flex items-center gap-2"><Map className="w-4 h-4"/> {stadium.city}, {stadium.countryCode}</span>
              <span className="bg-black/20 px-4 py-2 rounded-lg font-medium flex items-center gap-2"><Users className="w-4 h-4"/> {stadium.capacity.toLocaleString()} Capacity</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2">
          <h2 className="text-2xl font-bold mb-8">Matches at {stadium.name}</h2>
          
          {sortedMatches.length === 0 ? (
            <div className="bg-card border border-border rounded-xl p-12 text-center">
              <p className="text-muted-foreground">No matches scheduled for this stadium yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {sortedMatches.map(match => (
                <MatchCard key={match.id} match={match} />
              ))}
            </div>
          )}
        </div>

        <div>
          <div className="bg-card border border-border rounded-xl p-6 sticky top-24">
            <h3 className="font-bold text-lg mb-4 flex items-center gap-2"><Map className="text-primary"/> Venue Map Placeholder</h3>
            <div className="w-full h-64 bg-muted border border-border rounded-lg flex flex-col items-center justify-center text-muted-foreground gap-2">
              <Map className="w-8 h-8 opacity-50" />
              <span className="text-sm font-medium">Interactive seat map coming soon</span>
            </div>
            <p className="text-sm text-muted-foreground mt-4 leading-relaxed">
              Ticket Universe provides detailed block and section mappings for all matches at {stadium.name}. Please select a match to view specific seating availability.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
