import { urlFor } from "@/sanity/lib/image";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Button } from "./ui/button";
import { Heart } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";
import FormattedPrice from "./FormattedPrice";

const ProductCard = ({ product }) => {
  const isOutOfStock = product?.stock === 0;
  return (
    <Card className="overflow-hidden group w-full">
      <CardContent className="relative aspect-[3/4] flex-5 overflow-hidden rounded-t-lg">
        {isOutOfStock ? (
          <span className="bg-foreground/50 absolute inset-0 text-2xl text-background flex items-center justify-center font-semibold">
            Out of Stock
          </span>
        ) : (
          <span className="bg-primary absolute top-5 right-0 rounded-l-lg shadow text-xs leading-2.5 text-primary-foreground py-2 px-3 z-10">
            {product?.discount}% OFF
          </span>
        )}
        {product?.images && (
          <Link href={`/product/${product?._id}`}>
            <Image
              src={urlFor(product?.images[0]).url()}
              alt={product?.name}
              width={300}
              height={400.96}
              priority
              className={`w-full h-full object-cover overflow-hidden hoverEffect ${!isOutOfStock && "group-hover:scale-105"}`}
            />
          </Link>
        )}
      </CardContent>
      <CardHeader className="flex-2">
        <div>
          <CardTitle className="line-clamp-1">{product?.name}</CardTitle>
          <CardDescription>{product?.intro}</CardDescription>
        </div>
        <div>
          <FormattedPrice price={product?.price} discount={product?.discount} />
          <CardAction className="flex gap-1.5 justify-between items-center mt-2">
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
          </CardAction>
        </div>
      </CardHeader>
    </Card>
  );
};

export default ProductCard;
