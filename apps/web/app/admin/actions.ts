"use server";

import { prisma } from "@ticketuniverse/database";
import { revalidatePath } from "next/cache";

// --- Order Actions ---
export async function refundOrder(orderId: string) {
  await prisma.order.update({
    where: { id: orderId },
    data: { status: "REFUNDED" }
  });
  revalidatePath("/admin/orders");
}

export async function markOrderDelivered(orderId: string) {
  await prisma.order.update({
    where: { id: orderId },
    data: { status: "DELIVERED" }
  });
  revalidatePath("/admin/orders");
}

export async function openOrderDispute(orderId: string) {
  await prisma.order.update({
    where: { id: orderId },
    data: { status: "DISPUTED" }
  });
  revalidatePath("/admin/orders");
}

// --- Listing Actions ---
export async function approveListing(listingId: string) {
  await prisma.ticketListing.update({
    where: { id: listingId },
    data: { status: "ACTIVE" }
  });
  revalidatePath("/admin/listings");
}

export async function rejectListing(listingId: string) {
  await prisma.ticketListing.update({
    where: { id: listingId },
    data: { status: "REMOVED" }
  });
  revalidatePath("/admin/listings");
}

// --- Seller Actions ---
export async function verifySellerKyc(userId: string) {
  await prisma.user.update({
    where: { id: userId },
    data: { kycStatus: "VERIFIED" }
  });
  revalidatePath("/admin/sellers");
}

export async function suspendSeller(userId: string) {
  await prisma.user.update({
    where: { id: userId },
    data: { kycStatus: "SUSPENDED" }
  });
  // Also remove all their active listings
  await prisma.ticketListing.updateMany({
    where: { sellerId: userId, status: "ACTIVE" },
    data: { status: "REMOVED" }
  });
  revalidatePath("/admin/sellers");
}

// --- Match Actions ---
export async function updateMatchKickoff(matchId: string, newDateStr: string) {
  await prisma.match.update({
    where: { id: matchId },
    data: { kickoffUtc: new Date(newDateStr) }
  });
  revalidatePath("/admin/matches");
  revalidatePath("/matches");
  revalidatePath("/");
}

export async function addAdminInventory(matchId: string, quantity: number, category: string, price: number) {
  const newTickets = [];
  for (let i = 0; i < quantity; i++) {
    newTickets.push({
      matchId,
      category: category as any,
      section: "VIP Block",
      row: "Row A",
      quantity: 1,
      pricePerTicket: price,
      currency: "USD",
      deliveryMethod: "INSTANT_PDF" as any,
      status: "ACTIVE" as any,
      sellerId: null, // Admin owned
    });
  }
  await prisma.ticketListing.createMany({ data: newTickets });
  revalidatePath("/admin/matches");
}
