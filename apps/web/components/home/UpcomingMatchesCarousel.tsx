"use client";

import { useRef } from "react";
import Link from "next/link";
import ThumbnailCarousel from "@/components/ui/thumbnail-carousel";

export default function UpcomingMatchesCarousel({ matches }: { matches: any[] }) {
  return (
    <div className="w-full py-16 bg-transparent">
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

        <ThumbnailCarousel matches={matches} />
      </div>
    </div>
  );
}
