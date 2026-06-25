import { cn } from "@/lib/utils";
import { Clock, CheckCircle2, Package, XCircle, AlertCircle } from "lucide-react";

interface OrderStatusBannerProps {
  status: string;
  className?: string;
}

export function OrderStatusBanner({ status, className }: OrderStatusBannerProps) {
  let config = {
    color: "bg-gray-100 text-gray-800 border-gray-200",
    icon: Clock,
    label: status
  };

  switch (status) {
    case 'PENDING':
      config = { color: "bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-400 dark:border-yellow-900", icon: Clock, label: "Awaiting Payment" };
      break;
    case 'PAID':
      config = { color: "bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-900", icon: Package, label: "Processing Transfer" };
      break;
    case 'DELIVERED':
    case 'COMPLETED':
      config = { color: "bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-900", icon: CheckCircle2, label: "Tickets Transferred" };
      break;
    case 'REFUNDED':
    case 'DISPUTED':
      config = { color: "bg-red-100 text-red-800 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-900", icon: XCircle, label: "Issue Reported" };
      break;
    case 'ACTIVE':
      config = { color: "bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-900", icon: CheckCircle2, label: "Active Listing" };
      break;
    case 'SOLD':
      config = { color: "bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-900/30 dark:text-purple-400 dark:border-purple-900", icon: CheckCircle2, label: "Sold Out" };
      break;
    case 'EXPIRED':
    case 'REMOVED':
      config = { color: "bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700", icon: AlertCircle, label: "Inactive" };
      break;
  }

  const Icon = config.icon;

  return (
    <div className={cn("inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border", config.color, className)}>
      <Icon className="w-3.5 h-3.5" />
      {config.label}
    </div>
  );
}
