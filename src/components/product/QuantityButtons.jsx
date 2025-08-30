import React from "react";
import { Button } from "../ui/button";
import { Minus, Plus } from "lucide-react";

const QuantityButtons = ({ product }) => {
  const itemCount = 4;
  return (
    <div className="flex items-center gap-1 text-base pb-1">
      <Button variant="outline" size="icon" className="size-6">
        <Minus />
      </Button>
      <span className="w-8 text-center font-semibold text-foreground">{itemCount}</span>
      <Button variant="outline" size="icon" className="size-6">
        <Plus />
      </Button>
    </div>
  );
};

export default QuantityButtons;
