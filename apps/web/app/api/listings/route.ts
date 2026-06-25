import { NextResponse } from 'next/server';
import { prisma } from '@ticketuniverse/database';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any).role !== 'SELLER') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { matchId, category, section, row, seat, quantity, pricePerTicket, currency, deliveryMethod } = body;

    const listing = await prisma.ticketListing.create({
      data: {
        matchId,
        sellerId: (session.user as any).id,
        category,
        section,
        row,
        seat,
        quantity,
        pricePerTicket,
        currency: currency || 'USD',
        deliveryMethod,
        status: 'ACTIVE'
      }
    });

    return NextResponse.json({ listing });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create listing' }, { status: 500 });
  }
}
