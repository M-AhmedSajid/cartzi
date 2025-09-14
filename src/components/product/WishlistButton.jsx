import React from "react";
import { Button } from "../ui/button";
import { Heart } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";

const WishlistButton = ({className, size}) => {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button size="icon" variant="outline" className={className}>
          <Heart className={size} />
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        <p>Add to Wishlist</p>
      </TooltipContent>
    </Tooltip>
  );
};

export default WishlistButton;
