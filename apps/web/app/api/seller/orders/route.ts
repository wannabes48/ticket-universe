import { NextResponse } from 'next/server';
import { prisma } from '@ticketuniverse/database';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any).role !== 'SELLER') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const orders = await prisma.order.findMany({
      where: {
        listing: { sellerId: (session.user as any).id }
      },
      include: {
        listing: { include: { match: { include: { homeTeam: true, awayTeam: true } } } }
      },
      orderBy: { id: 'desc' }
    });

    return NextResponse.json({ orders });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch seller orders' }, { status: 500 });
  }
}
