"use client"
import React from "react";
import { Button } from "../ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import { Heart } from "lucide-react";
import QuantityButtons from "./QuantityButtons";
import PriceFormatter from "../PriceFormatter";

const ProductActions = ({ product, isOutOfStock }) => {
  const itemCount = 0;
  return itemCount ? (
    <div className="flex-1 text-xs">
      <div className="flex justify-between items-center">
        <span className="text-muted-foreground">Quantity</span>
        <QuantityButtons product={product} />
      </div>
      <div className="flex justify-between items-center border-t pt-1 font-semibold text-foreground">
        <span>Subtotal</span>
        <span className="text-sm">
          <PriceFormatter
            amount={product?.price ? product?.price * itemCount : 0}
          />
        </span>
      </div>
    </div>
  ) : (
    <>
      <Button className="flex-1" disabled={isOutOfStock}>
        Add to Cart
      </Button>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button size="icon" variant="outline">
            <Heart />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Add to Wishlist</p>
        </TooltipContent>
      </Tooltip>
    </>
  );
};

export default ProductActions;
