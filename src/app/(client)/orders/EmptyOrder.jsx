"use client";
import { motion } from "motion/react";
import Image from "next/image";
import { PackageOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import emptyOrders from "@/images/empty-orders.svg";

const EmptyOrders = () => {
  return (
    <div className="py-10 md:py-20 flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-card rounded-2xl shadow-xl p-8 max-w-md w-full space-y-8 border"
      >
        {/* Animated image container */}
        <motion.div
          animate={{ scale: [1, 1.05, 1], rotate: [0, 2, -2, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          className="relative w-48 h-48 mx-auto bg-background rounded-xl shadow-lg border p-2 flex items-center justify-center"
        >
          <Image
            src={emptyOrders}
            width={200}
            height={100}
            alt="No Orders"
            className="rounded-lg"
          />
          <motion.div
            animate={{ x: [0, -10, 10, 0], y: [0, 5, -5, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            className="absolute -top-4 -right-4 rounded-full bg-primary p-2 shadow-lg"
          >
            <PackageOpen className="text-white size-6" />
          </motion.div>
        </motion.div>

        {/* Text */}
        <div className="text-center space-y-4">
          <h2 className="text-3xl font-bold">No orders yet</h2>
          <p className="text-muted-foreground">
            You haven&apos;t placed any orders yet — but your next favorite outfit is
            just a few clicks away.
          </p>
        </div>

        {/* CTA */}
        <Button asChild size="lg" className="w-full">
          <Link href="/shop">Start Shopping</Link>
        </Button>
      </motion.div>
    </div>
  );
};

export default EmptyOrders;
