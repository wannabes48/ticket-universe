import { NextResponse } from 'next/server';
import { prisma } from '@ticketuniverse/database';

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get('category');
  
  try {
    const match = await prisma.match.findFirst({
      where: { OR: [{ id: params.id }, { slug: params.id }] },
      select: { id: true }
    });

    if (!match) {
      return NextResponse.json({ error: 'Match not found' }, { status: 404 });
    }

    const where: any = { 
      matchId: match.id,
      status: 'ACTIVE'
    };
    
    if (category) where.category = category;

    const listings = await prisma.ticketListing.findMany({
      where,
      orderBy: { pricePerTicket: 'asc' },
      include: {
        seller: {
          select: { name: true, kycStatus: true, createdAt: true }
        }
      }
    });

    return NextResponse.json({ listings });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch listings' }, { status: 500 });
  }
}
