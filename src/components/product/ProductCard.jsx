import { urlFor } from "@/sanity/lib/image";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import ProductActions from "./ProductActions";
import PriceDisplay from "./PriceDisplay";
import { Button } from "../ui/button";
import WishlistButton from "./WishlistButton";
import StarRating from "./StarRating";

const ProductCard = ({ product }) => {
  return (
    <Card className="overflow-hidden group w-full">
      <CardContent className="relative aspect-[3/4] flex-5 overflow-hidden rounded-t-lg">
        {product?.stock === 0 || product?.stock == null ? (
          <span className="bg-foreground/50 absolute inset-0 text-2xl text-background flex items-center justify-center font-semibold pointer-events-none z-10">
            Out of Stock
          </span>
        ) : (
          product?.discount !== 0 && (
            <span className="bg-primary absolute top-5 right-0 rounded-l-lg shadow text-xs leading-2.5 text-primary-foreground py-2 px-3 z-10">
              {product?.discount}% OFF
            </span>
          )
        )}
        {product?.image && (
          <Link href={`/product/${product?.slug}`}>
            <Image
              src={urlFor(product?.image)
                .width(300)
                .height(400)
                .auto("format")
                .url()}
              alt={product?.image?.alt}
              width={300}
              height={400}
              priority
              className="w-full h-full object-cover overflow-hidden hoverEffect group-hover:scale-105"
            />
          </Link>
        )}
      </CardContent>
      <CardHeader className="flex-2">
        <div>
          <CardTitle className="line-clamp-1">{product?.name}</CardTitle>
          <StarRating rating={product?.rating ?? 4.2} />
          <CardDescription className="line-clamp-2 mt-1">
            {product?.intro}
          </CardDescription>
        </div>
        <div>
          <PriceDisplay
            product={product}
            variant={product?.variants}
            size="text-xl"
          />
          {product?.variants === 0 || product?.variants == null ? (
            <CardAction className="flex gap-1.5 justify-between items-center mt-2">
              <ProductActions
                product={product}
                isOutOfStock={product?.stock === 0 || product?.stock == null}
              />
            </CardAction>
          ) : (
            <CardAction className="flex gap-1.5 justify-between items-center mt-2">
              <Button className="flex-1" asChild>
                <Link href={`/product/${product?.slug}`}>View Details</Link>
              </Button>
              <WishlistButton />
            </CardAction>
          )}
        </div>
      </CardHeader>
    </Card>
  );
};

export default ProductCard;
