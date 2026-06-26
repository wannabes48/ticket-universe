import { prisma } from "@ticketuniverse/database";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Calendar, MapPin, ShieldCheck, ChevronRight, CheckCircle2, Clock, ExternalLink } from "lucide-react";
import { LocalTime } from "@/components/local-time";
import MatchDetailClient, { TicketTable } from "./MatchDetailClient";
import { TrustBadgeStrip } from "@/components/trust-badge-strip";

export default async function MatchDetailPage({ params }: { params: { matchSlug: string } }) {
  const match = await prisma.match.findUnique({
    where: { slug: params.matchSlug },
    include: {
      homeTeam: true,
      awayTeam: true,
      stadium: true,
      listings: {
        orderBy: { pricePerTicket: 'asc' }
      }
    }
  });

  if (!match) notFound();
  const stadiumInteractiveMapUrl = (match.stadium as any).interactiveMapUrl;

  return (
    <main className="min-h-screen bg-background">
      {/* Above the Fold: Match Header */}
      <div className="bg-[#1a1a2e] text-white pt-24 pb-12 relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-5xl h-[500px] bg-primary/20 rounded-full blur-[100px] -z-10" />
        
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-white/60 mb-8">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <ChevronRight className="w-4 h-4" />
            <Link href="/matches" className="hover:text-white transition-colors">Matches</Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-white/80">{match.round.replace('_', ' ')}</span>
            <ChevronRight className="w-4 h-4" />
            <span className="font-semibold text-white">{match.homeTeam.name} vs {match.awayTeam.name}</span>
          </div>

          <div className="flex flex-col md:flex-row items-center justify-between gap-12">
            {/* Teams Header */}
            <div className="flex-1 flex flex-col items-center md:items-start text-center md:text-left">
              <div className="text-primary font-bold tracking-widest uppercase text-sm mb-4">
                {match.round.replace('_', ' ')}
              </div>
              
              <div className="flex items-center gap-6 mb-6">
                <div className="w-24 h-24 relative bg-white rounded-full p-2 shadow-lg flex items-center justify-center overflow-hidden">
                  {match.homeTeam.flagUrl ? (
                    <Image src={match.homeTeam.flagUrl} alt={match.homeTeam.name} fill className="object-cover" />
                  ) : (
                    <span className="text-muted-foreground font-bold">{match.homeTeam.countryCode}</span>
                  )}
                </div>
                <div className="text-3xl font-black text-white/50">VS</div>
                <div className="w-24 h-24 relative bg-white rounded-full p-2 shadow-lg flex items-center justify-center overflow-hidden">
                  {match.awayTeam.flagUrl ? (
                    <Image src={match.awayTeam.flagUrl} alt={match.awayTeam.name} fill className="object-cover" />
                  ) : (
                    <span className="text-muted-foreground font-bold">{match.awayTeam.countryCode}</span>
                  )}
                </div>
              </div>
              
              <h1 className="text-4xl md:text-6xl font-black tracking-tighter mb-4">
                {match.homeTeam.name} <span className="text-white/50 text-3xl md:text-5xl">vs</span> {match.awayTeam.name}
              </h1>

              <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-white/80 font-medium">
                <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-lg">
                  <Calendar className="w-4 h-4 text-primary" />
                  <LocalTime date={match.kickoffUtc} />
                </div>
                <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-lg">
                  <MapPin className="w-4 h-4 text-primary" />
                  {match.stadium.city}, {match.stadium.countryCode}
                </div>
              </div>
            </div>

            {/* Countdown Component Container */}
            <div className="bg-black/40 backdrop-blur-md border border-white/10 rounded-2xl p-6 text-center shadow-2xl shrink-0 w-full md:w-80">
              <div className="flex items-center justify-center gap-2 text-white/80 mb-4 font-semibold uppercase tracking-wider text-sm">
                <Clock className="w-4 h-4" /> Time to Kickoff
              </div>
              <MatchDetailClient matchDate={match.kickoffUtc} listings={match.listings} matchSlug={match.slug} />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 lg:grid-cols-3 gap-12">
        
        {/* Left Column: Tickets & Filter */}
        <div className="lg:col-span-2 space-y-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 md:gap-4 mb-4 mt-12">
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <Image src="/custom-ticket.png" alt="Ticket" width={24} height={24} /> Available Tickets
            </h2>
            <p className="text-sm text-muted-foreground">Prices include all taxes. A 10% service fee applies at checkout.</p>
          </div>

          <TicketTable listings={match.listings} matchSlug={match.slug} />
        </div>

        {/* Right Column: Sidebar Info */}
        <div className="lg:col-span-1 space-y-6">
          {/* Stadium Info Panel */}
          <div className="bg-card border border-border rounded-xl overflow-hidden shadow-sm">
            <div className="bg-muted px-6 py-4 border-b border-border font-bold flex items-center gap-2">
              <MapPin className="text-primary w-5 h-5" /> Venue Information
            </div>
            <div className="p-6">
              <Link href={`/stadiums/${match.stadium.slug}`} className="text-xl font-black hover:text-primary transition-colors block mb-2">
                {match.stadium.name}
              </Link>
              <p className="text-muted-foreground text-sm mb-6">{match.stadium.city}, {match.stadium.countryCode}</p>
              
              <div className="flex items-center justify-between text-sm mb-6">
                <span className="text-muted-foreground">Capacity</span>
                <span className="font-bold">{match.stadium.capacity.toLocaleString()}</span>
              </div>

              {/* Stadium Map Embed */}
              {match.stadium.mapUrl ? (
                <div className="w-full h-48 border border-border rounded-lg mb-6 relative overflow-hidden flex items-center justify-center group bg-white p-2">
                  <Image src={match.stadium.mapUrl} alt={`Map of ${match.stadium.name}`} fill className="object-contain p-2" />
                  {stadiumInteractiveMapUrl && (
                    <a 
                      href={stadiumInteractiveMapUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <span className="text-white font-bold text-sm bg-primary px-4 py-2 rounded-lg shadow-md">View Interactive Map</span>
                    </a>
                  )}
                </div>
              ) : (
                <div className="w-full h-48 bg-muted border border-border rounded-lg mb-6 relative overflow-hidden flex items-center justify-center group">
                  <MapPin className="w-8 h-8 text-primary relative z-10" />
                  {stadiumInteractiveMapUrl && (
                    <a 
                      href={stadiumInteractiveMapUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <span className="text-white font-bold text-sm bg-primary px-3 py-1 rounded-md shadow-sm">View on Map</span>
                    </a>
                  )}
                </div>
              )}

              <a href="https://www.fifa.com/tournaments/mens/worldcup/canadamexicousa2026" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 w-full bg-primary/10 text-primary hover:bg-primary/20 py-3 rounded-xl font-semibold transition-colors text-sm">
                Official FIFA Travel Guide <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Guarantee Panel */}
          <div className="bg-card border border-border rounded-xl p-6 shadow-sm flex items-start gap-4">
            <ShieldCheck className="w-8 h-8 text-blue-500 shrink-0" />
            <div>
              <h4 className="font-bold mb-1 text-card-foreground">TixProtect Guarantee</h4>
              <p className="text-xs text-muted-foreground leading-relaxed mb-3">
                Every ticket is 100% guaranteed. If there is an issue at the gates, we refund you 120% of your order total.
              </p>
              <Link href="/buyer-protection" className="text-blue-500 text-xs font-bold hover:underline">Learn more</Link>
            </div>
          </div>
          
        </div>
      </div>

      {/* Trust Badges */}
      <div className="container max-w-6xl mx-auto px-4 mt-8 pb-12">
        <TrustBadgeStrip />
      </div>
    </main>
  );
}
