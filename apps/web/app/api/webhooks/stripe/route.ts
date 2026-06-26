import { NextResponse } from 'next/server';
import { prisma } from '@ticketuniverse/database';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: '2024-04-10', // using a typical recent API version
});

export async function POST(request: Request) {
  const payload = await request.text();
  const signature = request.headers.get('stripe-signature');

  if (!signature) {
    return NextResponse.json({ error: 'Missing stripe-signature header' }, { status: 400 });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      payload,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET as string
    );
  } catch (error: any) {
    console.error(`Webhook signature verification failed: ${error.message}`);
    return NextResponse.json({ error: 'Webhook signature verification failed' }, { status: 400 });
  }

  if (event.type === 'payment_intent.succeeded') {
    const paymentIntent = event.data.object as Stripe.PaymentIntent;
    
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
}
