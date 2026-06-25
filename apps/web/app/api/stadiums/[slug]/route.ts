import { NextResponse } from 'next/server';
import { prisma } from '@ticketuniverse/database';

export async function GET(request: Request, { params }: { params: { slug: string } }) {
  try {
    const stadium = await prisma.stadium.findUnique({
      where: { slug: params.slug },
      include: {
        matches: {
          include: { homeTeam: true, awayTeam: true }
        }
      }
    });

    if (!stadium) {
      return NextResponse.json({ error: 'Stadium not found' }, { status: 404 });
    }

    return NextResponse.json({ stadium });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch stadium' }, { status: 500 });
  }
}
