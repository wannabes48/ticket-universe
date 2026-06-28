import { prisma } from "@ticketuniverse/database";
import OrdersTable from "./OrdersTable";

export const revalidate = 0; // Always fresh for admin

export default async function AdminOrdersPage() {
  const orders = await prisma.order.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      listing: {
        include: {
          match: {
            include: {
              homeTeam: true,
              awayTeam: true
            }
          },
          seller: true
        }
      }
    }
  });

  // Transform data for the client component
  const safeOrders = orders.map(order => ({
    id: order.id,
    reference: order.reference,
    buyerEmail: order.buyerEmail,
    buyerName: order.buyerName,
    buyerPhone: order.buyerPhone,
    matchTitle: `${order.listing.match.homeTeam.name} vs ${order.listing.match.awayTeam.name}`,
    total: order.total,
    currency: order.currency,
    status: order.status,
    createdAt: order.createdAt,
    stripePaymentIntentId: order.stripePaymentIntentId,
    refundProtection: order.refundProtection,
    deliveryMethod: order.listing.deliveryMethod,
    sellerEmail: order.listing.seller?.email || 'Admin Inventory',
    quantity: order.quantity,
    ticketCategory: order.listing.category,
    // @ts-ignore
    internalNote: order.internalNote || '',
  }));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Orders Management</h1>
        <p className="text-muted-foreground mt-2">View and manage all customer orders.</p>
      </div>

      <OrdersTable orders={safeOrders} />
    </div>
  );
}
