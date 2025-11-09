"use client";
import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import useCartStore from "../../../../store";
import { motion } from "motion/react";
import { Check, Home, Package, ShoppingCart } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { client } from "@/sanity/lib/client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { priceFormatter } from "@/lib";

const SuccessPage = () => {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
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

  const query = `*[_type == "order" && orderNumber == $orderNumber][0]
    {
      items,
      total,
      "shipping": shipping.cost,
      discount->{
          code, value, discountType
      }
    }`;

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await client.fetch(query, { orderNumber });
        setSummary(await response);
        console.log(await response);
      } catch (error) {
        console.log("Error in Fetching Order Summary Products", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const subtotal = useMemo(
    () => summary?.items?.reduce((acc, item) => acc + item.subtotal, 0) || 0,
    [summary]
  );

  return (
    <div className="bg-card rounded-2xl shadow-xl p-8 max-w-md w-full space-y-8 border text-center">
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
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[60%]">Product</TableHead>
              <TableHead className="text-right">Qty</TableHead>
              <TableHead className="text-right">Price</TableHead>
              <TableHead className="text-right">Subtotal</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {!loading
              ? summary.items.map((item, i) => (
                  <TableRow key={i}>
                    <TableCell className="font-medium whitespace-normal wrap-break-word">
                      <span className="line-clamp-2">{item.name}</span>
                      {item.variant && (
                        <p className="text-xs text-muted-foreground">
                          {item.variant}
                        </p>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      {item.quantity}
                    </TableCell>
                    <TableCell className="text-right">
                      {priceFormatter(item.price)}
                    </TableCell>
                    <TableCell className="text-right">
                      {priceFormatter(item.subtotal)}
                    </TableCell>
                  </TableRow>
                ))
              : Array.from({ length: 3 }).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell className="space-y-1.25">
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-1/2" />
                      <Skeleton className="h-3.5 w-5" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="ml-auto h-4.5" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="ml-auto h-4.5 w-10" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="ml-auto h-4.5 w-12" />
                    </TableCell>
                  </TableRow>
                ))}

            {/* Totals */}
            <TableRow className="text-right">
              <TableCell></TableCell>
              <TableCell></TableCell>
              <TableCell>Subtotal:</TableCell>
              <TableCell className="font-semibold">
                {!loading ? (
                  priceFormatter(subtotal)
                ) : (
                  <Skeleton className="ml-auto h-4.5 w-14" />
                )}
              </TableCell>
            </TableRow>

            {summary?.discount && (
              <TableRow className="text-right">
                <TableCell className="text-left">Discount Code:</TableCell>
                <TableCell></TableCell>
                <TableCell>
                  {!loading ? (
                    summary.discount.code
                  ) : (
                    <Skeleton className="ml-auto h-4.5 w-full" />
                  )}
                </TableCell>
                <TableCell className="font-semibold text-red-500 whitespace-normal wrap-break-words">
                  {!loading ? (
                    summary.discount.discountType === "percentage" ? (
                      "-" + summary.discount.value + "%"
                    ) : summary.discount.discountType === "fixed" ? (
                      "-" + priceFormatter(summary.discount.value)
                    ) : (
                      "Free Shipping"
                    )
                  ) : (
                    <Skeleton className="ml-auto h-4.5 w-8" />
                  )}
                </TableCell>
              </TableRow>
            )}

            <TableRow className="text-right">
              <TableCell></TableCell>
              <TableCell></TableCell>
              <TableCell>Shipping:</TableCell>
              <TableCell className="font-semibold">
                {!loading ? (
                  summary?.shipping === 0 ? (
                    "Free"
                  ) : (
                    priceFormatter(summary?.shipping || 0)
                  )
                ) : (
                  <Skeleton className="ml-auto h-4.5 w-8" />
                )}
              </TableCell>
            </TableRow>

            <TableRow className="text-right border-t-2 border-muted">
              <TableCell></TableCell>
              <TableCell></TableCell>
              <TableCell className="font-semibold">Grand Total:</TableCell>
              <TableCell className="font-bold text-lg">
                {!loading ? (
                  priceFormatter(summary?.total || 0)
                ) : (
                  <Skeleton className="ml-auto h-7 w-full" />
                )}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>

        <p className="text-xs mt-3 text-muted-foreground">
          A detailed receipt has been sent to your email. Didn&apos;t get it?
          Check spam or{" "}
          <a href="/orders" className="underline">
            track your order
          </a>
          .
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
    </div>
  );
};

export default SuccessPage;
