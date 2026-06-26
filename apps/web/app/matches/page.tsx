import { Suspense } from "react";
import { prisma } from "@ticketuniverse/database";
import MatchesClient from "./MatchesClient";

export default async function MatchesPage() {
  const matches = await prisma.match.findMany({
    where: {
      kickoffUtc: {
        gt: new Date()
      }
    },
    include: {
      homeTeam: true,
      awayTeam: true,
      stadium: true,
      listings: {
        select: { id: true }
      }
    },
    orderBy: { kickoffUtc: 'asc' }
  });

  const teams = await prisma.team.findMany({
    orderBy: { name: 'asc' }
  });

  const stadiums = await prisma.stadium.findMany({
    orderBy: { name: 'asc' }
  });

  return (
    <div className="min-h-screen bg-transparent pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-6">
        <h1 className="text-4xl font-black text-foreground mb-4">All Matches</h1>
        <p className="text-muted-foreground mb-8 text-lg">Find tickets for all 104 matches of the 2026 FIFA World Cup.</p>
        
        <Suspense fallback={<div>Loading matches...</div>}>
          <MatchesClient initialMatches={matches} teams={teams} stadiums={stadiums} />
        </Suspense>
      </div>
    </div>
  );
}
