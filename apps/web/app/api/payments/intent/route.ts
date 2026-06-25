import { NextResponse } from 'next/server';
import { prisma } from '@ticketuniverse/database';

export async function POST(request: Request) {
  try {
    const { orderId } = await request.json();

    const order = await prisma.order.findUnique({ where: { id: orderId } });
    if (!order) return NextResponse.json({ error: 'Order not found' }, { status: 404 });

    // Mock Stripe Payment Intent
    const mockClientSecret = `pi_mock_${Math.random().toString(36).substring(7)}_secret_${Math.random().toString(36).substring(7)}`;

    await prisma.order.update({
      where: { id: orderId },
      data: { stripePaymentIntentId: mockClientSecret.split('_secret')[0] }
    });

    return NextResponse.json({ clientSecret: mockClientSecret });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create payment intent' }, { status: 500 });
  }
}
