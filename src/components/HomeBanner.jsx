import React from "react";
import Title from "./Title";

const HomeBanner = () => {
  return (
    <div className="flex justify-between items-center gap-5">
      <div className="flex flex-col justify-center gap-5 w-full lg:w-1/2">
        <Title className="text-3xl md:text-4xl uppercase font-bold">
          Wear Confidence Daily
        </Title>
        <p className="text-md font-medium text-muted-foreground max-w-[480px]">
          Discover premium fashion handpicked for bold personalities.
        </p>
      </div>
      <div className="lg:w-1/2 overflow-hidden">
        
      </div>
    </div>
  );
};

export default HomeBanner;
