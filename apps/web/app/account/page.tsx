import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@ticketuniverse/database";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Ticket, Calendar, MapPin, Info, ArrowRight } from "lucide-react";

export default async function AccountPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    redirect("/");
  }

  const orders = await prisma.order.findMany({
    where: { buyerEmail: session.user.email },
    include: {
      listing: {
        include: {
          match: {
            include: {
              homeTeam: true,
              awayTeam: true,
              stadium: true
            }
          }
        }
      }
    },
    orderBy: { id: 'desc' }
  });

  return (
    <main className="min-h-screen bg-muted/30 pt-24 pb-12">
      <div className="container max-w-5xl mx-auto px-4">
        
        <div className="mb-10">
          <h1 className="text-4xl font-black tracking-tighter mb-2">My Tickets</h1>
          <p className="text-muted-foreground">View and manage your purchased tickets for the 2026 FIFA World Cup.</p>
        </div>

        {/* Info Banner */}
        <div className="bg-primary/10 border border-primary/20 rounded-2xl p-6 mb-8 flex gap-4 items-start">
          <Info className="w-6 h-6 text-primary shrink-0 mt-1" />
          <div>
            <h3 className="font-bold text-primary mb-1">How to access your tickets</h3>
            <p className="text-sm text-primary/80 leading-relaxed">
              For security reasons, all official tickets will be delivered directly to your mobile device via the official <strong>FIFA Tickets App</strong>. 
              Sellers are required to transfer the tickets to the email address associated with your purchase ({session.user.email}) no later than 72 hours before kickoff.
            </p>
          </div>
        </div>

        <div className="space-y-6">
          {orders.length === 0 ? (
            <div className="bg-card border border-border rounded-2xl p-12 text-center shadow-sm">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                <Ticket className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-bold mb-2">No tickets yet</h3>
              <p className="text-muted-foreground mb-6">Looks like you haven't purchased any tickets yet.</p>
              <Link href="/matches" className="bg-primary text-primary-foreground px-6 py-3 rounded-full font-bold inline-flex items-center gap-2 hover:bg-primary/90 transition-colors">
                Browse Matches <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          ) : (
            orders.map(order => (
              <div key={order.id} className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm flex flex-col md:flex-row">
                {/* Match Info Side */}
                <div className="bg-muted/50 p-6 md:w-1/3 border-b md:border-b-0 md:border-r border-border flex flex-col justify-center">
                  <div className="flex gap-3 items-center mb-4">
                    <img src={order.listing.match.homeTeam.flagUrl!} alt="Home" className="w-8 h-8 rounded-full border border-border object-cover" />
                    <span className="font-bold text-muted-foreground text-sm">vs</span>
                    <img src={order.listing.match.awayTeam.flagUrl!} alt="Away" className="w-8 h-8 rounded-full border border-border object-cover" />
                  </div>
                  <h3 className="text-xl font-black leading-tight mb-2">
                    {order.listing.match.homeTeam.name} vs {order.listing.match.awayTeam.name}
                  </h3>
                  <div className="space-y-2 mt-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      <span>{new Date(order.listing.match.kickoffUtc).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      <span>{order.listing.match.stadium.name}</span>
                    </div>
                  </div>
                </div>

                {/* Ticket Details Side */}
                <div className="p-6 md:w-2/3 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start mb-6">
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Order Ref: <span className="font-mono">{order.reference}</span></p>
                        <h4 className="text-2xl font-bold">{order.quantity}x {order.listing.category.replace('CAT', 'Category ')}</h4>
                        <p className="text-muted-foreground text-sm mt-1">Section {order.listing.section || 'TBD'} • Row {order.listing.row || 'TBD'}</p>
                      </div>
                      
                      <div className="text-right">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider
                          ${order.status === 'COMPLETED' || order.status === 'DELIVERED' ? 'bg-green-500/10 text-green-600 dark:text-green-400' : 
                            order.status === 'PAID' ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400' : 
                            'bg-amber-500/10 text-amber-600 dark:text-amber-400'}`}>
                          {order.status}
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 bg-muted/30 rounded-xl p-4 mb-6">
                      <div>
                        <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Delivery Method</p>
                        <p className="font-semibold text-sm">
                          {order.listing.deliveryMethod.replace(/_/g, ' ')}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Total Paid</p>
                        <p className="font-semibold text-sm">${order.total.toFixed(2)}</p>
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-border pt-4 flex items-center justify-between">
                    <p className="text-sm text-muted-foreground">
                      {order.status === 'DELIVERED' 
                        ? "Your tickets have been transferred! Check your FIFA app."
                        : "Tickets will be transferred securely to your email."}
                    </p>
                    {order.status === 'DELIVERED' && (
                      <button className="bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-bold shadow-sm">
                        Confirm Receipt
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </main>
  );
}
