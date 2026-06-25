import { NextResponse } from 'next/server';
import { prisma } from '@ticketuniverse/database';

export async function POST(request: Request) {
  try {
    // In production:
    // const signature = request.headers.get('stripe-signature');
    // const event = stripe.webhooks.constructEvent(payload, signature, endpointSecret);
    
    // For now, bypass validation and accept mock events
    const event = await request.json();

    if (event.type === 'payment_intent.succeeded') {
      const paymentIntent = event.data.object;
      
      const order = await prisma.order.findFirst({
        where: { stripePaymentIntentId: paymentIntent.id }
      });

      if (order) {
        await prisma.order.update({
          where: { id: order.id },
          data: { status: 'PAID' }
        });

        // Reserve inventory
        await prisma.ticketListing.update({
          where: { id: order.listingId },
          data: { status: 'SOLD' } // Or decrement quantity if partial sale
        });
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    return NextResponse.json({ error: 'Webhook handler failed' }, { status: 400 });
  }
}
