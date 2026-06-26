"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { Search, SlidersHorizontal, X } from "lucide-react";

export default function MatchFilters({ teams, stadiums }: { teams: any[], stadiums: any[] }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Determine unique cities from stadiums
  const cities = Array.from(new Set(stadiums.map(s => s.city))).sort();

  const [isOpen, setIsOpen] = useState(false);
  const [localFilters, setLocalFilters] = useState<Record<string, string>>({});
  const [teamSearch, setTeamSearch] = useState("");

  // Sync state from URL
  useEffect(() => {
    const params: Record<string, string> = {};
    searchParams.forEach((value, key) => {
      params[key] = value;
    });
    setLocalFilters(params);
  }, [searchParams]);

  const updateFilter = (key: string, value: string | null) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    
    setLocalFilters(prev => {
      const next = { ...prev };
      if (value) next[key] = value;
      else delete next[key];
      return next;
    });

    router.push(pathname + "?" + params.toString(), { scroll: false });
  };

  const toggleArrayFilter = (key: string, item: string) => {
    const current = localFilters[key] ? localFilters[key].split(',') : [];
    const newArr = current.includes(item) ? current.filter(x => x !== item) : [...current, item];
    updateFilter(key, newArr.length > 0 ? newArr.join(',') : null);
  };

  const isChecked = (key: string, item: string) => {
    const current = localFilters[key] ? localFilters[key].split(',') : [];
    return current.includes(item);
  };

  const clearFilters = () => {
    router.push(pathname, { scroll: false });
  };

  const rounds = [
    { value: "GROUP_STAGE", label: "Group Stage (Groups A-L)" },
    { value: "ROUND_OF_32", label: "Round of 32" },
    { value: "ROUND_OF_16", label: "Round of 16" },
    { value: "QUARTER_FINALS", label: "Quarter-Finals" },
    { value: "SEMI_FINALS", label: "Semi-Finals" },
    { value: "THIRD_PLACE", label: "Third-Place Play-Off" },
    { value: "FINAL", label: "Final" }
  ];
  const countries = ["USA", "MEX", "CAN"];
  const categories = ["Category 1", "Category 2", "Category 3", "Category 4", "Accessibility"];

  return (
    <>
      {/* Mobile Toggle */}
      <button 
        className="lg:hidden w-full bg-card border border-border py-3 px-4 rounded-xl flex items-center justify-between font-bold mb-6"
        onClick={() => setIsOpen(true)}
      >
        <span className="flex items-center gap-2"><SlidersHorizontal className="w-5 h-5"/> Filters</span>
        {Array.from(searchParams.keys()).length > 0 && (
          <span className="bg-primary text-primary-foreground text-xs px-2 py-1 rounded-full">Active</span>
        )}
      </button>

      {/* Filter Sidebar / Sheet */}
      <div className={`fixed inset-y-0 left-0 z-50 w-[300px] bg-background border-r border-border transform transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0 lg:w-full lg:border-none lg:bg-transparent lg:z-0 flex flex-col h-full ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        
        <div className="flex items-center justify-between p-4 border-b border-border lg:hidden">
          <h2 className="font-bold text-lg flex items-center gap-2"><SlidersHorizontal className="w-5 h-5"/> Filters</h2>
          <button onClick={() => setIsOpen(false)} className="p-2 bg-muted rounded-full text-muted-foreground"><X className="w-5 h-5"/></button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 lg:p-0 space-y-6 lg:bg-card lg:border lg:border-border lg:rounded-2xl lg:p-6 lg:shadow-sm hide-scrollbar">
          
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-bold">Filter Matches</h3>
            {Array.from(searchParams.keys()).length > 0 && (
              <button onClick={clearFilters} className="text-xs text-primary font-semibold hover:underline">Clear all</button>
            )}
          </div>

          {/* Date Range */}
          <div>
            <h4 className="text-sm font-semibold mb-3 text-muted-foreground uppercase tracking-wider">Date Range</h4>
            <div className="grid grid-cols-2 gap-2">
              <input type="date" className="w-full bg-muted border border-border rounded-lg p-2 text-sm focus:ring-1 focus:ring-primary outline-none" value={localFilters.dateFrom || ""} onChange={(e) => updateFilter('dateFrom', e.target.value)} />
              <input type="date" className="w-full bg-muted border border-border rounded-lg p-2 text-sm focus:ring-1 focus:ring-primary outline-none" value={localFilters.dateTo || ""} onChange={(e) => updateFilter('dateTo', e.target.value)} />
            </div>
          </div>

          {/* Price Range */}
          <div>
            <h4 className="text-sm font-semibold mb-3 text-muted-foreground uppercase tracking-wider">Price Range</h4>
            <div className="flex items-center gap-4 mb-2">
              <span className="text-sm font-medium">${localFilters.priceMin || 100}</span>
              <input 
                type="range" 
                min="100" 
                max="10000" 
                step="50" 
                className="w-full accent-primary" 
                value={localFilters.priceMax || 10000} 
                onChange={(e) => setLocalFilters(prev => ({ ...prev, priceMax: e.target.value }))}
                onMouseUp={(e) => updateFilter('priceMax', (e.target as HTMLInputElement).value)}
                onTouchEnd={(e) => updateFilter('priceMax', (e.target as HTMLInputElement).value)}
              />
              <span className="text-sm font-medium">${localFilters.priceMax || "10k+"}</span>
            </div>
          </div>

          {/* Quantity */}
          <div>
            <h4 className="text-sm font-semibold mb-3 text-muted-foreground uppercase tracking-wider">Quantity</h4>
            <div className="flex gap-2">
              {["1", "2", "3", "4+"].map(q => (
                <button 
                  key={q} 
                  onClick={() => updateFilter('quantity', q)}
                  className={`flex-1 py-2 rounded-lg border text-sm font-medium transition-colors ${localFilters.quantity === q ? 'bg-primary text-primary-foreground border-primary' : 'bg-background border-border hover:border-primary/50 text-foreground'}`}
                >
                  {q}
                </button>
              ))}
            </div>
          </div>

          {/* Round */}
          <div>
            <h4 className="text-sm font-semibold mb-3 text-muted-foreground uppercase tracking-wider">Tournament Round</h4>
            <div className="space-y-2">
              {rounds.map(round => (
                <label key={round.value} className="flex items-center gap-3 cursor-pointer group" onClick={() => toggleArrayFilter('rounds', round.value)}>
                  <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${isChecked('rounds', round.value) ? 'bg-primary border-primary' : 'border-border bg-background group-hover:border-primary/50'}`}>
                    {isChecked('rounds', round.value) && <div className="w-2.5 h-2.5 bg-white rounded-sm" />}
                  </div>
                  <span className="text-sm font-medium text-foreground/80 group-hover:text-foreground">{round.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Team */}
          <div>
            <h4 className="text-sm font-semibold mb-3 text-muted-foreground uppercase tracking-wider">Team</h4>
            <div className="relative mb-3">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input type="text" placeholder="Search teams..." className="w-full bg-background border border-border rounded-lg pl-9 pr-3 py-2 text-sm focus:ring-1 focus:ring-primary outline-none" value={teamSearch} onChange={e => setTeamSearch(e.target.value)} />
            </div>
            <div className="max-h-40 overflow-y-auto space-y-2 hide-scrollbar">
              {teams.filter(t => t.name.toLowerCase().includes(teamSearch.toLowerCase())).map(team => (
                <label key={team.id} className="flex items-center gap-3 cursor-pointer group" onClick={() => toggleArrayFilter('teams', team.id)}>
                  <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${isChecked('teams', team.id) ? 'bg-primary border-primary' : 'border-border bg-background group-hover:border-primary/50'}`}>
                    {isChecked('teams', team.id) && <div className="w-2.5 h-2.5 bg-white rounded-sm" />}
                  </div>
                  <span className="text-sm font-medium text-foreground/80 group-hover:text-foreground">{team.name}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Host Country */}
          <div>
            <h4 className="text-sm font-semibold mb-3 text-muted-foreground uppercase tracking-wider">Host Country</h4>
            <div className="space-y-2">
              {countries.map(country => (
                <label key={country} className="flex items-center gap-3 cursor-pointer group" onClick={() => toggleArrayFilter('countries', country)}>
                  <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${isChecked('countries', country) ? 'bg-primary border-primary' : 'border-border bg-background group-hover:border-primary/50'}`}>
                    {isChecked('countries', country) && <div className="w-2.5 h-2.5 bg-white rounded-sm" />}
                  </div>
                  <span className="text-sm font-medium text-foreground/80 group-hover:text-foreground">{country === 'USA' ? 'United States' : country === 'MEX' ? 'Mexico' : 'Canada'}</span>
                </label>
              ))}
            </div>
          </div>

          {/* City */}
          <div>
            <h4 className="text-sm font-semibold mb-3 text-muted-foreground uppercase tracking-wider">Host City</h4>
            <div className="max-h-40 overflow-y-auto space-y-2 hide-scrollbar">
              {cities.map(city => (
                <label key={city as string} className="flex items-center gap-3 cursor-pointer group" onClick={() => toggleArrayFilter('cities', city as string)}>
                  <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${isChecked('cities', city as string) ? 'bg-primary border-primary' : 'border-border bg-background group-hover:border-primary/50'}`}>
                    {isChecked('cities', city as string) && <div className="w-2.5 h-2.5 bg-white rounded-sm" />}
                  </div>
                  <span className="text-sm font-medium text-foreground/80 group-hover:text-foreground">{city as string}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Stadium */}
          <div>
            <h4 className="text-sm font-semibold mb-3 text-muted-foreground uppercase tracking-wider">Stadium</h4>
            <div className="max-h-40 overflow-y-auto space-y-2 hide-scrollbar">
              {stadiums.map(stadium => (
                <label key={stadium.id} className="flex items-center gap-3 cursor-pointer group" onClick={() => toggleArrayFilter('stadiums', stadium.name)}>
                  <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${isChecked('stadiums', stadium.name) ? 'bg-primary border-primary' : 'border-border bg-background group-hover:border-primary/50'}`}>
                    {isChecked('stadiums', stadium.name) && <div className="w-2.5 h-2.5 bg-white rounded-sm" />}
                  </div>
                  <span className="text-sm font-medium text-foreground/80 group-hover:text-foreground">{stadium.name}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Category */}
          <div>
            <h4 className="text-sm font-semibold mb-3 text-muted-foreground uppercase tracking-wider">Ticket Category</h4>
            <div className="space-y-2">
              {categories.map(cat => (
                <label key={cat} className="flex items-center gap-3 cursor-pointer group" onClick={() => toggleArrayFilter('categories', cat)}>
                  <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${isChecked('categories', cat) ? 'bg-primary border-primary' : 'border-border bg-background group-hover:border-primary/50'}`}>
                    {isChecked('categories', cat) && <div className="w-2.5 h-2.5 bg-white rounded-sm" />}
                  </div>
                  <span className="text-sm font-medium text-foreground/80 group-hover:text-foreground">{cat}</span>
                </label>
              ))}
            </div>
          </div>

        </div>
        
        <div className="p-4 border-t border-border lg:hidden bg-card">
          <button onClick={() => setIsOpen(false)} className="w-full bg-primary text-primary-foreground py-3 rounded-xl font-bold">Apply Filters</button>
        </div>
      </div>

      {isOpen && (
        <div className="fixed inset-0 bg-black/60 z-40 lg:hidden" onClick={() => setIsOpen(false)} />
      )}
    </>
  );
}
