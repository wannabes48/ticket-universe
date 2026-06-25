import { prisma } from "@ticketuniverse/database";
import Link from "next/link";
import Image from "next/image";
import { TeamFlagCard } from "@/components/team-flag-card";

export default async function TeamsPage() {
  const teams = await prisma.team.findMany({
    orderBy: { name: 'asc' },
    include: {
      homeMatches: true,
      awayMatches: true,
    }
  });

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-primary text-primary-foreground py-16">
        <div className="max-w-7xl mx-auto px-6">
          <h1 className="text-4xl md:text-5xl font-black tracking-tighter mb-4">Qualified Teams</h1>
          <p className="text-lg opacity-90 max-w-2xl">
            Browse all 48 national teams competing in the 2026 FIFA World Cup. Select a team to view their match schedule and secure your tickets.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
          {teams.map(team => {
            const matchCount = team.homeMatches.length + team.awayMatches.length;
            return (
              <TeamFlagCard key={team.id} team={team} matchCount={matchCount} />
            );
          })}
        </div>
      </div>
    </div>
  );
}
