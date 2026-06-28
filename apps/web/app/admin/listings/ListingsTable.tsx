"use client";

import { useState } from "react";
import { format } from "date-fns";
import { Search, CheckCircle, XCircle, AlertTriangle, ShieldAlert } from "lucide-react";
import { approveListing, rejectListing } from "../actions";

export default function ListingsTable({ listings }: { listings: any[] }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("ALL");
  const [isUpdating, setIsUpdating] = useState<string | null>(null);

  const filteredListings = listings.filter(l => {
    const matchesSearch = 
      l.sellerEmail.toLowerCase().includes(searchTerm.toLowerCase()) || 
      l.matchTitle.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (filterType === "SUSPICIOUS") return matchesSearch && l.isSuspicious;
    if (filterType === "REMOVED") return matchesSearch && l.status === "REMOVED";
    if (filterType === "ACTIVE") return matchesSearch && l.status === "ACTIVE";
    return matchesSearch;
  });

  const handleAction = async (actionFn: (id: string) => Promise<void>, id: string) => {
    setIsUpdating(id);
    try {
      await actionFn(id);
      setIsUpdating(null);
    } catch (e) {
      console.error(e);
      setIsUpdating(null);
    }
  };

  return (
    <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden flex flex-col">
      {/* Toolbar */}
      <div className="p-4 border-b border-border flex flex-col sm:flex-row gap-4 justify-between items-center bg-muted/30">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input 
            type="text" 
            placeholder="Search seller or match..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
        </div>
        <select 
          value={filterType} 
          onChange={(e) => setFilterType(e.target.value)}
          className="w-full sm:w-auto px-4 py-2 rounded-lg border border-border bg-background text-sm focus:outline-none"
        >
          <option value="ALL">All Moderation Items</option>
          <option value="ACTIVE">Active (Live)</option>
          <option value="SUSPICIOUS">Suspicious Only</option>
          <option value="REMOVED">Removed / Rejected</option>
        </select>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-muted-foreground uppercase bg-muted/50 border-b border-border">
            <tr>
              <th className="px-6 py-4 font-semibold">Seller</th>
              <th className="px-6 py-4 font-semibold">Match & Seat</th>
              <th className="px-6 py-4 font-semibold">Price</th>
              <th className="px-6 py-4 font-semibold">Risk Level</th>
              <th className="px-6 py-4 font-semibold">Status</th>
              <th className="px-6 py-4 font-semibold text-right">Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredListings.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center text-muted-foreground">
                  No listings found.
                </td>
              </tr>
            ) : (
              filteredListings.map(l => (
                <tr key={l.id} className={`border-b border-border hover:bg-muted/30 transition-colors ${l.isSuspicious && l.status === 'ACTIVE' ? 'bg-orange-500/5' : ''}`}>
                  <td className="px-6 py-4">
                    <div className="font-medium text-foreground">{l.sellerEmail}</div>
                    <div className="text-muted-foreground text-xs">{l.sellerKyc}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-medium">{l.matchTitle}</div>
                    <div className="text-muted-foreground text-xs">{l.quantity}x {l.category} • {l.section || 'General'}</div>
                  </td>
                  <td className="px-6 py-4 font-bold text-foreground">${l.pricePerTicket.toLocaleString()}</td>
                  <td className="px-6 py-4">
                    {l.isSuspicious ? (
                      <span className="flex items-center gap-1.5 text-orange-500 font-bold text-xs"><ShieldAlert className="w-4 h-4"/> FLAG</span>
                    ) : (
                      <span className="text-muted-foreground text-xs">Standard</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${l.status === 'ACTIVE' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-destructive/10 text-destructive'}`}>
                      {l.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    {l.status === 'ACTIVE' ? (
                      <button 
                        onClick={() => handleAction(rejectListing, l.id)}
                        disabled={isUpdating === l.id}
                        className="text-destructive hover:bg-destructive/10 px-3 py-1.5 rounded-md font-medium text-xs transition-colors disabled:opacity-50 inline-flex items-center gap-1.5"
                      >
                        <XCircle className="w-3.5 h-3.5" /> Remove
                      </button>
                    ) : (
                      <button 
                        onClick={() => handleAction(approveListing, l.id)}
                        disabled={isUpdating === l.id}
                        className="text-emerald-500 hover:bg-emerald-500/10 px-3 py-1.5 rounded-md font-medium text-xs transition-colors disabled:opacity-50 inline-flex items-center gap-1.5"
                      >
                        <CheckCircle className="w-3.5 h-3.5" /> Restore
                      </button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
