import emptyCart from "@/images/empty-cart.svg";
import Image from "next/image";
import { motion } from "motion/react";
import { ShoppingCart } from "lucide-react";
import { Button } from "./ui/button";
import Link from "next/link";

const EmptyCart = () => {
  return (
    <div className="py-10 md:py-20 flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-card rounded-2xl shadow-xl p-8 max-w-md w-full space-y-8 border"
      >
        <motion.div
          animate={{ scale: [1, 1.1, 1], rotate: [0, 5, -5, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          className="relative w-48 h-48 mx-auto bg-background rounded-xl shadow-lg border p-2"
        >
          <Image src={emptyCart} width={200} height={200} alt="Empty Cart" />
          <motion.div
            animate={{ x: [0, -10, 10, 0], y: [0, 5, -5, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            className="absolute -top-4 -right-4 rounded-full bg-primary p-2 shadow-lg"
          >
            <ShoppingCart className="text-white size-6" />
          </motion.div>
        </motion.div>
        <div className="text-center space-y-4">
          <h2 className="text-3xl font-bold">Your cart is waiting!</h2>
          <p className="text-muted-foreground">
            Hot styles sell out fast, and once they&apos;re gone, they&apos;re
            gone. Add your favorites now and check out!
          </p>
        </div>
        <Button asChild className="w-full" size="lg">
          <Link href="/shop">Find Something You&apos;ll Love</Link>
        </Button>
      </motion.div>
    </div>
  );
};

export default EmptyCart;
