import { cn } from "@/lib/utils";

interface PriceBadgeProps {
  amount: number;
  prefix?: string;
  className?: string;
}

export function PriceBadge({ amount, prefix = "From", className }: PriceBadgeProps) {
  return (
    <div className={cn(
      "bg-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md inline-flex items-center gap-1",
      className
    )}>
      <span className="uppercase opacity-90 text-[10px] tracking-wider">{prefix}</span>
      <span>${amount.toLocaleString()}</span>
    </div>
  );
}
