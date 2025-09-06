"use client";
import React, { useEffect, useState } from "react";
import { Carousel, CarouselContent, CarouselItem } from "./ui/carousel";
import { client } from "@/sanity/lib/client";
import ProductCard from "./product/ProductCard";
import Autoplay from "embla-carousel-autoplay";
import SkelectonCard from "./product/SkelectonCard";
import Title from "./Title";

const FeaturedProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const query = `*[
      _type == "product" &&
          references(*[_type == "category" && slug.current == "featured"]._id)]
    | order(_createdAt desc)[0...8]{
      _id,
      name,
      intro,
      "slug": slug.current,
      price,
      discount,
      stock,
      "image": coalesce(
      variants[count(sizes[stock > 0]) > 0][0].images[0],
      variants[0].images[0],
      images[0]
    ),
    "stock": coalesce(
          variants[count(sizes[stock > 0]) > 0][0].sizes[stock > 0][0].stock,
          stock
        ),
    "variants": count(variants[])
    }
  `;

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await client.fetch(query);
        setProducts(await response);
      } catch (error) {
        console.log("Error in Product Fetching", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <section>
      <Title className="text-center">Hot Right Now</Title>
      <p className="text-sm mb-4 text-center">
        Trending looks, don&apos;t miss out.
      </p>
      <Carousel
        className="w-full px-10 lg:hidden"
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
                <CarouselItem key={i} className="md:basis-1/2">
                  <SkelectonCard />
                </CarouselItem>
              ))
            : products?.map((product) => (
                <CarouselItem key={product?.name} className="md:basis-1/2">
                  <ProductCard product={product} />
                </CarouselItem>
              ))}
        </CarouselContent>
      </Carousel>
      <div className="hidden lg:grid grid-cols-4 gap-6">
        {loading
          ? Array.from({ length: 8 }).map((x, i) => <SkelectonCard key={i} />)
          : products?.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
      </div>
    </section>
  );
};

export default FeaturedProducts;
