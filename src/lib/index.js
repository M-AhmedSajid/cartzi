import { Badge } from "@/components/ui/badge";
import {
  CircleCheck,
  Clock,
  Truck,
  CircleX,
  Loader2,
  PackageOpen,
} from "lucide-react";

export const priceFormatter = function (amount) {
  const formattedPrice = new Number(amount).toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  });
  return formattedPrice;
};

export const dateFormatter = (dateStr) => {
  const date = new Date(dateStr);
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
};


export function formatRelativeDate(dateString) {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now - date;
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  // If more than 30 days old → return formatted date
  if (diffDays > 30) {
    return {
      text: date.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }),
      isAbsolute: true,
    };
  }

  if (diffDays >= 1)
    return { text: `about ${diffDays} day${diffDays > 1 ? "s" : ""} ago`, isAbsolute: false };

  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  if (diffHours >= 1)
    return { text: `about ${diffHours} hour${diffHours > 1 ? "s" : ""} ago`, isAbsolute: false };

  const diffMinutes = Math.floor(diffMs / (1000 * 60));
  if (diffMinutes >= 1)
    return { text: `about ${diffMinutes} minute${diffMinutes > 1 ? "s" : ""} ago`, isAbsolute: false };

  return { text: "just now", isAbsolute: false };
}

export function getStatusBadge(status) {
  switch (status) {
    case "pending":
      return (
        <Badge
          variant="outline"
          className="border-amber-400 text-amber-600 group-[&[data-state=open]]:bg-amber-200"
        >
          <Loader2 className="animate-spin [animation-duration:3s]" />
          Pending
        </Badge>
      );

    case "paid":
      return (
        <Badge
          variant="outline"
          className="border-blue-400 text-blue-600 group-[&[data-state=open]]:bg-blue-200"
        >
          <Clock />
          Processing
        </Badge>
      );

    case "shipped":
      return (
        <Badge
          variant="outline"
          className="border-purple-400 text-purple-600 group-[&[data-state=open]]:bg-purple-200"
        >
          <Truck />
          Shipped
        </Badge>
      );

    case "delivered":
      return (
        <Badge
          variant="outline"
          className="border-green-400 text-green-600 group-[&[data-state=open]]:bg-green-200"
        >
          <CircleCheck />
          Delivered
        </Badge>
      );

    case "cancelled":
      return (
        <Badge
          variant="outline"
          className="border-red-400 text-red-600 group-[&[data-state=open]]:bg-red-200"
        >
          <CircleX />
          Cancelled
        </Badge>
      );

    default:
      return (
        <Badge variant="outline">
          <PackageOpen />
          Unknown
        </Badge>
      );
  }
}