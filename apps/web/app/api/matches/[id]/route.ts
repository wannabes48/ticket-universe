import { NextResponse } from 'next/server';
import { prisma } from '@ticketuniverse/database';

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const match = await prisma.match.findFirst({
      where: { 
        OR: [
          { id: params.id },
          { slug: params.id } // Support both id and slug lookups
        ]
      },
      include: {
        homeTeam: true,
        awayTeam: true,
        stadium: true,
        listings: true
      }
    });

    if (!match) {
      return NextResponse.json({ error: 'Match not found' }, { status: 404 });
    }

    return NextResponse.json({ match });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch match' }, { status: 500 });
  }
}
