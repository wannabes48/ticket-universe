import { prisma } from "@ticketuniverse/database";
import ListingsTable from "./ListingsTable";

export const revalidate = 0;

export default async function AdminListingsPage() {
  const listings = await prisma.ticketListing.findMany({
    where: {
      status: { in: ['ACTIVE', 'REMOVED'] } // Focus on moderation queue
    },
    orderBy: { createdAt: 'desc' },
    include: {
      match: {
        include: {
          homeTeam: true,
          awayTeam: true
        }
      },
      seller: true
    }
  });

  const safeListings = listings.map(l => ({
    id: l.id,
    sellerEmail: l.seller?.email || 'Admin',
    sellerKyc: l.seller?.kycStatus || 'UNVERIFIED',
    matchTitle: `${l.match.homeTeam.name} vs ${l.match.awayTeam.name}`,
    category: l.category,
    section: l.section,
    quantity: l.quantity,
    pricePerTicket: l.pricePerTicket,
    currency: l.currency,
    status: l.status,
    createdAt: l.createdAt,
    isSuspicious: l.pricePerTicket > 10000 || (!l.seller?.kycStatus && l.pricePerTicket > 1000)
  }));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Listings Moderation</h1>
        <p className="text-muted-foreground mt-2">Approve, reject, and monitor active ticket listings.</p>
      </div>

      <ListingsTable listings={safeListings} />
    </div>
  );
}
