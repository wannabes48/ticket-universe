import { NextResponse } from 'next/server';
import { prisma } from '@ticketuniverse/database';

export async function GET(request: Request, { params }: { params: { slug: string } }) {
  try {
    const team = await prisma.team.findUnique({
      where: { slug: params.slug },
      include: {
        homeMatches: { include: { awayTeam: true, stadium: true } },
        awayMatches: { include: { homeTeam: true, stadium: true } }
      }
    });

    if (!team) {
      return NextResponse.json({ error: 'Team not found' }, { status: 404 });
    }

    const allMatches = [...team.homeMatches, ...team.awayMatches].sort(
      (a, b) => new Date(a.kickoffUtc).getTime() - new Date(b.kickoffUtc).getTime()
    );

    return NextResponse.json({ team, matches: allMatches });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch team' }, { status: 500 });
  }
}
