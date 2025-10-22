"use client";
import { ShoppingCart } from "lucide-react";
import Link from "next/link";
import React from "react";
import useCartStore from "../../../store";

const CartIcon = () => {
  const { items } = useCartStore();
  return (
    <Link href={"/cart"} className="relative group">
      <ShoppingCart className="w-5 h-5 text-muted-foreground group-hover:text-foreground hoverEffect" />
      <span className="absolute -top-[0.4375rem] -right-1 bg-foreground text-background px-0.5 min-w-3.5 h-3.5 rounded-full text-xs/1 font-semibold flex items-center justify-center">
        {items.length ? items.length : 0}
      </span>
    </Link>
  );
};

export default CartIcon;
