import { NextResponse } from 'next/server';
import { prisma } from '@ticketuniverse/database';

export async function GET() {
  try {
    const teams = await prisma.team.findMany({
      orderBy: { name: 'asc' },
      include: {
        _count: {
          select: { homeMatches: true, awayMatches: true }
        }
      }
    });

    const enrichedTeams = teams.map(t => ({
      ...t,
      totalMatches: t._count.homeMatches + t._count.awayMatches
    }));
    
    return NextResponse.json({ teams: enrichedTeams });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch teams' }, { status: 500 });
  }
}
