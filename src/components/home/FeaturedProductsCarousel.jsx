"use client"
import React from "react";
import { Carousel, CarouselContent, CarouselItem } from "../ui/carousel";
import ProductCard from "../product/ProductCard";
import Autoplay from "embla-carousel-autoplay";

export const FeaturedProductsCarousel = ({ products }) => {
  return (
    <>
      <Carousel
        className="w-full px-10 lg:hidden"
        opts={{
          loop: true,
        }}
        plugins={[
          Autoplay({
            delay: 3500,
          }),
        ]}
      >
        <CarouselContent>
          {products?.map((product) => (
            <CarouselItem key={product?._id} className="md:basis-1/2">
              <ProductCard product={product} />
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
      <div className="hidden lg:grid grid-cols-4 gap-6">
        {products?.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>
    </>
  );
};
