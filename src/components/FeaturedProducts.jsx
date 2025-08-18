"use client";
import React, { useEffect, useState } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "./ui/carousel";
import { client } from "@/sanity/lib/client";
import ProductCard from "./ProductCard";
import Autoplay from "embla-carousel-autoplay";
import SkelectonCard from "./SkelectonCard";

const FeaturedProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [api, setApi] = useState(null);
  const query = `*[_type == "product" && "86031097-8d30-47fb-b901-c55d95b8e79d" in categories[]._ref] | order(_createdAt desc)[0...5]`;

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await client.fetch(query);
        setProducts(await response);
        console.log(await response);
      } catch (error) {
        console.log("Error in Product Fetching", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (!api) return;

    const onSelect = () => {
      setCurrentSlide(api.selectedScrollSnap());
    };

    api.on("select", onSelect);
    onSelect();

    return () => {
      api.off("select", onSelect);
    };
  }, [api]);

  return (
    <Carousel
      className="w-full md:py-5 lg:py-14 px-10"
      setApi={setApi}
      opts={{
        align: "center",
        loop: true,
      }}
      plugins={[
        Autoplay({
          delay: 3500,
        }),
      ]}
    >
      <CarouselContent>
        {loading
          ? Array.from({ length: 3 }).map((x, i) => (
              <CarouselItem key={i} className="md:basis-1/3">
                <div className={`hoverEffect ${i % 2 === 0 && "scale-75"}`}>
                  <SkelectonCard />
                </div>
              </CarouselItem>
            ))
          : products?.map((product, index) => (
              <CarouselItem key={product?.name} className="md:basis-1/3">
                <div
                  className={`hoverEffect ${
                    currentSlide !== index && "scale-75"
                  }`}
                >
                  <ProductCard product={product} />
                </div>
              </CarouselItem>
            ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  );
};

export default FeaturedProducts;
