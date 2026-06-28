import Link from "next/link";
import { LayoutDashboard, ReceiptText, Ticket, Users, CalendarRange, LogOut } from "lucide-react";
import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import Image from "next/image";

import { authOptions } from "@/lib/auth";
import { prisma } from "@ticketuniverse/database";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);
  
  if (!session || !session.user?.email) {
    redirect("/");
  }

  const dbUser = await prisma.user.findUnique({
    where: { email: session.user.email }
  });

  if (!dbUser || dbUser.role !== 'ADMIN') {
    redirect("/");
  }

  return (
    <div className="min-h-screen bg-muted/20 flex flex-col md:flex-row pt-20">
      
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-card border-r border-border shrink-0 flex flex-col hidden md:flex sticky top-20 h-[calc(100vh-5rem)]">
        <div className="p-6 border-b border-border flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white font-black">
            A
          </div>
          <div>
            <h2 className="font-bold text-sm leading-none">Admin Panel</h2>
            <p className="text-xs text-muted-foreground mt-1">Ticket Universe</p>
          </div>
        </div>
        
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          <Link href="/admin" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium hover:bg-muted transition-colors text-foreground">
            <LayoutDashboard className="w-4 h-4 text-muted-foreground" /> Overview
          </Link>
          <Link href="/admin/orders" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium hover:bg-muted transition-colors text-foreground">
            <ReceiptText className="w-4 h-4 text-muted-foreground" /> Orders
          </Link>
          <Link href="/admin/listings" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium hover:bg-muted transition-colors text-foreground">
            <Ticket className="w-4 h-4 text-muted-foreground" /> Listings Moderation
          </Link>
          <Link href="/admin/sellers" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium hover:bg-muted transition-colors text-foreground">
            <Users className="w-4 h-4 text-muted-foreground" /> Sellers
          </Link>
          <Link href="/admin/matches" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium hover:bg-muted transition-colors text-foreground">
            <CalendarRange className="w-4 h-4 text-muted-foreground" /> Matches & Inventory
          </Link>
        </nav>

        <div className="p-4 border-t border-border">
          <Link href="/" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium hover:bg-destructive/10 hover:text-destructive transition-colors text-muted-foreground">
            <LogOut className="w-4 h-4" /> Exit Admin
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto min-h-[calc(100vh-5rem)]">
        <div className="p-6 md:p-8 max-w-7xl mx-auto">
          {children}
        </div>
      </main>

    </div>
  );
}
