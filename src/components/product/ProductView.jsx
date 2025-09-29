"use client";
import { useState } from "react";
import { ImageGallery } from "./ImageGallery";
import ProductDetails from "./ProductDetails";
import ProductTabs from "./ProductTabs";

function ProductView({ product }) {
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
      />
      <ProductTabs product={product} />
    </>
  );
}

export default ProductView;
