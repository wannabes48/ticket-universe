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

    // Mock payout data
    const payouts = [
      { id: 'po_1', amount: 450, status: 'PAID', date: '2026-06-20' },
      { id: 'po_2', amount: 1200, status: 'PENDING', date: '2026-06-24' }
    ];

    return NextResponse.json({ payouts });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch payouts' }, { status: 500 });
  }
}
