import ProductView from "@/components/product/ProductView";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { getReviewsByProduct } from "@/sanity/helpers";
import { getProductBySlug } from "@/sanity/helpers/product";
import { urlFor } from "@/sanity/lib/image";
import { currentUser } from "@clerk/nextjs/server";
import { notFound } from "next/navigation";
import React from "react";

export async function generateMetadata({ params }) {
  try {
    const { slug } = await params;
    const product = await getProductBySlug(slug);

    if (!product) {
      return {
        title: "Product Not Found",
        description: "The requested product could not be found.",
      };
    }

    // figure out the first available image (product first, then variant)
    let ogImage = null;
    let ogAlt = null;

    if (product.images?.length > 0) {
      ogImage = urlFor(product.images[0]);
      ogAlt = product.images[0].alt || product.name;
    } else if (product.variants?.[0]?.images?.length > 0) {
      ogImage = urlFor(product.variants[0].images[0]);
      ogAlt = product.variants[0].images[0].alt || product.name;
    }

    return {
      title: product.name || "Product",
      description: product.description || product.intro || "Product details",
      openGraph: {
        title: product.name,
        description: product.description || product.intro,
        images: ogImage
          ? [
              {
                url: ogImage,
                alt: ogAlt,
              },
            ]
          : [],
      },
    };
  } catch (error) {
    console.error("Error generating metadata:", error);
    return {
      title: "Product",
      description: "Product details",
    };
  }
}

const SingleProductPage = async ({ params }) => {
  const { slug } = await params;
  const user = await currentUser();
  const product = await getProductBySlug(slug);
  const reviews = await getReviewsByProduct(product._id, user ? user.id : null);

  if (!product) {
    return notFound();
  }
  return (
    <div className="max-w-screen-xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-5 pt-5 pb-10 md:gap-10 md:py-10">
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
      <ProductView product={product} reviews={reviews} />
    </div>
  );
};

export default SingleProductPage;
