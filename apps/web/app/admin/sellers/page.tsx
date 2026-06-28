import { prisma } from "@ticketuniverse/database";
import SellersTable from "./SellersTable";

export const revalidate = 0;

export default async function AdminSellersPage() {
  const sellers = await prisma.user.findMany({
    where: {
      OR: [
        { role: 'SELLER' },
        { kycStatus: { not: null } }
      ]
    },
    include: {
      listings: {
        include: {
          orders: {
            where: { status: { in: ['PAID', 'DELIVERED', 'COMPLETED'] } }
          }
        }
      }
    },
    orderBy: { createdAt: 'desc' }
  });

  const enrichedSellers = sellers.map(seller => {
    const totalListings = seller.listings.length;
    const activeListings = seller.listings.filter(l => l.status === 'ACTIVE').length;
    
    // Calculate total successful sales volume
    let totalSales = 0;
    seller.listings.forEach(listing => {
      listing.orders.forEach(order => {
        totalSales += order.total;
      });
    });

    return {
      id: seller.id,
      name: seller.name || 'Unknown',
      email: seller.email || 'No email provided',
      role: seller.role,
      kycStatus: seller.kycStatus || 'UNVERIFIED',
      createdAt: seller.createdAt,
      totalSales,
      totalListings,
      activeListings,
    };
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Sellers Management</h1>
        <p className="text-muted-foreground mt-2">Manage seller accounts, verify KYC documents, and monitor sales.</p>
      </div>

      <SellersTable sellers={enrichedSellers} />
    </div>
  );
}
