"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { ChevronDown, ChevronUp, CheckCircle2, ShieldCheck } from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface TicketListingRowProps {
  listing: any;
  matchSlug: string;
  isExpanded: boolean;
  onToggle: () => void;
}

import { Button } from "./ui/button";

export function TicketListingRow({ listing, matchSlug, isExpanded, onToggle }: TicketListingRowProps) {
  const router = useRouter();
  const [isPending, startTransition] = React.useTransition();

  const handleBuy = (e: React.MouseEvent) => {
    e.stopPropagation();
    startTransition(() => {
      router.push(`/matches/${matchSlug}/checkout?listingId=${listing.id}`);
    });
  };

  return (
    <React.Fragment>
      <tr 
        onClick={onToggle}
        className={cn(
          "cursor-pointer transition-colors hover:bg-muted/30 border-b border-border/50",
          isExpanded ? "bg-primary/5" : ""
        )}
      >
        <td className="px-4 py-3 font-semibold">
          <div className="flex items-center gap-2">
            <span className={cn(
              "w-2 h-2 rounded-full shrink-0",
              listing.category === 'CAT1' ? "bg-purple-500" :
              listing.category === 'CAT2' ? "bg-blue-500" :
              listing.category === 'CAT3' ? "bg-green-500" :
              listing.category === 'ACCESSIBILITY' ? "bg-yellow-500" : "bg-orange-500"
            )} />
            {listing.category.replace('CAT', 'Cat ').replace('ACCESSIBILITY', 'Access.')}
          </div>
        </td>
        <td className="px-4 py-3 text-muted-foreground hidden md:table-cell">{listing.section || '—'}</td>
        <td className="px-4 py-3 text-muted-foreground hidden md:table-cell">{listing.row || '—'}</td>
        <td className="px-4 py-3 text-center font-bold">{listing.quantity}</td>
        <td className="px-4 py-3 text-right font-bold text-primary">${listing.pricePerTicket.toFixed(2)}</td>
        <td className="px-4 py-3 text-right">
          <div className="flex items-center justify-end gap-2">
            <Button
              size="sm"
              isLoading={isPending}
              onClick={handleBuy}
            >
              Buy
            </Button>
            {isExpanded ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
          </div>
        </td>
      </tr>

      {isExpanded && (
        <tr className="bg-primary/5">
          <td colSpan={7} className="p-0">
            <div className="p-4 px-6 border-l-4 border-primary/50 animate-in slide-in-from-top-2 flex flex-col md:flex-row gap-6">
              
              <div className="flex-1 space-y-2">
                <h4 className="font-bold text-sm uppercase tracking-wider text-muted-foreground">Seat Details</h4>
                <div className="bg-background border border-border p-3 rounded-lg flex gap-4">
                  <div>
                    <p className="text-xs text-muted-foreground">Category</p>
                    <p className="font-bold">{listing.category.replace('CAT', 'Cat ')}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Block</p>
                    <p className="font-bold">{listing.section || 'General'}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Row</p>
                    <p className="font-bold">{listing.row || 'General'}</p>
                  </div>
                </div>
              </div>

              <div className="flex-1 space-y-2">
                <h4 className="font-bold text-sm uppercase tracking-wider text-muted-foreground">Delivery</h4>
                <div className="bg-background border border-border p-3 rounded-lg flex items-center gap-3">
                  <Image src="/custom-ticket.png" alt="Ticket" width={24} height={24} />
                  <div>
                    <p className="font-bold">{listing.deliveryMethod.replace(/_/g, ' ')}</p>
                    <p className="text-xs text-muted-foreground">Guaranteed in time for the match</p>
                  </div>
                </div>
              </div>

              <div className="flex-1 space-y-2">
                <h4 className="font-bold text-sm uppercase tracking-wider text-muted-foreground">Seller</h4>
                <div className="bg-background border border-border p-3 rounded-lg flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-green-500/10 flex items-center justify-center text-green-500">
                    <ShieldCheck className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="font-bold flex items-center gap-1">Verified Seller <CheckCircle2 className="w-3 h-3 text-green-500" /></p>
                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                      <span className="text-yellow-500">★★★★★</span> 4.9/5 Rating
                    </p>
                  </div>
                </div>
              </div>

            </div>
          </td>
        </tr>
      )}
    </React.Fragment>
  );
}
