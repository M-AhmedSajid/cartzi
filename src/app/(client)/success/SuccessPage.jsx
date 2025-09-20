"use client";
import { useSearchParams, useRouter } from "next/navigation";
import { useEffect } from "react";
import useCartStore from "../../../../store";
import { motion } from "motion/react";
import { Check, Home, Package, ShoppingCart } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const SuccessPage = () => {
  const { resetCart } = useCartStore();
  const searchParams = useSearchParams();
  const router = useRouter();

  const orderNumber = searchParams.get("order_number");
  const sessionId = searchParams.get("session_id");

  useEffect(() => {
    if (!orderNumber && !sessionId) {
      router.replace("/");
    } else {
      resetCart();
    }
  }, [orderNumber, sessionId, router, resetCart]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-card rounded-2xl shadow-xl p-8 max-w-md w-full space-y-8 border text-center"
    >
      <motion.div
        animate={{ scale: [1, 1.15, 1], rotate: [0, 20, -20, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        className="w-24 h-24 mx-auto bg-foreground rounded-full flex items-center justify-center shadow-lg"
      >
        <Check className="size-12 text-white" />
      </motion.div>
      <h1 className="text-3xl font-bold mb-3">Order placed successfully!</h1>
      <p className="text-sm text-muted-foreground">
        🚚 Fast Shipping • ↩ Free Returns • 🔒 Secure Checkout
      </p>
      <div className="space-y-4 text-left text-muted-foreground">
        <p>
          Thank you for your purchase! We&apos;re processing your order and will
          ship it soon. A confirmation email with your order details will be
          sent to you shortly.
        </p>
        <p>
          Order Number:{" "}
          <span className=" text-foreground font-semibold">{orderNumber}</span>
        </p>
      </div>
      {/* Order Snapshot */}
      <div className="bg-background border rounded-lg p-4 text-left">
        <h2 className="font-semibold mb-2">Order Summary</h2>
        {/* Loop order items (example below) */}
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-16 h-20 bg-muted rounded-md" />
            <div className="flex-grow">
              <p className="font-medium">Black Hoodie</p>
              <p className="text-sm text-muted-foreground">Size M • Qty 1</p>
            </div>
            <p className="font-medium">$49.99</p>
          </div>
        </div>
        <p className="text-sm mt-3 text-muted-foreground">
          Full details are in your email receipt.
        </p>
      </div>
      <div className="bg-background border rounded-lg p-4">
        <h2 className="font-semibold text-gray-900 mb-2">What&apos;s Next?</h2>
        <ul className="text-sm space-y-1 text-muted-foreground">
          <li>Check your email for order confirmation.</li>
          <li>We&apos;ll notify you when your order ships.</li>
          <li>Track your order status anytime.</li>
        </ul>
      </div>

      {/* Order Tracker */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-3">
        <Button asChild size="lg">
          <Link href="/">
            <Home className="size-5 mr-2" />
            Home
          </Link>
        </Button>
        <Button asChild size="lg" variant="outline">
          <Link href="/orders">
            <Package className="size-5 mr-2" />
            Orders
          </Link>
        </Button>
        <Button asChild size="lg">
          <Link href="/shop">
            <ShoppingCart className="size-5 mr-2" />
            Shop
          </Link>
        </Button>
      </div>
      <p className="text-sm text-muted-foreground">
        Questions?{" "}
        <Link href="/contact" className="underline">
          Contact support
        </Link>
      </p>
    </motion.div>
  );
};

export default SuccessPage;
