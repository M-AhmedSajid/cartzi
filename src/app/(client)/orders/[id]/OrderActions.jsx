"use client";
import { Button } from "@/components/ui/button";
import { generateInvoice } from "@/lib/generate-invoice";
import { Download } from "lucide-react";
import Link from "next/link";

const OrderActions = ({ order }) => {
  return (
    <div className="flex flex-wrap gap-3 justify-end mt-6">
      <Button variant="outline" asChild>
        <Link href="/contact">Need Help?</Link>
      </Button>
      {order.status === "delivered" && (
        <Button variant="outline" onClick={() => handleReorder(order.items)}>
          Buy Again
        </Button>
      )}
      {["pending", "paid"].includes(order.status) && (
        <Button
          variant="destructive"
          onClick={() => handleCancelOrder(order._id)}
        >
          Cancel Order
        </Button>
      )}
      <Button onClick={() => generateInvoice(order)}>
        <Download className="w-4 h-4 mr-1.5" /> Download Invoice
      </Button>
    </div>
  );
};

export default OrderActions;
