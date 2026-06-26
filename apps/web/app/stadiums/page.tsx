import { prisma } from "@ticketuniverse/database";
import Link from "next/link";
import { Building, MapPin, Users } from "lucide-react";

export default async function StadiumsPage() {
  const stadiums = await prisma.stadium.findMany({
    orderBy: { capacity: 'desc' },
    include: { matches: true }
  });

  return (
    <div className="min-h-screen bg-transparent">
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
              <Link key={stadium.id} href={`/stadiums/${stadium.slug}`} className="group relative overflow-hidden bg-card rounded-2xl flex flex-col transition-all duration-500 hover:shadow-2xl hover:shadow-primary/20 min-h-[420px]">
                {/* Background Image */}
                <div 
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                  style={{ backgroundImage: `url('${stadium.imageUrl || ""}')` }}
                />
                
                {/* Dark Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/10 transition-opacity duration-500 group-hover:opacity-90" />
                
                {/* Content */}
                <div className="relative flex flex-col h-full p-6 text-white z-10">
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white border border-white/30 shadow-sm group-hover:scale-110 transition-transform duration-300">
                      <Building className="w-6 h-6" />
                    </div>
                    <div className="text-xs font-bold px-3 py-1.5 bg-black/40 backdrop-blur-md rounded-full text-white border border-white/10 shadow-sm uppercase tracking-wide">
                      {stadium.countryCode === 'US' ? 'USA' : stadium.countryCode === 'MX' ? 'MEX' : 'CAN'}
                    </div>
                  </div>
                  
                  <div className="mt-auto">
                    <h3 className="text-3xl font-black tracking-tight mb-2 drop-shadow-md">{stadium.name}</h3>
                    <div className="flex flex-col gap-1.5 text-white/80 text-sm font-medium mb-5 drop-shadow-sm">
                      <span className="flex items-center gap-2"><MapPin className="w-4 h-4"/> {stadium.city}</span>
                      <span className="flex items-center gap-2"><Users className="w-4 h-4"/> {stadium.capacity.toLocaleString()} Capacity</span>
                    </div>
                    
                    <div className="pt-4 border-t border-white/20 flex justify-between items-center text-sm">
                      <span className="font-bold flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                        {stadium.matches.length} Matches
                      </span>
                      <span className="text-white font-bold group-hover:translate-x-1 transition-transform duration-300">View Venue →</span>
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
