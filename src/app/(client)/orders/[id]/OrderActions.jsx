"use client";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { generateInvoice } from "@/lib/generate-invoice";
import { useOrderActions } from "@/lib/useOrderActions";
import { Download } from "lucide-react";
import Link from "next/link";

const OrderActions = ({ order }) => {
  const { loading, handleCancelOrder, buyAgain } = useOrderActions();

  return (
    <div className="flex flex-wrap gap-3 justify-end mt-6">
      <Button variant="outline" asChild>
        <Link href="/contact">Need Help?</Link>
      </Button>
      {order.status === "delivered" && (
        <Button
          variant="outline"
          onClick={() => buyAgain(order.items)}
          disabled={loading}
        >
          {loading ? "Adding..." : "Buy Again"}
        </Button>
      )}
      {["pending", "paid"].includes(order.status) && (
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive">Cancel Order</Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Cancel this order?</AlertDialogTitle>
              <AlertDialogDescription>
                This action will cancel your order and stop it from being
                processed. You can&apos;t undo this once it&apos;s cancelled.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel disabled={loading}>No</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => handleCancelOrder(order._id)}
                disabled={loading}
                variant="destructive"
              >
                {loading ? "Cancelling..." : "Yes, Cancel"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
      <Button onClick={() => generateInvoice(order)}>
        <Download className="w-4 h-4 mr-1.5" /> Download Invoice
      </Button>
    </div>
  );
};

export default OrderActions;
