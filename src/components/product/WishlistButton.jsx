import React from "react";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";
import { Button } from "./ui/button";
import { Heart } from "lucide-react";

const WishlistButton = () => {
  return (
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
  );
};

export default WishlistButton;
