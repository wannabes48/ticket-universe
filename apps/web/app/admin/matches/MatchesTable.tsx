"use client";

import { useState } from "react";
import { format } from "date-fns";
import { Search, Edit3, PlusCircle, X, Shield, Users } from "lucide-react";
import { updateMatchKickoff, addAdminInventory } from "../actions";

export default function MatchesTable({ matches }: { matches: any[] }) {
  const [searchTerm, setSearchTerm] = useState("");
  
  const [editingMatch, setEditingMatch] = useState<any | null>(null);
  const [newDateStr, setNewDateStr] = useState("");

  const [addingInventory, setAddingInventory] = useState<any | null>(null);
  const [invQty, setInvQty] = useState(10);
  const [invCat, setInvCat] = useState("CAT1");
  const [invPrice, setInvPrice] = useState(1500);
  
  const [isUpdating, setIsUpdating] = useState(false);

  const filteredMatches = matches.filter(m => 
    m.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    m.stadium.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.city.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleUpdateKickoff = async () => {
    if (!editingMatch || !newDateStr) return;
    setIsUpdating(true);
    await updateMatchKickoff(editingMatch.id, new Date(newDateStr).toISOString());
    setIsUpdating(false);
    setEditingMatch(null);
  };

  const handleAddInventory = async () => {
    if (!addingInventory) return;
    setIsUpdating(true);
    await addAdminInventory(addingInventory.id, invQty, invCat, invPrice);
    setIsUpdating(false);
    setAddingInventory(null);
  };

  return (
    <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden flex flex-col">
      {/* Toolbar */}
      <div className="p-4 border-b border-border flex justify-between items-center bg-muted/30">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input 
            type="text" 
            placeholder="Search teams, stadium, or city..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-muted-foreground uppercase bg-muted/50 border-b border-border">
            <tr>
              <th className="px-6 py-4 font-semibold">Match</th>
              <th className="px-6 py-4 font-semibold">Venue</th>
              <th className="px-6 py-4 font-semibold">Kickoff (UTC)</th>
              <th className="px-6 py-4 font-semibold">Inventory (Admin / Seller)</th>
              <th className="px-6 py-4 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredMatches.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-muted-foreground">
                  No matches found.
                </td>
              </tr>
            ) : (
              filteredMatches.map(m => (
                <tr key={m.id} className="border-b border-border hover:bg-muted/30 transition-colors">
                  <td className="px-6 py-4">
                    <div className="text-xs text-primary font-bold mb-0.5">Match {m.matchNumber} • {m.round.replace(/_/g, ' ')}</div>
                    <div className="font-bold text-foreground text-base">{m.title}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-medium text-foreground">{m.stadium}</div>
                    <div className="text-muted-foreground text-xs">{m.city}</div>
                  </td>
                  <td className="px-6 py-4 font-medium text-foreground">
                    {format(new Date(m.kickoffUtc), "MMM d, yyyy HH:mm")}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-purple-500 bg-purple-500/10 px-2 py-1 rounded">
                        <Shield className="w-3 h-3" /> {m.adminInventoryCount}
                      </div>
                      <div className="flex items-center gap-1.5 text-xs font-bold text-blue-500 bg-blue-500/10 px-2 py-1 rounded">
                        <Users className="w-3 h-3" /> {m.sellerInventoryCount}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right flex items-center justify-end gap-2 h-full pt-6">
                    <button 
                      onClick={() => {
                        setEditingMatch(m);
                        setNewDateStr(new Date(m.kickoffUtc).toISOString().slice(0, 16));
                      }}
                      className="text-muted-foreground hover:text-foreground p-1.5 rounded-md hover:bg-muted transition-colors"
                      title="Edit Kickoff Time"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => setAddingInventory(m)}
                      className="text-primary hover:bg-primary/10 px-3 py-1.5 rounded-md font-medium text-xs transition-colors inline-flex items-center gap-1.5"
                    >
                      <PlusCircle className="w-3.5 h-3.5" /> Add VIP Inv
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Edit Date Modal */}
      {editingMatch && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-card w-full max-w-md rounded-2xl shadow-2xl p-6 border border-border">
            <h3 className="text-lg font-bold mb-4">Edit Kickoff Time</h3>
            <p className="text-sm text-muted-foreground mb-4">Match {editingMatch.matchNumber}: {editingMatch.title}</p>
            <div className="mb-6">
              <label className="block text-xs font-bold text-muted-foreground uppercase mb-2">Local UTC Time</label>
              <input 
                type="datetime-local" 
                value={newDateStr}
                onChange={(e) => setNewDateStr(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-border bg-background focus:ring-2 focus:ring-primary/50"
              />
            </div>
            <div className="flex gap-3 justify-end">
              <button onClick={() => setEditingMatch(null)} className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground">Cancel</button>
              <button onClick={handleUpdateKickoff} disabled={isUpdating} className="px-4 py-2 bg-primary text-primary-foreground text-sm font-bold rounded-lg disabled:opacity-50">Save Changes</button>
            </div>
          </div>
        </div>
      )}

      {/* Add Inventory Modal */}
      {addingInventory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-card w-full max-w-md rounded-2xl shadow-2xl p-6 border border-border">
            <h3 className="text-lg font-bold mb-4">Add Platform Inventory</h3>
            <p className="text-sm text-muted-foreground mb-4">Inject secure, admin-owned ticket listings for {addingInventory.title}.</p>
            
            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-xs font-bold text-muted-foreground uppercase mb-2">Category</label>
                <select value={invCat} onChange={e => setInvCat(e.target.value)} className="w-full px-4 py-2 rounded-lg border border-border bg-background">
                  <option value="CAT1">Category 1</option>
                  <option value="CAT2">Category 2</option>
                  <option value="CAT3">Category 3</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-muted-foreground uppercase mb-2">Price (USD)</label>
                  <input type="number" value={invPrice} onChange={e => setInvPrice(Number(e.target.value))} className="w-full px-4 py-2 rounded-lg border border-border bg-background" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-muted-foreground uppercase mb-2">Quantity (# tickets)</label>
                  <input type="number" value={invQty} onChange={e => setInvQty(Number(e.target.value))} className="w-full px-4 py-2 rounded-lg border border-border bg-background" />
                </div>
              </div>
            </div>

            <div className="flex gap-3 justify-end">
              <button onClick={() => setAddingInventory(null)} className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground">Cancel</button>
              <button onClick={handleAddInventory} disabled={isUpdating} className="px-4 py-2 bg-primary text-primary-foreground text-sm font-bold rounded-lg disabled:opacity-50 flex items-center gap-2"><PlusCircle className="w-4 h-4"/> Create Listings</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
