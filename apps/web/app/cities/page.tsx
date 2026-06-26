import { prisma } from "@ticketuniverse/database";
import Link from "next/link";
import { MapPin } from "lucide-react";

const cityImages: Record<string, string> = {
  "Mexico City": "https://images.unsplash.com/photo-1518105779142-d975f22f1b0a?q=80&w=800&auto=format&fit=crop",
  "Guadalajara": "https://images.unsplash.com/photo-1583256037777-62f924fb9da0?q=80&w=800&auto=format&fit=crop",
  "Toronto": "https://images.unsplash.com/photo-1507992781348-310259076fe0?q=80&w=800&auto=format&fit=crop",
  "Los Angeles": "https://images.unsplash.com/photo-1515896769750-31548ea180d1?q=80&w=800&auto=format&fit=crop",
  "Boston": "https://images.unsplash.com/photo-1506501139174-099022df5260?q=80&w=800&auto=format&fit=crop",
  "Vancouver": "https://images.unsplash.com/photo-1559511260-66a654ae982a?q=80&w=800&auto=format&fit=crop",
  "New York": "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?q=80&w=800&auto=format&fit=crop",
  "San Francisco": "https://images.unsplash.com/photo-1501594907352-04cda38ebc29?q=80&w=800&auto=format&fit=crop",
  "Philadelphia": "https://images.unsplash.com/photo-1605810230434-7631ac76ec81?q=80&w=800&auto=format&fit=crop",
  "Houston": "https://images.unsplash.com/photo-1531218150217-5afc40b5c2bf?q=80&w=800&auto=format&fit=crop",
  "Dallas": "https://images.unsplash.com/photo-1545648710-1845bb08f3eb?q=80&w=800&auto=format&fit=crop",
  "Monterrey": "https://images.unsplash.com/photo-1589330882655-3d9a5b3a8123?q=80&w=800&auto=format&fit=crop",
  "Miami": "https://images.unsplash.com/photo-1514214246283-d427a95c5d2f?q=80&w=800&auto=format&fit=crop",
  "Atlanta": "https://images.unsplash.com/photo-1575917649705-5b59aaa12e6b?q=80&w=800&auto=format&fit=crop",
  "Seattle": "https://images.unsplash.com/photo-1502175353174-a7a70e73b362?q=80&w=800&auto=format&fit=crop",
  "Kansas City": "https://images.unsplash.com/photo-1596706912384-9380b2792c30?q=80&w=800&auto=format&fit=crop"
};

export default async function CitiesPage() {
  const stadiums = await prisma.stadium.findMany({
    orderBy: { city: 'asc' },
    include: { matches: true }
  });

  return (
    <div className="min-h-screen bg-transparent">
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
              <Link key={stadium.id} href={`/cities/${citySlug}`} className="group relative overflow-hidden bg-card rounded-2xl flex flex-col transition-all duration-500 hover:shadow-2xl hover:shadow-primary/20 min-h-[380px]">
                {/* Background Image */}
                <div 
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                  style={{ backgroundImage: `url('${cityImages[stadium.city] || ""}')` }}
                />
                
                {/* Dark Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/10 transition-opacity duration-500 group-hover:opacity-90" />
                
                {/* Content */}
                <div className="relative flex flex-col h-full p-6 text-white z-10">
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white border border-white/30 shadow-sm group-hover:scale-110 transition-transform duration-300">
                      <MapPin className="w-6 h-6" />
                    </div>
                    <div className="text-xs font-bold px-3 py-1.5 bg-black/40 backdrop-blur-md rounded-full text-white border border-white/10 shadow-sm uppercase tracking-wide">
                      {stadium.countryCode === 'US' ? 'USA' : stadium.countryCode === 'MX' ? 'MEX' : 'CAN'}
                    </div>
                  </div>
                  
                  <div className="mt-auto">
                    <h3 className="text-3xl font-black tracking-tight mb-1 drop-shadow-md">{stadium.city}</h3>
                    <p className="text-white/80 font-medium mb-4 drop-shadow-sm">{stadium.name}</p>
                    
                    <div className="pt-4 border-t border-white/20 flex justify-between items-center text-sm">
                      <span className="font-bold flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                        {stadium.matches.length} Matches
                      </span>
                      <span className="text-white font-bold group-hover:translate-x-1 transition-transform duration-300">Explore →</span>
                    </div>
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
