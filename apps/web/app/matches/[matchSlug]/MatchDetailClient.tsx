"use client";

import React, { useState, useEffect } from "react";
import { Clock, Ticket, AlertCircle, ShieldCheck, CheckCircle2, Navigation, ChevronDown, ChevronUp } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { CountdownTimer } from "@/components/countdown-timer";
import { TicketListingRow } from "@/components/ticket-listing-row";

// --- Countdown Component ---
export default function MatchDetailClient({ matchDate, listings, matchSlug }: { matchDate: Date, listings: any[], matchSlug: string }) {
  return (
    <div className="flex flex-col gap-6">
      
      {/* Countdown Timer */}
      <CountdownTimer targetDateUtc={matchDate} />
      
    </div>
  );
}

// --- Ticket Table Component ---
export function TicketTable({ listings, matchSlug }: { listings: any[], matchSlug: string }) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("All");
  const [expandedRow, setExpandedRow] = useState<string | null>(null);

  const categories = ["All", "Cat 1", "Cat 2", "Cat 3", "Cat 4"];

  const filteredListings = activeTab === "All" 
    ? listings 
    : listings.filter(l => l.category === activeTab);

  const toggleRow = (id: string) => {
    if (expandedRow === id) setExpandedRow(null);
    else setExpandedRow(id);
  };

  return (
    <div className="space-y-6">
      {/* Category Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setActiveTab(cat)}
            className={`whitespace-nowrap px-6 py-2.5 rounded-full font-bold text-sm transition-all duration-300 ${
              activeTab === cat 
              ? 'bg-primary text-primary-foreground shadow-md' 
              : 'bg-muted text-muted-foreground hover:bg-muted/80'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-muted text-muted-foreground text-sm border-b border-border">
                <th className="p-4 font-semibold w-12"></th>
                <th className="p-4 font-semibold">Category</th>
                <th className="p-4 font-semibold">Section/Row</th>
                <th className="p-4 font-semibold text-center">Qty</th>
                <th className="p-4 font-semibold text-right">Price/ea</th>
                <th className="p-4 font-semibold text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredListings.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-muted-foreground">
                    No tickets available for this category right now.
                  </td>
                </tr>
              ) : (
                filteredListings.map(listing => (
                  <TicketListingRow
                    key={listing.id}
                    listing={listing}
                    matchSlug={matchSlug}
                    isExpanded={expandedRow === listing.id}
                    onToggle={() => toggleRow(listing.id)}
                  />
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
