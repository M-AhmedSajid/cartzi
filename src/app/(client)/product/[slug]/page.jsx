import Container from "@/components/Container";
import { ImageGallery } from "@/components/ImageGallery";
import PriceFormatter from "@/components/PriceFormatter";
import ProductActions from "@/components/ProductActions";
import ShareButton from "@/components/ShareButton";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { getProductBySlug } from "@/sanity/helpers";
import { Ruler, Share, Truck } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import React from "react";

const SingleProductPage = async ({ params }) => {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) {
    return notFound();
  }
  return (
    <Container className="grid grid-cols-1 md:grid-cols-2 gap-10 py-10">
      <Breadcrumb className="md:col-span-2">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Home</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href="/components">Components</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Breadcrumb</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      {product?.images && (
        <ImageGallery
          images={product.images}
          alt={product?.name}
        ></ImageGallery>
      )}
      <div className="space-y-3">
        <h2 className="text-3xl md:text-4xl font-bold">{product?.name}</h2>
        <p>
          <span className="font-bold text-foreground text-2xl">
            {product?.price && <PriceFormatter amount={product?.price} />}
          </span>{" "}
          {product?.price && product?.discount && (
            <span className="line-through font-semibold text-base text-muted-foreground">
              <PriceFormatter
                amount={
                  product?.price + (product?.price * product?.discount) / 100
                }
              />
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
        <div className="flex gap-2.5 justify-between items-center mt-2">
          <ProductActions
            product={product}
            isOutOfStock={product?.stock === 0}
          />
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
          <ShareButton productName={product?.name} productUrl={slug} />
        </div>
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
    </Container>
  );
};

export default SingleProductPage;
