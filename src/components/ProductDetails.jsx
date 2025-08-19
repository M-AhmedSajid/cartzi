"use client"
import VariantsSelection from "@/components/VariantsSelection";
import PriceFormatter from "@/components/PriceFormatter";
import ProductActions from "@/components/ProductActions";
import ShareButton from "@/components/ShareButton";
import { Button } from "@/components/ui/button";
import { Ruler, Truck } from "lucide-react";
import Link from "next/link";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useState } from "react";

const ProductDetails = ({ product }) => {
  const [variant, setVariant] = useState(null);
  return (
    <div className="space-y-3">
      <h2 className="text-3xl md:text-4xl font-bold mb-0">{product?.name}</h2>
      <p className="text-muted-foreground text-xs">
        {product?.sku || (variant && variant.sku)}
      </p>
      <p>
        <span className="font-bold text-foreground text-2xl">
          <PriceFormatter amount={product?.discountedPrice} />
        </span>{" "}
        {product?.price && product?.discount && (
          <span className="line-through font-semibold text-base text-muted-foreground">
            {product?.price && <PriceFormatter amount={product?.price} />}
          </span>
        )}
      </p>
      {product?.stock && (
        <p className="w-24 bg-green-100 text-green-600 text-center text-sm py-2.5 font-semibold rounded-lg">
          In Stock
        </p>
      )}
      <p className="text-sm text-muted-foreground tracking-wide">
        {product?.description}
      </p>
      {product?.variants && (
        <VariantsSelection variants={product?.variants} onChange={setVariant} />
      )}
      <div className="flex gap-2.5 justify-between items-center mt-2">
        <ProductActions product={product} isOutOfStock={product?.stock === 0} />
      </div>
      <div className="flex flex-wrap items-center gap-2.5 justify-between border-b py-5 -mt-2">
        <Button variant="link" asChild>
          <Link href="/shipping-returns">
            <Ruler className="inline-block" />
            <span>Size Guide</span>
          </Link>
        </Button>
        <Button variant="link" asChild>
          <Link href="/shipping-returns">
            <Truck className="inline-block" />
            <span>Shipping and Return</span>
          </Link>
        </Button>
        <ShareButton
          productName={product?.name}
          productUrl={product?.slug.current}
        />
      </div>
      <Accordion defaultValue="item-1" collapsible>
        <AccordionItem value="item-1">
          <AccordionTrigger className="capitalize">
            {product?.name}: Characterstics
          </AccordionTrigger>
          <AccordionContent>
            <div className="flex justify-between items-center">
              <span className="font-semibold">Material:</span>
              <span className="font-medium">{product?.material.name}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-semibold">Categories:</span>
              <span className="font-medium">
                {product?.categories.map((ctg) => ctg.name).join(", ")}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-semibold">Tags:</span>
              <span className="font-medium">{product?.tags.join(", ")}</span>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="border text-center p-3 rounded-md hoverEffect hover:border-primary">
          <p className="text-base text-foreground font-semibold">
            Free Shipping
          </p>
          <p className="text-sm text-muted-foreground">
            Enjoy free shipping over orders $100.
          </p>
        </div>
        <div className="border text-center p-3 rounded-md hoverEffect hover:border-primary">
          <p className="text-base text-foreground font-semibold">
            Flexible Payment
          </p>
          <p className="text-sm text-muted-foreground">
            Multiple payment methods available.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
