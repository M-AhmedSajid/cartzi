import React from "react";
import Title from "../Title";
import Container from "../Container";
import { HeroBG } from "../ui/hero-bg";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { categoriesData } from "@/constants";
import { Search } from "lucide-react";
import Link from "next/link";
import { Dialog, DialogTrigger } from "../ui/dialog";
import SearchDialog from "../SearchDialog";

const HeroSection = () => {
  return (
    <HeroBG>
      <Container className="space-y-10 pt-10 relative w-full text-center">
        <Title className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 md:mb-10">
          Affordable style, perfect fit
        </Title>

        {/* Search */}
        <Dialog>
          <DialogTrigger asChild>
            <div className="max-w-md w-full mx-auto gap-2 flex items-center justify-center cursor-pointer">
              <Input
                type="text"
                disabled
                placeholder="Search hoodies, jeans, kids tees..."
                className="disable:pointer-events-all disable:opacity-100"
              />
              <Button size="icon">
                <Search />
              </Button>
            </div>
          </DialogTrigger>
          <SearchDialog />
        </Dialog>

        {/* Category chips */}
        <div className="flex flex-wrap justify-center gap-2 mt-4">
          {categoriesData.map((ctg) => (
            <Button
              key={ctg.title}
              variant="outline"
              size="sm"
              className="rounded-full px-4"
              asChild
            >
              <Link href={`/category${ctg.href}`}>{ctg.title}</Link>
            </Button>
          ))}
        </div>

        {/* Promo bar */}
        {/* <div className="bg-black text-white text-sm rounded-lg py-2 px-4 mt-6 inline-block">
          Back-to-School Sale • Up to 30% Off
        </div> */}

        {/* Size help links */}
        <div className="flex justify-center gap-6 mt-6 text-sm text-gray-600">
          <Button variant="link">✔ Find your size</Button>
          <Button variant="link">📏 Size guide</Button>
        </div>
      </Container>
    </HeroBG>
  );
};

export default HeroSection;
