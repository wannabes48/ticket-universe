import { NextResponse } from 'next/server';
import { prisma } from '@ticketuniverse/database';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  
  const round = searchParams.get('round');
  const group = searchParams.get('group');
  const teamId = searchParams.get('teamId');
  const stadiumId = searchParams.get('stadiumId');

  const where: any = {
    kickoffUtc: { gt: new Date() }
  };
  if (round) where.round = round;
  if (group) where.group = group;
  if (teamId) where.OR = [{ homeTeamId: teamId }, { awayTeamId: teamId }];
  if (stadiumId) where.stadiumId = stadiumId;

  try {
    const matches = await prisma.match.findMany({
      where,
      include: {
        homeTeam: true,
        awayTeam: true,
        stadium: true
      },
      orderBy: { kickoffUtc: 'asc' }
    });
    
    return NextResponse.json({ matches });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch matches' }, { status: 500 });
  }
}
