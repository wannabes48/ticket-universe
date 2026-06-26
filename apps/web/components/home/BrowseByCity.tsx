import Link from "next/link";
import Image from "next/image";
import { MapPin } from "lucide-react";

interface StadiumWithMatches {
  id: string;
  name: string;
  slug: string;
  city: string;
  countryCode: string;
  imageUrl: string | null;
  matchCount: number;
}

export default function BrowseByCity({ stadiums }: { stadiums: StadiumWithMatches[] }) {
  // Group by country
  const grouped = stadiums.reduce((acc, st) => {
    if (!acc[st.countryCode]) acc[st.countryCode] = [];
    acc[st.countryCode].push(st);
    return acc;
  }, {} as Record<string, typeof stadiums>);

  const countries = [
    { code: 'US', name: 'United States', count: 11 },
    { code: 'MX', name: 'Mexico', count: 3 },
    { code: 'CA', name: 'Canada', count: 2 },
  ];

  return (
    <div className="w-full py-24 bg-transparent">
      <div className="max-w-7xl mx-auto px-6">
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-foreground mb-4">Host Cities & Stadiums</h2>
          <p className="text-muted-foreground max-w-3xl leading-relaxed">
            The 2026 FIFA World Cup spans 104 matches hosted across 16 world-class stadiums in 16 cities across the United States, Mexico, and Canada. The tournament is the largest in history, concluding with the final on July 19, 2026, at the New York New Jersey Stadium.
          </p>
        </div>

        <div className="space-y-16">
          {countries.map(country => {
            const countryStadiums = grouped[country.code] || [];
            if (countryStadiums.length === 0) return null;

            return (
              <div key={country.code}>
                <div className="flex items-center gap-4 mb-6 border-b border-border pb-2">
                  <h3 className="text-2xl font-bold text-foreground">{country.name}</h3>
                  <span className="bg-primary/10 text-primary font-semibold px-3 py-1 rounded-full text-sm">
                    {countryStadiums.length} Cities
                  </span>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {countryStadiums.map(stadium => (
                    <Link href={`/cities/${stadium.slug}`} key={stadium.id} className="group h-full block">
                      <div className="bg-card border border-border rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1 flex flex-col h-full">
                        <div className="h-40 w-full relative bg-muted">
                          {stadium.imageUrl ? (
                            <Image src={stadium.imageUrl} alt={stadium.city} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                              <MapPin className="w-8 h-8 opacity-50" />
                            </div>
                          )}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                          <div className="absolute bottom-4 left-4 right-4">
                            <h4 className="text-xl font-bold text-white mb-1">{stadium.city}</h4>
                          </div>
                        </div>
                        <div className="p-4 flex-grow flex flex-col justify-between bg-card">
                          <p className="text-sm text-muted-foreground font-medium mb-4 line-clamp-1">{stadium.name}</p>
                          <div className="flex justify-between items-center text-sm">
                            <span className="font-semibold bg-muted px-2 py-1 rounded">{stadium.matchCount} Matches</span>
                            <span className="text-primary font-medium group-hover:translate-x-1 transition-transform">View Matches &rarr;</span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  );
}
