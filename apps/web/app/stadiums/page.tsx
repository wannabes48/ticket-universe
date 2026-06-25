import { prisma } from "@ticketuniverse/database";
import Link from "next/link";
import { Building, MapPin, Users } from "lucide-react";

export default async function StadiumsPage() {
  const stadiums = await prisma.stadium.findMany({
    orderBy: { capacity: 'desc' },
    include: { matches: true }
  });

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-primary text-primary-foreground py-16">
        <div className="max-w-7xl mx-auto px-6">
          <h1 className="text-4xl md:text-5xl font-black tracking-tighter mb-4">The Stadiums</h1>
          <p className="text-lg opacity-90 max-w-2xl">
            Discover the 16 world-class venues hosting the 2026 FIFA World Cup, ranging from iconic historic grounds to state-of-the-art super-stadiums.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {stadiums.map(stadium => {
            return (
              <Link key={stadium.id} href={`/stadiums/${stadium.slug}`} className="group bg-card border border-border rounded-xl overflow-hidden hover:border-primary hover:shadow-lg transition-all duration-300 flex flex-col">
                <div className="h-48 bg-muted relative flex items-center justify-center border-b border-border">
                  <Building className="w-16 h-16 text-muted-foreground/30" />
                  <div className="absolute bottom-2 right-2 bg-background/80 backdrop-blur text-xs font-bold px-2 py-1 rounded shadow-sm">
                    {stadium.countryCode}
                  </div>
                </div>
                <div className="p-6 flex flex-col flex-1">
                  <h3 className="text-xl font-black tracking-tight mb-2">{stadium.name}</h3>
                  <div className="flex flex-col gap-2 text-sm text-muted-foreground mb-6">
                    <span className="flex items-center gap-2"><MapPin className="w-4 h-4"/> {stadium.city}</span>
                    <span className="flex items-center gap-2"><Users className="w-4 h-4"/> {stadium.capacity.toLocaleString()} Capacity</span>
                  </div>
                  <div className="mt-auto pt-4 border-t border-border flex justify-between items-center text-sm">
                    <span className="font-bold">{stadium.matches.length} Matches</span>
                    <span className="text-primary font-semibold group-hover:underline">View Venue →</span>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      </div>
    </div>
  );
}
