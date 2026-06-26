"use client";

import { useState, useEffect } from "react";
import { Clock } from "lucide-react";

export function CountdownTimer({ targetDateUtc }: { targetDateUtc: Date | string }) {
  const [timeLeft, setTimeLeft] = useState<{ d: number, h: number, m: number, s: number } | null>(null);

  useEffect(() => {
    const calculateTimeLeft = () => {
      const target = new Date(targetDateUtc).getTime();
      const now = new Date().getTime();
      const diff = target - now;
      
      if (diff <= 0) return { d: 0, h: 0, m: 0, s: 0 };
      
      return {
        d: Math.floor(diff / (1000 * 60 * 60 * 24)),
        h: Math.floor((diff / (1000 * 60 * 60)) % 24),
        m: Math.floor((diff / 1000 / 60) % 60),
        s: Math.floor((diff / 1000) % 60)
      };
    };

    setTimeLeft(calculateTimeLeft());
    const timer = setInterval(() => setTimeLeft(calculateTimeLeft()), 1000);
    return () => clearInterval(timer);
  }, [targetDateUtc]);

  if (!timeLeft) return null; // Prevent hydration mismatch

  return (
    <div className="flex items-center gap-4 bg-muted/50 p-4 rounded-xl border border-border mt-6">
      <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary flex-shrink-0">
        <Clock className="w-6 h-6" />
      </div>
      <div>
        <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-1">Kick-off In</p>
        <div className="flex items-center gap-1 sm:gap-2 text-foreground font-mono font-bold text-base sm:text-lg">
          <div className="bg-background border border-border px-2 py-1 rounded shadow-sm min-w-[3.5rem] text-center">{String(timeLeft.d).padStart(2, '0')}d</div>
          <span>:</span>
          <div className="bg-background border border-border px-2 py-1 rounded shadow-sm min-w-[3.5rem] text-center">{String(timeLeft.h).padStart(2, '0')}h</div>
          <span>:</span>
          <div className="bg-background border border-border px-2 py-1 rounded shadow-sm min-w-[3.5rem] text-center">{String(timeLeft.m).padStart(2, '0')}m</div>
          <span>:</span>
          <div className="bg-background border border-border px-2 py-1 rounded shadow-sm min-w-[3.5rem] text-center text-primary">{String(timeLeft.s).padStart(2, '0')}s</div>
        </div>
      </div>
    </div>
  );
}
