import type { Metadata } from "next";
import localFont from "next/font/local";
// @ts-ignore: side-effect import of CSS without type declarations
import "./globals.css";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import CookieBanner from "@/components/cookie-banner";
import NextTopLoader from 'nextjs-toploader';

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

import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getServerSession(authOptions);

  return (
    <html lang="en">
      <body
        className={`${bricolage.variable} font-sans antialiased`}
      >
        <NextTopLoader color="var(--primary)" height={4} showSpinner={true} />
        <Navbar session={session} />
        {children}
        <Footer />
        <CookieBanner />
      </body>
    </html>
  );
}
