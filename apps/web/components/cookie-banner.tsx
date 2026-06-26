"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { X } from "lucide-react";

export default function CookieBanner() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if the user has already accepted or dismissed the cookie banner
    const cookieConsent = localStorage.getItem("ticketuniverse_cookie_consent");
    if (!cookieConsent) {
      setIsVisible(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem("ticketuniverse_cookie_consent", "accepted");
    setIsVisible(false);
  };

  const handleDecline = () => {
    localStorage.setItem("ticketuniverse_cookie_consent", "declined");
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 md:p-6 pb-20 md:pb-6 pointer-events-none">
      <div className="max-w-4xl mx-auto bg-card border border-border shadow-2xl rounded-2xl p-5 md:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pointer-events-auto">
        <div className="flex-1 pr-4">
          <div className="flex items-center justify-between sm:hidden mb-2">
            <h3 className="font-bold text-foreground">Cookie Settings</h3>
            <button onClick={handleDecline} className="text-muted-foreground p-1"><X className="w-5 h-5"/></button>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">
            We use cookies to ensure you get the best experience on our website, analyze site traffic, and personalize content. By clicking "Accept All", you consent to our use of cookies. Read our <Link href="/cookies" className="text-primary font-medium hover:underline">Cookie Policy</Link> to learn more.
          </p>
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto shrink-0">
          <button 
            onClick={handleDecline}
            className="flex-1 sm:flex-none px-5 py-2.5 rounded-full font-bold text-sm bg-muted text-muted-foreground hover:bg-muted/80 transition-colors"
          >
            Decline
          </button>
          <button 
            onClick={handleAccept}
            className="flex-1 sm:flex-none px-5 py-2.5 rounded-full font-bold text-sm bg-primary text-primary-foreground hover:bg-primary/90 transition-colors shadow-md"
          >
            Accept All
          </button>
        </div>
      </div>
    </div>
  );
}
