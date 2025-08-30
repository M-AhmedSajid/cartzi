"use client";
import React, { useState } from "react";
import ProductDetails from "./ProductDetails";
import { ImageGallery } from "./ImageGallery";

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
    </>
  );
}

export default ProductView;
