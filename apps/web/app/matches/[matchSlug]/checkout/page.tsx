import { notFound } from "next/navigation";
import { prisma } from "@ticketuniverse/database";
import CheckoutSidebar from "@/components/checkout-sidebar";
import { LocalTime } from "@/components/local-time";
import { ArrowLeft, MapPin, Calendar } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default async function CheckoutPage({ params, searchParams }: { params: { matchSlug: string }, searchParams: { listingId?: string } }) {
  const match = await prisma.match.findUnique({
    where: { slug: params.matchSlug },
    include: {
      homeTeam: true,
      awayTeam: true,
      stadium: true,
      listings: {
        where: { status: 'ACTIVE' },
        orderBy: { pricePerTicket: 'asc' }
      }
    }
  });

  if (!match) return notFound();

  // Aggregate listings into "Categories" for the sidebar UI
  const categoriesMap = new Map();
  match.listings.forEach(listing => {
    if (!categoriesMap.has(listing.category)) {
      categoriesMap.set(listing.category, {
        id: listing.category,
        name: listing.category.replace('CAT', 'Category '),
        price: listing.pricePerTicket,
        description: `Standard seating in ${listing.category} zones`,
        lowestPriceListingId: listing.id
      });
    }
  });

  const categories = Array.from(categoriesMap.values()).sort((a, b) => a.price - b.price);

  return (
    <main className="min-h-screen bg-muted/30 pt-24 pb-12">
      <div className="container max-w-6xl mx-auto px-4">
        
        <Link href={`/matches/${match.slug}`} className="inline-flex items-center gap-2 text-sm font-bold text-muted-foreground hover:text-foreground mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Match
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Match Details */}
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-card border border-border rounded-2xl p-6 md:p-8 shadow-sm">
              <div className="flex items-center gap-4 mb-6">
                <div className="flex -space-x-4">
                  <div className="w-16 h-16 rounded-full border-4 border-card overflow-hidden bg-muted relative z-10">
                    {match.homeTeam.flagUrl && <Image src={match.homeTeam.flagUrl} alt={match.homeTeam.name} fill className="object-cover" />}
                  </div>
                  <div className="w-16 h-16 rounded-full border-4 border-card overflow-hidden bg-muted relative z-0">
                    {match.awayTeam.flagUrl && <Image src={match.awayTeam.flagUrl} alt={match.awayTeam.name} fill className="object-cover" />}
                  </div>
                </div>
                <div>
                  <h1 className="text-2xl font-black">{match.homeTeam.name} vs {match.awayTeam.name}</h1>
                  <p className="text-muted-foreground font-medium">World Cup 2026 • {match.round.replace('_', ' ')}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-start gap-3">
                  <div className="bg-primary/10 p-2 rounded-lg text-primary mt-1"><Calendar className="w-5 h-5"/></div>
                  <div>
                    <p className="font-bold">Date & Time</p>
                    <p className="text-sm text-muted-foreground"><LocalTime date={match.kickoffUtc.toISOString()} /></p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="bg-primary/10 p-2 rounded-lg text-primary mt-1"><MapPin className="w-5 h-5"/></div>
                  <div>
                    <p className="font-bold">Venue</p>
                    <p className="text-sm text-muted-foreground">{match.stadium.name}, {match.stadium.city}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
              <h3 className="font-bold text-lg mb-4">Important Information</h3>
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li className="flex gap-2"><span>•</span> All tickets are fully guaranteed and verified by Ticket Universe.</li>
                <li className="flex gap-2"><span>•</span> Mobile tickets will be transferred to your official FIFA app closer to the match date.</li>
                <li className="flex gap-2"><span>•</span> Names of ticket holders must be provided before checkout is finalized to comply with stadium entry requirements.</li>
                <li className="flex gap-2"><span>•</span> Prices are set by sellers and may be above or below face value.</li>
              </ul>
            </div>
          </div>

          {/* Right Column: Checkout Interactive Sidebar */}
          <div className="lg:col-span-5">
            <div className="sticky top-24">
              <CheckoutSidebar match={match} categories={categories} />
            </div>
          </div>

        </div>
      </div>
    </main>
  );
}
