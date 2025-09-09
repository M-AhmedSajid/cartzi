"use client";
import React from "react";
import { Button } from "../ui/button";
import QuantityButtons from "./QuantityButtons";
import useCartStore from "../../../store";
import { toast } from "sonner";
import WishlistButton from "./WishlistButton";

const ProductActions = ({ product, variant, isOutOfStock }) => {
  const { addItem, getItemQuantity, getSubtotalCents } = useCartStore();
  const itemCount = getItemQuantity(product, variant);

  const priceFormatter = (amount) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount / 100);

  return itemCount ? (
    <div className="flex-1 text-xs">
      <div className="flex justify-between items-center">
        <span className="text-muted-foreground">Quantity</span>
        <QuantityButtons
          product={product}
          variant={variant}
          isOutOfStock={isOutOfStock}
        />
      </div>
      <div className="flex justify-between items-center border-t pt-1 font-semibold text-foreground">
        <span>Subtotal</span>
        <span className="text-sm">{priceFormatter(getSubtotalCents())}</span>
      </div>
    </div>
  ) : (
    <>
      <Button
        className="flex-1"
        disabled={isOutOfStock}
        onClick={() => {
          addItem({ product, variant, quantity: 1 });
          toast.success(`${product?.name?.substring(0, 25)}... added to cart!`);
        }}
      >
        Add to Cart
      </Button>
      <WishlistButton />
    </>
  );
};

export default ProductActions;
