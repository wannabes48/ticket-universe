"use client";

import { useEffect, useState } from "react";

export function LocalTime({ date, format = "short" }: { date: string | Date, format?: "short" | "long" | "time" }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <span className="opacity-0">Loading...</span>;
  }

  const d = new Date(date);
  
  if (format === "time") {
    return <>{d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', timeZoneName: 'short' })}</>;
  }
  
  if (format === "long") {
    return <>{d.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</>;
  }

  return <>{d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit', timeZoneName: 'short' })}</>;
}
