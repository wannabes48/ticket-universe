import { prisma } from "@ticketuniverse/database";
import { Ticket, DollarSign, Users, AlertTriangle, Activity } from "lucide-react";

export const revalidate = 0; // Always fresh for admin

export default async function AdminDashboardPage() {
  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const startOfWeek = new Date(now.getFullYear(), now.getMonth(), now.getDate() - now.getDay());

  // Revenue Aggregations
  const allTimeOrders = await prisma.order.aggregate({
    _sum: { total: true },
    _count: { id: true },
    where: { status: { in: ['PAID', 'COMPLETED', 'DELIVERED'] } }
  });

  const todayOrders = await prisma.order.aggregate({
    _sum: { total: true },
    _count: { id: true },
    where: { 
      status: { in: ['PAID', 'COMPLETED', 'DELIVERED'] },
      createdAt: { gte: startOfToday }
    }
  });

  const weekOrders = await prisma.order.aggregate({
    _sum: { total: true },
    _count: { id: true },
    where: { 
      status: { in: ['PAID', 'COMPLETED', 'DELIVERED'] },
      createdAt: { gte: startOfWeek }
    }
  });

  // Other Counts
  const activeListings = await prisma.ticketListing.count({
    where: { status: 'ACTIVE' }
  });

  const openDisputes = await prisma.order.count({
    where: { status: 'DISPUTED' }
  });

  const newSellers = await prisma.user.count({
    where: { 
      role: 'SELLER',
      createdAt: { gte: startOfWeek }
    }
  });

  const revenueAllTime = allTimeOrders._sum.total || 0;
  const revenueToday = todayOrders._sum.total || 0;
  const revenueWeek = weekOrders._sum.total || 0;

  const ticketsAllTime = allTimeOrders._count.id;
  const ticketsToday = todayOrders._count.id;
  const ticketsWeek = weekOrders._count.id;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Dashboard Overview</h1>
        <p className="text-muted-foreground mt-2">Welcome to the Ticket Universe Admin Panel.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard 
          title="Revenue (Today)" 
          value={`$${revenueToday.toLocaleString()}`} 
          subtitle={`${ticketsToday} tickets sold`} 
          icon={<DollarSign className="w-5 h-5 text-emerald-500" />} 
        />
        <MetricCard 
          title="Revenue (This Week)" 
          value={`$${revenueWeek.toLocaleString()}`} 
          subtitle={`${ticketsWeek} tickets sold`} 
          icon={<Activity className="w-5 h-5 text-blue-500" />} 
        />
        <MetricCard 
          title="Revenue (All Time)" 
          value={`$${revenueAllTime.toLocaleString()}`} 
          subtitle={`${ticketsAllTime} tickets sold`} 
          icon={<DollarSign className="w-5 h-5 text-primary" />} 
        />
        <MetricCard 
          title="Active Listings" 
          value={activeListings.toLocaleString()} 
          subtitle="Currently available on site" 
          icon={<Ticket className="w-5 h-5 text-purple-500" />} 
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <MetricCard 
          title="Action Required: Disputes" 
          value={openDisputes.toLocaleString()} 
          subtitle="Orders currently in DISPUTED status" 
          icon={<AlertTriangle className="w-5 h-5 text-destructive" />} 
          className={openDisputes > 0 ? "border-destructive/50 bg-destructive/5" : ""}
        />
        <MetricCard 
          title="New Sellers (This Week)" 
          value={newSellers.toLocaleString()} 
          subtitle="Pending KYC verifications may be required" 
          icon={<Users className="w-5 h-5 text-orange-500" />} 
        />
      </div>
    </div>
  );
}

function MetricCard({ title, value, subtitle, icon, className = "" }: { title: string, value: string | number, subtitle: string, icon: React.ReactNode, className?: string }) {
  return (
    <div className={`bg-card border border-border rounded-xl p-6 shadow-sm flex flex-col ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-sm text-muted-foreground">{title}</h3>
        <div className="p-2 bg-muted rounded-md">
          {icon}
        </div>
      </div>
      <div className="text-3xl font-black text-foreground mb-1">{value}</div>
      <p className="text-xs font-medium text-muted-foreground">{subtitle}</p>
    </div>
  );
}
