import Container from "@/components/Container";
import { ImageGallery } from "@/components/ImageGallery";
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
import ProductDetails from "@/components/ProductDetails";

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  return {
    title: product.name,
    description: product.description,
  };
}

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
          {product?.categories[0]?.parent?.name && (
            <>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink
                  href={`/${product?.categories[0]?.parent?.slug.current}`}
                >
                  {product?.categories[0]?.parent?.name}
                </BreadcrumbLink>
              </BreadcrumbItem>
            </>
          )}
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href={`/${product?.categories[0]?.slug.current}`}>
              {product?.categories[0]?.name}
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{product?.name}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      {product?.images && (
        <ImageGallery
          images={product.images}
          alt={product?.name}
        ></ImageGallery>
      )}
      <ProductDetails product={product} />
    </Container>
  );
};

export default SingleProductPage;
