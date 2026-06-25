import Link from "next/link";
import Image from "next/image";
import { Calendar, MapPin } from "lucide-react";
import { LocalTime } from "@/components/local-time";
import { getPricingForRound } from "@/lib/pricing";
import { PriceBadge } from "@/components/price-badge";

export default function MatchCard({ match }: { match: any }) {
  const pricing = getPricingForRound(match.round);

  return (
    <Link href={`/matches/${match.slug}`} className="group block h-full w-full">
      <div className="bg-card border border-border rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1 relative h-full flex flex-col">
        <PriceBadge amount={pricing.min} className="absolute top-4 right-4 z-10" />
        
        <div className="flex justify-between items-center bg-muted/50 p-6 border-b border-border">
          <div className="flex flex-col items-center gap-2">
            <div className="w-16 h-16 relative bg-white rounded-full p-2 shadow-sm border border-border/50 flex items-center justify-center overflow-hidden">
              {match.homeTeam?.flagUrl ? (
                <Image src={match.homeTeam.flagUrl} alt={match.homeTeam.name} fill className="object-cover" />
              ) : (
                <div className="text-muted-foreground font-bold">{match.homeTeam?.countryCode || 'TBD'}</div>
              )}
            </div>
            <span className="font-semibold text-sm text-foreground">{match.homeTeam?.countryCode || 'TBD'}</span>
          </div>
          
          <div className="text-muted-foreground font-bold text-sm bg-background px-3 py-1 rounded-full shadow-sm border border-border">
            VS
          </div>
          
          <div className="flex flex-col items-center gap-2">
            <div className="w-16 h-16 relative bg-white rounded-full p-2 shadow-sm border border-border/50 flex items-center justify-center overflow-hidden">
              {match.awayTeam?.flagUrl ? (
                <Image src={match.awayTeam.flagUrl} alt={match.awayTeam.name} fill className="object-cover" />
              ) : (
                <div className="text-muted-foreground font-bold">{match.awayTeam?.countryCode || 'TBD'}</div>
              )}
            </div>
            <span className="font-semibold text-sm text-foreground">{match.awayTeam?.countryCode || 'TBD'}</span>
          </div>
        </div>
        
        <div className="p-6 flex-grow">
          <h3 className="font-bold text-lg mb-4 text-card-foreground group-hover:text-primary transition-colors line-clamp-1">
            {match.homeTeam?.name || 'TBD'} vs {match.awayTeam?.name || 'TBD'}
          </h3>
          <div className="flex flex-col gap-3 text-muted-foreground text-sm">
            <div className="flex items-center gap-3">
              <div className="bg-primary/10 p-2 rounded-lg text-primary">
                <Calendar className="w-4 h-4" />
              </div>
              <span className="font-medium text-foreground/80">
                <LocalTime date={match.kickoffUtc} />
              </span>
            </div>
            <div className="flex items-center gap-3">
              <div className="bg-primary/10 p-2 rounded-lg text-primary">
                <MapPin className="w-4 h-4" />
              </div>
              <span className="font-medium text-foreground/80 line-clamp-1">
                {match.stadium?.name}, {match.stadium?.city}
              </span>
            </div>
          </div>
        </div>
        
        <div className="px-6 py-4 bg-muted/30 border-t border-border flex justify-between items-center group-hover:bg-primary/5 transition-colors mt-auto">
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground bg-background px-2 py-1 rounded border border-border/50">
            {match.round.replace('_', ' ')}
          </span>
          <div className="flex items-center gap-1.5 text-primary font-semibold text-sm group-hover:translate-x-1 transition-transform">
            Buy Tickets <Image src="/custom-ticket.png" alt="Ticket" width={16} height={16} />
          </div>
        </div>
      </div>
    </Link>
  );
}
