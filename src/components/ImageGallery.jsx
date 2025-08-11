"use client";
import { urlFor } from "@/sanity/lib/image";
import { ChevronLeftIcon, ChevronRightIcon, ZoomInIcon } from "lucide-react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { Carousel, CarouselContent, CarouselItem } from "./ui/carousel";
import { motion, AnimatePresence } from "motion/react";
import { Button } from "./ui/button";

export const ImageGallery = ({ images, alt }) => {
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

    const onSelect = () => {
      setCurrentSlide(api.selectedScrollSnap());
    };

    api.on("select", onSelect);
    onSelect();

    return () => {
      api.off("select", onSelect);
    };
  }, [api]);

  useEffect(() => {
    updateOverlayToIndex(currentSlide);
  }, [currentSlide, images]);

  useEffect(() => {
    const handleResize = () => updateOverlayToIndex(currentSlide);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [currentSlide]);
  return (
    <div className="space-y-4 w-full">
      <Carousel
        setApi={setApi}
        opts={{
          align: "center",
          loop: true,
        }}
      >
        <CarouselContent>
          {images?.map((img, i) => (
            <CarouselItem key={img?._key}>
              <div
                className="relative bg-card rounded-lg overflow-hidden aspect-[3/4] group border"
                onClick={() => setLightboxOpen(i)}
              >
                <Image
                  src={urlFor(img).url()}
                  alt={`${alt}-${i + 1}`}
                  width={700}
                  height={936}
                  priority
                  className="w-full object-contain hoverEffect group-hover:scale-110"
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
              className="absolute top-4 right-4 z-10 text-background"
              size="icon"
              variant="ghost"
            >
              ✕
            </Button>
            <div
              className="relative w-auto h-full aspect-[3/4] z-40"
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={urlFor(images[lightboxOpen]).url()}
                alt={`${alt}-${lightboxOpen}`}
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
        {images.map((img, i) => (
          <button
            key={img?._key}
            onClick={() => api?.scrollTo(i)}
            className="aspect-square rounded-md border-3 overflow-hidden hover:border-accent"
            ref={(el) => (thumbnailRefs.current[i] = el)}
          >
            <Image
              src={urlFor(img).url()}
              alt={`${alt}-${i + 1}`}
              width={150}
              height={150}
              className="w-full object-cover"
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
