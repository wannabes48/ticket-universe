import Link from "next/link";
import { Home, Search, MapPin, CalendarDays } from "lucide-react";
import Image from "next/image";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-transparent flex items-center justify-center pt-24 pb-20 px-6">
      <div className="max-w-3xl w-full text-center">
        {/* Large 404 Graphic */}
        <div className="relative mb-8 inline-block">
          <h1 className="text-9xl md:text-[12rem] font-black tracking-tighter text-primary/10 select-none">404</h1>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="bg-background border-4 border-primary rounded-full w-32 h-32 md:w-48 md:h-48 flex items-center justify-center shadow-2xl">
              <span className="text-5xl md:text-7xl">🟥</span>
            </div>
          </div>
        </div>

        {/* Text Content */}
        <h2 className="text-3xl md:text-5xl font-black mb-4 tracking-tight">Red Card! Page not found.</h2>
        <p className="text-xl text-muted-foreground mb-10 max-w-xl mx-auto">
          It looks like the referee blew the whistle on this page. The link may be broken, or the page may have been removed.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
          <Link 
            href="/" 
            className="w-full sm:w-auto bg-primary text-primary-foreground px-8 py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-primary/90 transition-all hover:scale-105 shadow-lg shadow-primary/25"
          >
            <Home className="w-5 h-5" /> Return to Home
          </Link>
          <Link 
            href="/matches" 
            className="w-full sm:w-auto bg-card border border-border text-foreground px-8 py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-muted transition-all hover:scale-105 shadow-sm"
          >
            <Search className="w-5 h-5" /> Browse Matches
          </Link>
        </div>

        {/* Quick Links */}
        <div className="border-t border-border pt-10">
          <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-6">Popular Destinations</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Link href="/cities" className="bg-card border border-border rounded-xl p-4 flex flex-col items-center justify-center gap-2 hover:border-primary hover:text-primary transition-colors group">
              <MapPin className="w-6 h-6 text-muted-foreground group-hover:text-primary transition-colors" />
              <span className="font-semibold text-sm">Host Cities</span>
            </Link>
            <Link href="/stadiums" className="bg-card border border-border rounded-xl p-4 flex flex-col items-center justify-center gap-2 hover:border-primary hover:text-primary transition-colors group">
              <Image src="/custom-ticket.png" alt="Ticket" width={24} height={24} className="opacity-50 group-hover:opacity-100 transition-opacity" />
              <span className="font-semibold text-sm">Stadiums</span>
            </Link>
            <Link href="/schedule" className="bg-card border border-border rounded-xl p-4 flex flex-col items-center justify-center gap-2 hover:border-primary hover:text-primary transition-colors group">
              <CalendarDays className="w-6 h-6 text-muted-foreground group-hover:text-primary transition-colors" />
              <span className="font-semibold text-sm">Tournament Schedule</span>
            </Link>
            <Link href="/faq" className="bg-card border border-border rounded-xl p-4 flex flex-col items-center justify-center gap-2 hover:border-primary hover:text-primary transition-colors group">
              <div className="w-6 h-6 rounded-full border-2 border-muted-foreground flex items-center justify-center text-xs font-black group-hover:border-primary group-hover:text-primary transition-colors">?</div>
              <span className="font-semibold text-sm">Help & FAQ</span>
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
