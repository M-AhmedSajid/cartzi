"use client";
import { useState } from "react";
import { ImageGallery } from "./ImageGallery";
import ProductDetails from "./ProductDetails";
import ProductTabs from "./ProductTabs";

function ProductView({ product, reviews }) {
  const [variant, setVariant] = useState(null);

  return (
    <>
      {product?.images || variant ? (
        <ImageGallery images={variant ? variant.images : product.images} />
      ) : (
        <div className="w-full"></div>
      )}
      <ProductDetails
        product={product}
        variant={variant}
        setVariant={setVariant}
        reviews={reviews}
      />
      <ProductTabs product={product} reviews={reviews} />
    </>
  );
}

export default ProductView;
