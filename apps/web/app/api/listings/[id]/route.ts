import { NextResponse } from 'next/server';
import { prisma } from '@ticketuniverse/database';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await request.json();
    const { pricePerTicket, quantity, status } = body;

    const listing = await prisma.ticketListing.findUnique({ where: { id: params.id } });
    
    if (!listing || listing.sellerId !== (session.user as any).id) {
      return NextResponse.json({ error: 'Unauthorized or not found' }, { status: 401 });
    }

    const updated = await prisma.ticketListing.update({
      where: { id: params.id },
      data: {
        pricePerTicket: pricePerTicket ?? listing.pricePerTicket,
        quantity: quantity ?? listing.quantity,
        status: status ?? listing.status
      }
    });

    return NextResponse.json({ listing: updated });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update listing' }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const listing = await prisma.ticketListing.findUnique({ where: { id: params.id } });
    if (!listing || listing.sellerId !== (session.user as any).id) {
      return NextResponse.json({ error: 'Unauthorized or not found' }, { status: 401 });
    }

    await prisma.ticketListing.update({
      where: { id: params.id },
      data: { status: 'REMOVED' }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete listing' }, { status: 500 });
  }
}
