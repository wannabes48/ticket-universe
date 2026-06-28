"use client";

import { useState } from "react";
import { format } from "date-fns";
import { Search, CheckCircle, Ban, ShieldCheck, UserX } from "lucide-react";
import { verifySellerKyc, suspendSeller } from "../actions";

export default function SellersTable({ sellers }: { sellers: any[] }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("ALL");
  const [isUpdating, setIsUpdating] = useState<string | null>(null);

  const filteredSellers = sellers.filter(s => {
    const matchesSearch = 
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      s.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (filterStatus === "PENDING") return matchesSearch && s.kycStatus === "PENDING";
    if (filterStatus === "VERIFIED") return matchesSearch && s.kycStatus === "VERIFIED";
    if (filterStatus === "SUSPENDED") return matchesSearch && s.kycStatus === "SUSPENDED";
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
            placeholder="Search seller name or email..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
        </div>
        <select 
          value={filterStatus} 
          onChange={(e) => setFilterStatus(e.target.value)}
          className="w-full sm:w-auto px-4 py-2 rounded-lg border border-border bg-background text-sm focus:outline-none"
        >
          <option value="ALL">All Sellers</option>
          <option value="VERIFIED">Verified</option>
          <option value="PENDING">Pending KYC</option>
          <option value="SUSPENDED">Suspended</option>
        </select>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-muted-foreground uppercase bg-muted/50 border-b border-border">
            <tr>
              <th className="px-6 py-4 font-semibold">Seller</th>
              <th className="px-6 py-4 font-semibold">KYC Status</th>
              <th className="px-6 py-4 font-semibold">Total Sales</th>
              <th className="px-6 py-4 font-semibold">Listings (Active/Total)</th>
              <th className="px-6 py-4 font-semibold">Joined Date</th>
              <th className="px-6 py-4 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredSellers.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center text-muted-foreground">
                  No sellers found.
                </td>
              </tr>
            ) : (
              filteredSellers.map(s => (
                <tr key={s.id} className="border-b border-border hover:bg-muted/30 transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-bold text-foreground">{s.name}</div>
                    <div className="text-muted-foreground text-xs">{s.email}</div>
                  </td>
                  <td className="px-6 py-4">
                    <KycBadge status={s.kycStatus} />
                  </td>
                  <td className="px-6 py-4 font-bold text-foreground">${s.totalSales.toLocaleString()}</td>
                  <td className="px-6 py-4 text-muted-foreground">
                    <span className="font-bold text-foreground">{s.activeListings}</span> / {s.totalListings}
                  </td>
                  <td className="px-6 py-4 text-muted-foreground">{format(new Date(s.createdAt), "MMM d, yyyy")}</td>
                  <td className="px-6 py-4 text-right flex items-center justify-end gap-2">
                    {s.kycStatus !== 'VERIFIED' && s.kycStatus !== 'SUSPENDED' && (
                      <button 
                        onClick={() => handleAction(verifySellerKyc, s.id)}
                        disabled={isUpdating === s.id}
                        className="text-emerald-500 hover:bg-emerald-500/10 px-2.5 py-1.5 rounded-md font-medium text-xs transition-colors disabled:opacity-50 inline-flex items-center gap-1.5"
                      >
                        <ShieldCheck className="w-3.5 h-3.5" /> Verify
                      </button>
                    )}
                    {s.kycStatus !== 'SUSPENDED' && (
                      <button 
                        onClick={() => handleAction(suspendSeller, s.id)}
                        disabled={isUpdating === s.id}
                        className="text-destructive hover:bg-destructive/10 px-2.5 py-1.5 rounded-md font-medium text-xs transition-colors disabled:opacity-50 inline-flex items-center gap-1.5"
                      >
                        <UserX className="w-3.5 h-3.5" /> Suspend
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

function KycBadge({ status }: { status: string }) {
  if (status === 'VERIFIED') return <span className="inline-flex items-center gap-1 px-2 py-1 rounded bg-emerald-500/10 text-emerald-500 text-[10px] font-black uppercase tracking-widest border border-emerald-500/20"><CheckCircle className="w-3 h-3"/> Verified</span>;
  if (status === 'SUSPENDED') return <span className="inline-flex items-center gap-1 px-2 py-1 rounded bg-destructive/10 text-destructive text-[10px] font-black uppercase tracking-widest border border-destructive/20"><Ban className="w-3 h-3"/> Suspended</span>;
  return <span className="inline-flex items-center gap-1 px-2 py-1 rounded bg-orange-500/10 text-orange-500 text-[10px] font-black uppercase tracking-widest border border-orange-500/20">Pending</span>;
}
