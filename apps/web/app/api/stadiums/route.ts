import { NextResponse } from 'next/server';
import { prisma } from '@ticketuniverse/database';

export async function GET() {
  try {
    const stadiums = await prisma.stadium.findMany({
      orderBy: { name: 'asc' },
      include: {
        _count: { select: { matches: true } }
      }
    });

    return NextResponse.json({ stadiums });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch stadiums' }, { status: 500 });
  }
}
