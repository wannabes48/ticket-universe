import { NextResponse } from 'next/server';
import { prisma } from '@ticketuniverse/database';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export async function POST(request: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any).role !== 'SELLER') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const order = await prisma.order.findUnique({
      where: { id: params.id },
      include: { listing: true }
    });

    if (!order || order.listing.sellerId !== (session.user as any).id) {
      return NextResponse.json({ error: 'Unauthorized or not found' }, { status: 401 });
    }

    // In a real app, this would validate uploaded PDFs or trigger a FIFA API transfer
    const updated = await prisma.order.update({
      where: { id: params.id },
      data: { status: 'DELIVERED' }
    });

    return NextResponse.json({ order: updated });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to mark delivered' }, { status: 500 });
  }
}
