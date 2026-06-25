import { prisma } from "@ticketuniverse/database";
import Link from "next/link";
import { MapPin } from "lucide-react";

export default async function CitiesPage() {
  const stadiums = await prisma.stadium.findMany({
    orderBy: { city: 'asc' },
    include: { matches: true }
  });

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-primary text-primary-foreground py-16">
        <div className="max-w-7xl mx-auto px-6">
          <h1 className="text-4xl md:text-5xl font-black tracking-tighter mb-4">Host Cities</h1>
          <p className="text-lg opacity-90 max-w-2xl">
            Explore the 16 incredible host cities across North America for the 2026 FIFA World Cup.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stadiums.map(stadium => {
            const citySlug = stadium.city.toLowerCase().replace(/[^a-z0-9]+/g, '-');
            return (
              <Link key={stadium.id} href={`/cities/${citySlug}`} className="group bg-card border border-border rounded-xl p-6 flex flex-col hover:border-primary hover:shadow-lg transition-all duration-300">
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary group-hover:scale-110 transition-transform duration-300">
                    <MapPin className="w-6 h-6" />
                  </div>
                  <div className="text-xs font-bold px-2 py-1 bg-muted rounded-md text-muted-foreground">{stadium.countryCode}</div>
                </div>
                <h3 className="text-2xl font-black tracking-tight mb-1">{stadium.city}</h3>
                <p className="text-muted-foreground font-medium mb-4">{stadium.name}</p>
                <div className="mt-auto pt-4 border-t border-border flex justify-between items-center text-sm">
                  <span className="font-bold">{stadium.matches.length} Matches</span>
                  <span className="text-primary font-semibold group-hover:underline">Explore City →</span>
                </div>
              </Link>
            )
          })}
        </div>
      </div>
    </div>
  );
}
