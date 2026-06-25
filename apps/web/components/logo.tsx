import Image from "next/image";
import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  variant?: "horizontal" | "icon" | "stacked";
}

export function Logo({ className, variant = "horizontal" }: LogoProps) {
  if (variant === "icon") {
    return (
      <div className={cn("relative flex items-center justify-center p-[10%]", className)}>
        <Image src="/custom-ticket.png" alt="Ticket Universe Icon" fill className="object-contain" />
      </div>
    );
  }

  if (variant === "stacked") {
    return (
      <div className={cn("flex flex-col items-center justify-center gap-2 p-[10%]", className)}>
        <div className="relative w-12 h-12">
          <Image src="/custom-ticket.png" alt="Ticket Universe Icon" fill className="object-contain" />
        </div>
        <span className="font-bold text-lg leading-none tracking-tight text-white">Ticket Universe</span>
      </div>
    );
  }

  // Horizontal (Primary)
  return (
    <div className={cn("flex items-center gap-3 p-[10%] h-full w-full", className)}>
      <div className="relative h-full aspect-square flex-shrink-0">
        <Image src="/custom-ticket.png" alt="Ticket Universe Icon" fill className="object-contain" />
      </div>
      <span className="font-bold text-lg sm:text-xl leading-none tracking-tight whitespace-nowrap text-white">
        Ticket Universe
      </span>
    </div>
  );
}
