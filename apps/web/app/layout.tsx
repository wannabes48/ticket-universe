import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";

import { Bricolage_Grotesque } from "next/font/google";

const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  variable: "--font-bricolage",
  display: "swap",
  axes: ["wdth"],
});

export const metadata: Metadata = {
  title: "Ticket Universe | World Cup 2026",
  description: "Frictionless secondary ticket marketplace for the 2026 FIFA World Cup.",
  icons: {
    icon: "/logo.png",
  },
};

import { GradientDots } from "@/components/ui/gradient-dots";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${bricolage.variable} font-sans antialiased`}
      >
        <GradientDots className="fixed inset-0 -z-50 pointer-events-none" />
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  );
}
