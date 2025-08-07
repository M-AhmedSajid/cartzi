"use client";
import React, { useEffect, useState } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "./ui/carousel";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Skeleton } from "./ui/skeleton";
import Image from "next/image";
import Link from "next/link";
import { client } from "@/sanity/lib/client";
import { urlFor } from "@/sanity/lib/image";
import { Button } from "./ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";
import { Heart } from "lucide-react";
import FormattedPrice from "./FormattedPrice";
import ProductCard from "./ProductCard";
import Autoplay from "embla-carousel-autoplay";
import SkelectonCard from "./SkelectonCard";

const FeaturedProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [api, setApi] = useState(null);
  const query = `*[_type == "product" && "1e7a9319-b883-466e-8f47-a07504b8a537" in categories[]._ref] | order(_createdAt desc)[0...5]`;

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
          delay: 2000,
        }),
      ]}
    >
      <CarouselContent>
        {loading
          ? Array.from({ length: 8 }).map((x, i) => (
              <CarouselItem key={i} className="md:basis-1/3">
                <div
                  className={`hoverEffect ${
                    currentSlide !== i && "scale-75"
                  }`}
                >
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
