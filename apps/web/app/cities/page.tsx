import { prisma } from "@ticketuniverse/database";
import Link from "next/link";
import { MapPin } from "lucide-react";

const cityImages: Record<string, string> = {
  "Mexico City": "https://res.cloudinary.com/dm12f7lnc/image/upload/v1780304180/mexicocity_t7bigt.avif",
  "Guadalajara": "https://res.cloudinary.com/dm12f7lnc/image/upload/v1780304151/guadalajara_r9wo1t.jpg",
  "Toronto": "https://res.cloudinary.com/dm12f7lnc/image/upload/v1780304148/toronto_bwnsmn.jpg",
  "Los Angeles": "https://res.cloudinary.com/dm12f7lnc/image/upload/v1780304222/losangeles_v82zbn.jpg",
  "Boston": "https://res.cloudinary.com/dm12f7lnc/image/upload/v1780304152/boston_a2xiyv.webp",
  "Vancouver": "https://res.cloudinary.com/dm12f7lnc/image/upload/v1780304153/vancouver_a4k5zl.jpg",
  "New York": "https://res.cloudinary.com/dm12f7lnc/image/upload/v1780304169/new-york_omfrh6.jpg",
  "San Francisco": "https://res.cloudinary.com/dm12f7lnc/image/upload/v1780304147/san-francisco-ca_n7lsjj.jpg",
  "Philadelphia": "https://res.cloudinary.com/dm12f7lnc/image/upload/v1780304157/philadelphia_yny63r.jpg",
  "Houston": "https://res.cloudinary.com/dm12f7lnc/image/upload/v1780304160/houston-skyline_quwptf.jpg",
  "Dallas": "https://res.cloudinary.com/dm12f7lnc/image/upload/v1780304161/Skyline-Dallas-Texas_nticby.webp",
  "Monterrey": "https://res.cloudinary.com/dm12f7lnc/image/upload/v1780304181/monterrey_rabcs0.jpg",
  "Miami": "https://res.cloudinary.com/dm12f7lnc/image/upload/v1780304169/miami_ltw4at.webp",
  "Atlanta": "https://res.cloudinary.com/dm12f7lnc/image/upload/v1780304168/atlanta-skyline-georgia_j59ykj.webp",
  "Seattle": "https://res.cloudinary.com/dm12f7lnc/image/upload/v1780304165/seattle_sdljvu.avif",
  "Kansas City": "https://res.cloudinary.com/dm12f7lnc/image/upload/v1780304166/kansascity_vvckg7.webp"
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
