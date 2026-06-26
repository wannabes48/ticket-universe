import { NextResponse } from 'next/server';
import { prisma } from '@ticketuniverse/database';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q');

  if (!query) return NextResponse.json({ matches: [], teams: [], stadiums: [] });

  try {
    const [matches, teams, stadiums] = await Promise.all([
      prisma.match.findMany({
        where: {
          kickoffUtc: { gt: new Date() },
          OR: [
            { homeTeam: { name: { contains: query, mode: 'insensitive' } } },
            { awayTeam: { name: { contains: query, mode: 'insensitive' } } },
            { stadium: { name: { contains: query, mode: 'insensitive' } } },
            { stadium: { city: { contains: query, mode: 'insensitive' } } },
          ]
        },
        include: { homeTeam: true, awayTeam: true, stadium: true },
        take: 5
      }),
      prisma.team.findMany({
        where: { name: { contains: query, mode: 'insensitive' } },
        take: 5
      }),
      prisma.stadium.findMany({
        where: {
          OR: [
            { name: { contains: query, mode: 'insensitive' } },
            { city: { contains: query, mode: 'insensitive' } }
          ]
        },
        take: 5
      })
    ]);

    return NextResponse.json({ matches, teams, stadiums });
  } catch (error) {
    return NextResponse.json({ error: 'Search failed' }, { status: 500 });
  }
}
