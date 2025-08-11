import Container from "@/components/Container";
import { ImageGallery } from "@/components/ImageGallery";
import PriceFormatter from "@/components/PriceFormatter";
import ProductActions from "@/components/ProductActions";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { getProductBySlug } from "@/sanity/helpers";
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
        <div className="flex gap-1.5 justify-between items-center mt-2">
          <ProductActions
            product={product}
            isOutOfStock={product?.stock === 0}
          />
        </div>
      </div>
    </Container>
  );
};

export default SingleProductPage;
