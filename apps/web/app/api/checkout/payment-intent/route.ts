import { NextResponse } from 'next/server';
import { prisma } from '@ticketuniverse/database';
import Stripe from 'stripe';

export async function POST(request: Request) {
  try {
    if (!process.env.STRIPE_SECRET_KEY) {
      throw new Error("Stripe secret key is missing in environment variables. Please restart your Next.js server!");
    }

    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2024-04-10',
    });

    const body = await request.json();
    const { 
      amount, 
      currency = 'usd', 
      listingId, 
      buyerDetails, 
      ticketHolders, 
      quantity, 
      subtotal, 
      serviceFee, 
      refundProtection, 
      orderRef 
    } = body;

    if (!process.env.STRIPE_SECRET_KEY) {
      throw new Error("Stripe secret key is missing in environment variables.");
    }

    // Create a PaymentIntent with the order amount and currency
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Stripe requires amount in cents
      currency,
      automatic_payment_methods: {
        enabled: true,
      },
      metadata: {
        listingId,
        orderRef,
      }
    });

    // Create the PENDING Order in the database
    const order = await prisma.order.create({
      data: {
        reference: orderRef,
        listingId,
        buyerName: `${buyerDetails.firstName} ${buyerDetails.lastName}`.trim(),
        buyerEmail: buyerDetails.email,
        buyerPhone: buyerDetails.phone || "N/A",
        quantity,
        subtotal,
        serviceFee,
        total: amount,
        currency: currency.toUpperCase(),
        stripePaymentIntentId: paymentIntent.id,
        refundProtection,
        status: 'PENDING',
        ticketHolders: JSON.stringify(ticketHolders)
      }
    });

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      orderId: order.id
    });
  } catch (error: any) {
    console.error("PaymentIntent Error:", error);
    return NextResponse.json(
      { error: error.message },
      { status: 400 }
    );
  }
}
