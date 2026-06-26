"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Search, Menu, X, User } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Logo } from "@/components/logo";
import { AuthModal } from "@/components/auth-modal";

export default function Navbar({ session }: { session: any }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 60);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Matches", href: "/matches" },
    { name: "Teams", href: "/teams" },
    { name: "Cities", href: "/cities" },
    { name: "Stadiums", href: "/stadiums" },
    { name: "Schedule", href: "/schedule" },
    { name: "Sell Tickets", href: "/sell" },
  ];

  return (
    <>
      <nav 
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 h-16 flex items-center justify-between px-6 ${
          scrolled ? "bg-[#1a1a2e] shadow-md border-b border-white/10" : "bg-transparent"
        }`}
      >
        {/* Left: Logo */}
        <div className="flex items-center h-[44px] w-[140px] lg:h-[56px] lg:w-[200px]">
          <Link href="/" className="block h-full w-full">
            <Logo variant="horizontal" className="h-full w-full" />
          </Link>
        </div>

        {/* Center: Desktop Links */}
        <div className="hidden lg:flex items-center gap-6 text-sm font-semibold">
          {navLinks.map((link) => (
            <Link 
              key={link.name} 
              href={link.href} 
              className={`transition-colors hover:text-primary ${scrolled ? 'text-white/80' : 'text-foreground'}`}
            >
              {link.name}
            </Link>
          ))}
        </div>

        {/* Right: Actions */}
        <div className="hidden lg:flex items-center gap-4 text-sm font-semibold">
          {session ? (
            <Link 
              href="/account" 
              className={`flex items-center gap-2 transition-colors hover:text-primary ${scrolled ? 'text-white' : 'text-foreground'}`}
            >
              {session.user.image ? (
                <img src={session.user.image} alt={session.user.name} className="w-6 h-6 rounded-full" />
              ) : (
                <User className="w-4 h-4" />
              )}
              My Account
            </Link>
          ) : (
            <button 
              onClick={() => setAuthModalOpen(true)}
              className={`flex items-center gap-2 transition-colors hover:text-primary ${scrolled ? 'text-white' : 'text-foreground'}`}
            >
              <User className="w-4 h-4" />
              Login
            </button>
          )}
          <Link 
            href="/sell" 
            className="bg-[#ff6b35] text-white px-5 py-2 rounded-full font-bold hover:bg-[#ff6b35]/90 transition-transform hover:scale-105 shadow-md"
          >
            Sell Tickets
          </Link>
        </div>

        {/* Mobile Toggle */}
        <div className="lg:hidden flex items-center">
          <button 
            onClick={() => setMobileMenuOpen(true)}
            className={`p-2 rounded-md ${scrolled ? 'text-white' : 'text-foreground'}`}
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </nav>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/60 z-[60] backdrop-blur-sm lg:hidden"
            />
            <motion.div 
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 h-full w-4/5 max-w-sm bg-[#1a1a2e] z-[70] shadow-2xl flex flex-col lg:hidden"
            >
              <div className="p-6 flex items-center justify-between border-b border-white/10">
                <span className="font-bold text-xl text-white">Menu</span>
                <button onClick={() => setMobileMenuOpen(false)} className="text-white/70 hover:text-white p-2">
                  <X className="w-6 h-6" />
                </button>
              </div>
              
              <div className="flex-1 overflow-y-auto py-6 px-6 flex flex-col gap-6">
                <div className="flex flex-col gap-4">
                  {navLinks.map((link) => (
                    <Link 
                      key={link.name} 
                      href={link.href} 
                      onClick={() => setMobileMenuOpen(false)}
                      className="text-white/80 font-semibold text-lg hover:text-white"
                    >
                      {link.name}
                    </Link>
                  ))}
                </div>
                
                <hr className="border-white/10" />
                
                <div className="flex flex-col gap-4 mt-auto">
                  {session ? (
                    <Link 
                      href="/account" 
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center gap-2 text-white font-semibold text-lg"
                    >
                      {session.user.image ? (
                        <img src={session.user.image} alt={session.user.name} className="w-6 h-6 rounded-full" />
                      ) : (
                        <User className="w-5 h-5" />
                      )}
                      My Account
                    </Link>
                  ) : (
                    <button 
                      onClick={() => { setMobileMenuOpen(false); setAuthModalOpen(true); }}
                      className="flex items-center gap-2 text-white font-semibold text-lg"
                    >
                      <User className="w-5 h-5" />
                      Login
                    </button>
                  )}
                  <Link 
                    href="/sell" 
                    onClick={() => setMobileMenuOpen(false)}
                    className="bg-[#ff6b35] text-white px-5 py-3 rounded-xl font-bold text-center w-full shadow-md"
                  >
                    Sell Tickets
                  </Link>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <AuthModal isOpen={authModalOpen} onClose={() => setAuthModalOpen(false)} />
    </>
  );
}
