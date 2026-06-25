import { NextResponse } from 'next/server';
import { prisma } from '@ticketuniverse/database';

export async function GET() {
  try {
    const stadiums = await prisma.stadium.findMany({
      select: { city: true, countryCode: true, matches: { select: { id: true } } }
    });

    // Group by city to count matches
    const cityMap: Record<string, { city: string, countryCode: string, totalMatches: number }> = {};
    
    stadiums.forEach(s => {
      if (!cityMap[s.city]) {
        cityMap[s.city] = { city: s.city, countryCode: s.countryCode, totalMatches: 0 };
      }
      cityMap[s.city].totalMatches += s.matches.length;
    });

    const cities = Object.values(cityMap).sort((a, b) => a.city.localeCompare(b.city));

    return NextResponse.json({ cities });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch cities' }, { status: 500 });
  }
}
