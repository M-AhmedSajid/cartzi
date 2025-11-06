"use client";

import Link from "next/link";
import Image from "next/image";
import { urlFor } from "@/sanity/lib/image";
import PriceDisplay from "@/components/product/PriceDisplay";
import StarRating from "@/components/product/StarRating";
import WishlistButton from "@/components/product/WishlistButton";
import { Skeleton } from "@/components/ui/skeleton";
import ProductCard from "../product/ProductCard";

/**
 * ProductGrid.jsx
 * Renders a responsive grid of products for the Shop page.
 * Expects props.products = array of product documents from Sanity.
 */

const ProductGrid = ({ products }) => {
  if (!products?.length) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center w-full">
        <p className="text-lg font-medium">No products found.</p>
        <p className="text-sm text-muted-foreground">
          Try adjusting your filters or check back later!
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
      {products.map((product) => (
        <ProductCard key={product._id} product={product} />
      ))}
    </div>
  );
};

export default ProductGrid;
