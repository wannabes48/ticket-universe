"use client";

import { useState, useEffect, useMemo } from "react";
import MatchCard from "@/components/match-card";
import MatchFilters from "./MatchFilters";
import { useRouter, useSearchParams } from "next/navigation";
import { getPricingForRound } from "@/lib/pricing";

export default function MatchesClient({ initialMatches, teams, stadiums }: { initialMatches: any[], teams: any[], stadiums: any[] }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [sortMethod, setSortMethod] = useState("date_asc");

  const filteredMatches = useMemo(() => {
    let result = [...initialMatches];

    // Filter by Date
    const dateFrom = searchParams.get('dateFrom');
    const dateTo = searchParams.get('dateTo');
    if (dateFrom) result = result.filter(m => new Date(m.kickoffUtc) >= new Date(dateFrom));
    if (dateTo) {
      const end = new Date(dateTo);
      end.setHours(23, 59, 59);
      result = result.filter(m => new Date(m.kickoffUtc) <= end);
    }

    // Filter by Rounds
    const rounds = searchParams.get('rounds');
    if (rounds) {
      const selectedRounds = rounds.split(',');
      result = result.filter(m => selectedRounds.includes(m.round));
    }

    // Filter by Teams
    const filterTeams = searchParams.get('teams');
    if (filterTeams) {
      const selectedTeams = filterTeams.split(',');
      result = result.filter(m => selectedTeams.includes(m.homeTeamId) || selectedTeams.includes(m.awayTeamId));
    }

    // Filter by Host Country
    const countries = searchParams.get('countries');
    if (countries) {
      const selectedCountries = countries.split(',');
      result = result.filter(m => selectedCountries.includes(m.stadium.countryCode));
    }

    // Filter by City
    const cities = searchParams.get('cities');
    if (cities) {
      const selectedCities = cities.split(',');
      result = result.filter(m => selectedCities.includes(m.stadium.city));
    }

    // Filter by Stadium
    const stadiumFilters = searchParams.get('stadiums');
    if (stadiumFilters) {
      const selectedStadiums = stadiumFilters.split(',');
      result = result.filter(m => selectedStadiums.includes(m.stadium.name));
    }

    // Filter by Price Max
    const priceMax = searchParams.get('priceMax');
    if (priceMax) {
      result = result.filter(m => getPricingForRound(m.round).min <= parseInt(priceMax));
    }

    // Sorting
    result.sort((a, b) => {
      if (sortMethod === 'date_asc') return new Date(a.kickoffUtc).getTime() - new Date(b.kickoffUtc).getTime();
      if (sortMethod === 'price_asc') return getPricingForRound(a.round).min - getPricingForRound(b.round).min;
      if (sortMethod === 'price_desc') return getPricingForRound(b.round).min - getPricingForRound(a.round).min;
      if (sortMethod === 'tickets_desc') return (b.listings?.length || 0) - (a.listings?.length || 0);
      return 0;
    });

    return result;
  }, [initialMatches, searchParams, sortMethod]);

  return (
    <div className="flex flex-col lg:flex-row gap-8 items-start">
      {/* Sidebar Filters */}
      <div className="w-full lg:w-1/4 flex-shrink-0">
        <MatchFilters teams={teams} stadiums={stadiums} />
      </div>

      {/* Main Grid */}
      <div className="w-full lg:w-3/4">
        <div className="flex items-center justify-between mb-6">
          <p className="font-semibold text-foreground">{filteredMatches.length} Matches Found</p>
          <select 
            className="bg-background border border-border rounded-lg px-4 py-2 text-sm font-medium outline-none focus:ring-2 focus:ring-primary"
            value={sortMethod}
            onChange={(e) => setSortMethod(e.target.value)}
          >
            <option value="date_asc">Sort by: Date (Earliest)</option>
            <option value="price_asc">Sort by: Price (Lowest)</option>
            <option value="price_desc">Sort by: Price (Highest)</option>
            <option value="tickets_desc">Sort by: Most Tickets Available</option>
          </select>
        </div>

        {filteredMatches.length === 0 ? (
          <div className="bg-muted border border-border rounded-xl p-12 text-center flex flex-col items-center justify-center">
            <p className="text-muted-foreground font-medium text-lg">No matches found matching your criteria.</p>
            <button onClick={() => router.push('/matches')} className="mt-4 bg-primary text-primary-foreground px-6 py-2 rounded-full font-bold">Clear Filters</button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredMatches.map(match => (
              <MatchCard key={match.id} match={match} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
