"use client";

import { useRef } from "react";
import Link from "next/link";
import MatchCard from "@/components/match-card";

export default function UpcomingMatchesCarousel({ matches }: { matches: any[] }) {
  const scrollRef = useRef<HTMLDivElement>(null);

  return (
    <div className="w-full py-16 bg-background">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <h2 className="text-3xl font-bold text-foreground mb-2">Upcoming Matches</h2>
            <p className="text-muted-foreground">1,000+ Tickets Available</p>
          </div>
          <Link href="/matches" className="text-primary font-medium hover:underline flex items-center gap-1">
            View All Matches &rarr;
          </Link>
        </div>

        <div 
          ref={scrollRef}
          className="flex overflow-x-auto snap-x snap-mandatory gap-6 pb-8 hide-scrollbar"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {matches.map(match => (
            <div key={match.id} className="flex-none w-[85vw] sm:w-[350px] lg:w-[calc(33.333%-16px)] snap-start">
              <MatchCard match={match} />
            </div>
          ))}
        </div>
        
        <style dangerouslySetInnerHTML={{__html: `
          .hide-scrollbar::-webkit-scrollbar {
            display: none;
          }
        `}} />
      </div>
    </div>
  );
}
