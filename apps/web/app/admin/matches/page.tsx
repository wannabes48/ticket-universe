import { prisma } from "@ticketuniverse/database";
import MatchesTable from "./MatchesTable";

export const revalidate = 0;

export default async function AdminMatchesPage() {
  const matches = await prisma.match.findMany({
    orderBy: { kickoffUtc: 'asc' },
    include: {
      homeTeam: true,
      awayTeam: true,
      stadium: true,
      listings: {
        where: { status: 'ACTIVE' }
      }
    }
  });

  const enrichedMatches = matches.map(m => {
    const adminInventoryCount = m.listings.filter(l => l.sellerId === null).reduce((sum, l) => sum + l.quantity, 0);
    const sellerInventoryCount = m.listings.filter(l => l.sellerId !== null).reduce((sum, l) => sum + l.quantity, 0);

    return {
      id: m.id,
      matchNumber: m.matchNumber,
      title: `${m.homeTeam.name} vs ${m.awayTeam.name}`,
      stadium: m.stadium.name,
      city: m.stadium.city,
      kickoffUtc: m.kickoffUtc,
      status: m.status,
      round: m.round,
      adminInventoryCount,
      sellerInventoryCount,
      totalInventory: adminInventoryCount + sellerInventoryCount
    };
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Matches & Inventory</h1>
        <p className="text-muted-foreground mt-2">Manage the 104 matches, adjust kickoff times, and add platform-owned ticket inventory.</p>
      </div>

      <MatchesTable matches={enrichedMatches} />
    </div>
  );
}
