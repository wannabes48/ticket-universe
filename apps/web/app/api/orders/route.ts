import { NextResponse } from 'next/server';
import { prisma } from '@ticketuniverse/database';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { listingId, buyerEmail, buyerName, buyerPhone, quantity, refundProtection, ticketHolders } = body;

    const listing = await prisma.ticketListing.findUnique({ where: { id: listingId } });
    if (!listing || listing.status !== 'ACTIVE' || listing.quantity < quantity) {
      return NextResponse.json({ error: 'Tickets unavailable' }, { status: 400 });
    }

    const subtotal = listing.pricePerTicket * quantity;
    const serviceFee = subtotal * 0.10; // 10%
    const total = subtotal + serviceFee + (refundProtection ? subtotal * 0.07 : 0);

    const order = await prisma.order.create({
      data: {
        reference: `TUNI-2026-${Math.floor(10000000 + Math.random() * 90000000)}`,
        listingId,
        buyerEmail,
        buyerName,
        buyerPhone,
        quantity,
        subtotal,
        serviceFee,
        total,
        currency: listing.currency,
        refundProtection,
        ticketHolders: ticketHolders || [],
        status: 'PENDING'
      }
    });

    return NextResponse.json({ order });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create order' }, { status: 500 });
  }
}
