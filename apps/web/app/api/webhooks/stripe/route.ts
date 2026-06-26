import { NextResponse } from 'next/server';
import { prisma } from '@ticketuniverse/database';
import Stripe from 'stripe';

export async function POST(request: Request) {
  if (!process.env.STRIPE_SECRET_KEY) {
    return NextResponse.json({ error: 'Stripe secret key missing' }, { status: 500 });
  }

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: '2026-06-24.dahlia',
  });

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

    if (order && order.status !== 'PAID') {
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
  } else if (event.type === 'payment_intent.payment_failed') {
    const paymentIntent = event.data.object as Stripe.PaymentIntent;
    
    await prisma.order.updateMany({
      where: { stripePaymentIntentId: paymentIntent.id },
      data: { status: 'FAILED' }
    });
  } else if (event.type === 'payment_intent.canceled') {
    const paymentIntent = event.data.object as Stripe.PaymentIntent;
    
    await prisma.order.updateMany({
      where: { stripePaymentIntentId: paymentIntent.id },
      data: { status: 'CANCELLED' }
    });
  }

  return NextResponse.json({ received: true });
}
