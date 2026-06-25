import { prisma } from "@ticketuniverse/database";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import MatchCard from "@/components/match-card";
import { ArrowLeft, Ticket } from "lucide-react";

export default async function TeamDetailPage({ params }: { params: { teamSlug: string } }) {
  const team = await prisma.team.findUnique({
    where: { slug: params.teamSlug },
    include: {
      homeMatches: { include: { homeTeam: true, awayTeam: true, stadium: true, listings: true } },
      awayMatches: { include: { homeTeam: true, awayTeam: true, stadium: true, listings: true } },
    }
  });

  if (!team) notFound();

  const allMatches = [...team.homeMatches, ...team.awayMatches].sort((a, b) => new Date(a.kickoffUtc).getTime() - new Date(b.kickoffUtc).getTime());

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-primary text-primary-foreground py-16">
        <div className="max-w-7xl mx-auto px-6 relative">
          <Link href="/teams" className="inline-flex items-center gap-2 text-primary-foreground/70 hover:text-white font-medium mb-8 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to Teams
          </Link>
          
          <div className="flex items-center gap-6">
            <div className="w-32 h-24 relative overflow-hidden rounded-lg shadow-xl border-4 border-white/20">
              {team.flagUrl ? (
                <Image src={team.flagUrl} alt={`${team.name} flag`} fill className="object-cover" />
              ) : (
                <div className="w-full h-full bg-muted flex items-center justify-center text-xs">TBD</div>
              )}
            </div>
            <div>
              <h1 className="text-4xl md:text-5xl font-black tracking-tighter mb-2">{team.name}</h1>
              <p className="text-lg opacity-90 font-medium">{allMatches.length} Upcoming Matches</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12">
        <h2 className="text-2xl font-bold mb-8 flex items-center gap-2"><Ticket className="text-primary"/> Match Schedule & Tickets</h2>
        
        {allMatches.length === 0 ? (
          <div className="bg-card border border-border rounded-xl p-12 text-center">
            <p className="text-muted-foreground">No matches scheduled for this team yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {allMatches.map(match => (
              <MatchCard key={match.id} match={match} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
