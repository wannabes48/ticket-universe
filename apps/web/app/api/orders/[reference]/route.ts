import { NextResponse } from 'next/server';
import { prisma } from '@ticketuniverse/database';

export async function GET(request: Request, { params }: { params: { reference: string } }) {
  const { searchParams } = new URL(request.url);
  const email = searchParams.get('email'); // Light verification
  
  try {
    const order = await prisma.order.findUnique({
      where: { reference: params.reference },
      include: {
        listing: {
          include: { match: { include: { homeTeam: true, awayTeam: true, stadium: true } } }
        }
      }
    });

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    if (email && order.buyerEmail !== email) {
      return NextResponse.json({ error: 'Unauthorized email' }, { status: 401 });
    }

    return NextResponse.json({ order });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch order' }, { status: 500 });
  }
}
