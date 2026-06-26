"use server";

import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@ticketuniverse/database";
import { revalidatePath } from "next/cache";

export async function createListing(formData: FormData) {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.email) {
    return { error: "You must be logged in to create a listing." };
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email }
  });

  if (!user) {
    return { error: "User not found." };
  }

  // Ensure they have a Stripe Connect account
  if (!user.stripeConnectId) {
    return { error: "You must connect a bank account before listing tickets." };
  }

  const matchId = formData.get("matchId") as string;
  const category = formData.get("category") as any;
  const quantity = parseInt(formData.get("quantity") as string);
  const section = formData.get("section") as string;
  const row = formData.get("row") as string;
  const seat = formData.get("seat") as string;
  const price = parseFloat(formData.get("price") as string);
  const deliveryMethod = formData.get("deliveryMethod") as any;

  if (!matchId || !category || !quantity || !price || !deliveryMethod) {
    return { error: "Missing required fields." };
  }

  try {
    const listing = await prisma.ticketListing.create({
      data: {
        matchId,
        sellerId: user.id,
        category,
        quantity,
        section: section || null,
        row: row || null,
        seat: seat || null,
        pricePerTicket: price,
        currency: "USD",
        deliveryMethod,
        status: "ACTIVE",
      }
    });

    revalidatePath("/seller/dashboard");
    revalidatePath("/sell/list");
    
    return { success: true, listingId: listing.id };
  } catch (error: any) {
    console.error("Failed to create listing", error);
    return { error: "An unexpected error occurred while creating your listing." };
  }
}
