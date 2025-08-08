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
} from "./ui/card";
import ProductActions from "./ProductActions";
import PriceFormatter from "./PriceFormatter";

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
          <Link href={`/product/${product?.slug?.current}`}>
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
          <p>
      <span className="font-semibold text-foreground text-xl">
        {product?.price && <PriceFormatter amount={product?.price} />}
      </span>{" "}
      {product?.price && product?.discount && (
        <span className="line-through font-medium text-sm text-muted-foreground">
          <PriceFormatter amount={product?.price + (product?.price * product?.discount) / 100} />
        </span>
      )}
    </p>
          <CardAction className="flex gap-1.5 justify-between items-center mt-2">
            <ProductActions product={product} isOutOfStock={isOutOfStock} />
          </CardAction>
        </div>
      </CardHeader>
    </Card>
  );
};

export default ProductCard;
