import React from "react";
import Title from "./Title";
import FeaturedProducts from "./FeaturedProducts";
import Container from "./Container";
import { HeroBG } from "./ui/hero-bg";

const HomeBanner = () => {
  return (
    // <div className="flex flex-col justify-center items-center relative overflow-hidden">
      <HeroBG>
        <Container className="space-y-10 py-10 relative w-full">
          <div className="text-center w-full md:absolute top-0 inset-x-0">
            <Title className="text-4xl md:text-6xl lg:text-8xl uppercase font-bold">
              Featured
            </Title>
          </div>
          <FeaturedProducts />
        </Container>
      </HeroBG>
    // </div>
  );
};

export default HomeBanner;
