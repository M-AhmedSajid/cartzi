"use client";
import React, { useState, useEffect, useRef } from "react";
import { urlFor } from "@/sanity/lib/image";
import Image from "next/image";
import { Carousel, CarouselContent, CarouselItem } from "../ui/carousel";
import { motion, AnimatePresence } from "motion/react";
import { Button } from "../ui/button";

export const ImageGallery = ({ images }) => {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [api, setApi] = useState(null);
  const [position, setPosition] = useState({
    left: 0,
    top: 0,
    width: 0,
    height: 0,
  });

  const thumbnailsContainerRef = useRef(null);
  const thumbnailRefs = useRef([]);

  const updateOverlayToIndex = (index) => {
    if (!thumbnailsContainerRef.current || !thumbnailRefs.current[index])
      return;
    const containerRect =
      thumbnailsContainerRef.current.getBoundingClientRect();
    const targetRect = thumbnailRefs.current[index].getBoundingClientRect();
    setPosition({
      left: targetRect.left - containerRect.left,
      top: targetRect.top - containerRect.top,
      width: targetRect.width,
      height: targetRect.height,
    });
  };

  useEffect(() => {
    if (!api) return;
    const onSelect = () => setCurrentSlide(api.selectedScrollSnap());
    api.on("select", onSelect);
    onSelect();
    return () => api.off("select", onSelect);
  }, [api]);

  // Update overlay whenever currentSlide or images change
  useEffect(() => {
    // Reset currentSlide if out of bounds
    if (currentSlide >= images.length) {
      setCurrentSlide(0);
      return;
    }

    // Delay until thumbnails exist
    const timeout = setTimeout(() => {
      updateOverlayToIndex(currentSlide);
    }, 0);

    return () => clearTimeout(timeout);
  }, [currentSlide, images]);

  useEffect(() => {
    const handleResize = () => updateOverlayToIndex(currentSlide);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [currentSlide]);

  return (
    <div className="space-y-4 w-full">
      <Carousel setApi={setApi} opts={{ align: "center", loop: true }}>
        <CarouselContent>
          {images?.map((img, i) => (
            <CarouselItem key={img?._key || i}>
              <div
                className="relative bg-card rounded-lg overflow-hidden aspect-[3/4] group border"
                onClick={() => setLightboxOpen(i)}
              >
                <Image
                  src={urlFor(img).url()}
                  alt={img.alt || `Product Image ${i + 1}`}
                  width={700}
                  height={936}
                  priority
                  className="w-full object-cover object-center h-full hoverEffect group-hover:scale-110"
                />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>

      <AnimatePresence>
        {lightboxOpen !== false && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="fixed inset-0 z-30 bg-black/90 flex items-center justify-center p-4 m-0"
            onClick={() => setLightboxOpen(false)}
          >
            <Button
              onClick={() => setLightboxOpen(false)}
              className="absolute top-6 md:top-4 right-4 z-50 text-background"
              size="icon"
            >
              ✕
            </Button>
            <div
              className="relative w-auto h-full aspect-[3/4] z-40"
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={urlFor(images[lightboxOpen]).url()}
                alt={
                  images[lightboxOpen]?.alt ||
                  `Product Image ${lightboxOpen + 1}`
                }
                className="w-full h-full object-contain"
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 80vw, 30vw"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div
        ref={thumbnailsContainerRef}
        className="grid grid-cols-4 gap-2 relative"
      >
        {images?.map((img, i) => (
          <button
            key={img?._key || i}
            onClick={() => api?.scrollTo(i)}
            className="aspect-square rounded-md border-3 overflow-hidden hover:border-accent"
            ref={(el) => (thumbnailRefs.current[i] = el)}
          >
            <Image
              src={urlFor(img).url()}
              alt={img?.alt || `Product Thumbnail ${i + 1}`}
              width={150}
              height={150}
              className="w-full h-full object-cover object-center"
            />
          </button>
        ))}
        <motion.div
          animate={position}
          transition={{ type: "spring", stiffness: 400, damping: 30 }}
          className="absolute rounded-md bg-primary/30 pointer-events-none border-3 border-primary"
        />
      </div>
    </div>
  );
};
