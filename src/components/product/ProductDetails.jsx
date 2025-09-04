"use client";
import VariantsSelection from "@/components/product/VariantsSelection";
import ProductActions from "@/components/product/ProductActions";
import ShareButton from "@/components/ShareButton";
import { Button } from "@/components/ui/button";
import {
  Feather,
  Grid,
  Ruler,
  RulerIcon,
  Scale,
  Tag,
  Truck,
} from "lucide-react";
import Link from "next/link";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import PriceDisplay from "../PriceDisplay";

const ProductDetails = ({ product, variant, setVariant }) => {

  const isInStock = () => {
    if (variant) {
      return variant.stock > 0;
    }
    if (product?.variants?.length) {
      return product.variants.some((v) => v.stock > 0);
    }
    return product?.stock > 0;
  };

  return (
    <div className="space-y-3">
      <h2 className="text-3xl md:text-4xl/10 font-bold">{product?.name}</h2>
      <p className="text-muted-foreground text-xs">
        {product?.sku || (variant && variant.sku)}
      </p>
      <PriceDisplay product={product} variant={variant} size="text-2xl" />
      {isInStock() ? (
        <p className="w-fit bg-green-100 text-green-600 text-center text-sm py-2.5 px-5 font-semibold rounded-lg">
          In Stock
        </p>
      ) : (
        <p className="w-fit bg-red-100 text-red-600 text-center text-sm py-2.5 px-5 font-semibold rounded-lg">
          Out of Stock
        </p>
      )}
      <p className="text-sm text-muted-foreground tracking-wide">
        {product?.description}
      </p>
      {product?.variants && (
        <VariantsSelection variants={product?.variants} onChange={setVariant} />
      )}
      <div className="flex gap-2.5 justify-between items-center mt-2">
        <ProductActions product={product} variant={variant} isOutOfStock={!isInStock()} />
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
      <Accordion defaultValue="characteristics" collapsible>
        <AccordionItem value="characteristics">
          <AccordionTrigger className="capitalize">
            {product?.name}: Characterstics
          </AccordionTrigger>
          <AccordionContent className="space-y-2">
            {product.material && (
              <div className="flex justify-between items-center gap-3">
                <span className="font-semibold flex items-center gap-2">
                  <Feather className="h-4 w-4" />
                  Material:
                </span>
                <span className="font-medium text-right">
                  {product?.material.name}
                </span>
              </div>
            )}
            <div className="flex justify-between items-center gap-3">
              <span className="font-semibold flex items-center gap-2">
                <Grid className="h-4 w-4" />
                Categories:
              </span>
              <div className="flex flex-wrap gap-1 justify-end">
                {product.categories.map((ctg) => {
                  const fullPath = ctg.parent
                    ? `${ctg.parent.name} > ${ctg.name}`
                    : ctg.name;
                  return (
                    <Badge
                      key={ctg._id}
                      variant="secondary"
                      className="text-xs"
                    >
                      {fullPath}
                    </Badge>
                  );
                })}
              </div>
            </div>
            <div className="flex justify-between gap-3 items-center">
              <span className="font-semibold flex items-center gap-2">
                <Tag className="h-4 w-4" />
                Tags:
              </span>
              <div className="flex flex-wrap gap-1 justify-end">
                {product.tags.map((tag, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
            {product.weight && (
              <div className="flex justify-between gap-3 items-center">
                <span className="font-semibold flex items-center gap-2">
                  <Scale className="h-4 w-4" />
                  Weight:
                </span>
                <span className="font-medium text-right">
                  {product.weight.value} {product.weight.unit}
                </span>
              </div>
            )}
            {product.dimensions && (
              <div className="flex justify-between gap-3 items-center">
                <span className="font-semibold flex items-center gap-2">
                  <RulerIcon className="h-4 w-4" />
                  Dimensions:
                </span>
                <span className="font-medium text-right text-sm">
                  {product.dimensions.length} x {product.dimensions.width} x{" "}
                  {product.dimensions.height} {product.dimensions.unit}
                </span>
              </div>
            )}
            <Separator />

            <div className="text-xs text-muted-foreground text-center">
              Product information may vary. Please refer to the product images
              and description for accurate details.
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
