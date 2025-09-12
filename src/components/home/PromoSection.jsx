"use client";

import Image from "next/image";
import Link from "next/link";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import { useEffect, useState } from "react";
import { client } from "@/sanity/lib/client";
import { urlFor } from "@/sanity/lib/image";
import { Button } from "../ui/button";

export default function PromoSection() {
  const [promos, setPromos] = useState([]);
  const [loading, setLoading] = useState(true);
  const query = `*[
    _type == "promo" &&
    isActive == true &&
    (!defined(startDate) || startDate <= now()) &&
    (!defined(endDate) || endDate >= now())
    ]
    | order(priority asc, startDate asc)
    {
        _id,
        internalTitle,
        title,
        subtitle,
        image,
        ctaText,
        ctaLink,
        priority,
        startDate,
        endDate,
        isActive
      }`;

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await client.fetch(query);
        setPromos(await response);
      } catch (error) {
        console.log("Error in Promos Fetching", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (!loading && promos.length === 0) return null;

  // Single promo → render banner
  if (promos.length === 1) {
    const promo = promos[0];
    return (
      <section className="relative w-full aspect-square md:aspect-video lg:aspect-[21/9] overflow-hidden">
        <Image
          src={urlFor(promo.image).url()}
          alt={promo.image.alt || promo.title}
          fill
          className="object-cover w-full h-full"
          priority
        />
        <div className="absolute inset-0 bg-foreground/60 flex flex-col items-center justify-center text-center text-background px-4">
          <h2 className="text-3xl md:text-5xl font-bold mb-2">{promo.title}</h2>
          <p className="text-base md:text-xl mb-4">{promo.subtitle}</p>
          <Button size="lg" variant="secondary" asChild>
            <Link href={promo.ctaLink}>{promo.ctaText}</Link>
          </Button>
        </div>
      </section>
    );
  }

  // Multiple promos → render carousel with autoplay
  return (
    <section className="max-w-screen-xl mx-auto px-4 relative w-full">
      <Carousel
        className="w-full rounded-2xl overflow-hidden"
        plugins={[Autoplay({ delay: 4000 })]} // autoplay every 4s
        opts={{ loop: true }}
      >
        <CarouselContent>
          {promos.map((promo) => (
            <CarouselItem key={promo._id}>
              <div className="relative w-full aspect-square md:aspect-video lg:aspect-[21/9] overflow-hidden rounded-2xl">
                <Image
                  src={urlFor(promo.image).url()}
                  alt={promo.image.alt || promo.title}
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-foreground/60 flex flex-col items-center justify-center text-center text-background px-4">
                  <h2 className="text-3xl md:text-5xl font-bold mb-2">
                    {promo.title}
                  </h2>
                  <p className="text-base md:text-xl mb-4">{promo.subtitle}</p>
                  <Button size="lg" variant="secondary" asChild>
                    <Link href={promo.ctaLink}>{promo.ctaText}</Link>
                  </Button>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </section>
  );
}
