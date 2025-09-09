import React from "react";
import { Button } from "../ui/button";
import { Minus, Plus } from "lucide-react";
import useCartStore from "../../../store";
import { toast } from "sonner";

const QuantityButtons = ({ product, variant, isOutOfStock }) => {
  const { increment, decrement, getItemQuantity } = useCartStore();
  const itemCount = getItemQuantity(product, variant);

  const handleMinusAction = () => {
    if (itemCount > 1) {
      decrement(product, variant);
    } else if (itemCount === 1) {
      decrement(product, variant);
      toast.success(`${product?.name?.substring(0, 25)}... removed from cart!`);
    }
  };

  const handlePlusAction = function () {
    const stock = product?.variants?.length
      ? (variant?.stock ?? 0)
      : (product?.stock ?? 0);
    if (itemCount >= stock) {
      toast.error(`Only ${stock} items available in stock!`);
      return;
    }
    increment(product, variant);
  };

  return (
    <div className="flex items-center gap-1 text-base pb-1">
      <Button
        variant="outline"
        size="icon"
        className="size-5 rounded-sm"
        disabled={itemCount === 0 || isOutOfStock}
        onClick={handleMinusAction}
      >
        <Minus className="size-4" />
      </Button>
      <span className="w-8 text-center text-sm font-semibold text-foreground">
        {itemCount}
      </span>
      <Button
        variant="outline"
        size="icon"
        className="size-5 rounded-sm"
        disabled={isOutOfStock}
        onClick={handlePlusAction}
      >
        <Plus className="size-4" />
      </Button>
    </div>
  );
};

export default QuantityButtons;
