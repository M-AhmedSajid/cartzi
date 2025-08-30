import React from "react";
import Link from "next/link";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import Logo from "../Logo";
import SocialMedia from "../SocialMedia";
import { categoriesData, quickLinks } from "../../constants";
import Container from "../Container";

const Footer = () => {
  return (
    <footer className="border-t">
      <Container className="py-10 grid grid-cols-2 lg:grid-cols-4 gap-8">
        <div className="space-y-4 col-span-2 lg:col-span-1">
          <Logo>Cartzi</Logo>
          <p className="text-sm text-muted-foreground">
            Cartzi brings you handpicked clothing and accessories that blend
            style, comfort, and quality, empowering you to wear confidence every
            day
          </p>
          <SocialMedia />
        </div>
        <div>
          <h3 className="font-semibold text-foreground mb-4">Quick Links</h3>
          <nav className="flex flex-col gap-3">
            {quickLinks?.map((item) => (
              <Link
                key={item?.title}
                href={item?.href}
                className="text-muted-foreground hover:text-foreground text-sm font-medium hoverEffect"
              >
                {item?.title}
              </Link>
            ))}
          </nav>
        </div>
        <div>
          <h3 className="font-semibold text-foreground mb-4">Categories</h3>
          <nav className="flex flex-col gap-3">
            {categoriesData?.map((item) => (
              <Link
                key={item?.title}
                href={`/category${item?.href}`}
                className="text-muted-foreground hover:text-foreground text-sm font-medium hoverEffect"
              >
                {item?.title}
              </Link>
            ))}
          </nav>
        </div>
        <div className="space-y-4 col-span-2 lg:col-span-1">
          <h3 className="font-semibold text-foreground">Newsletter</h3>
          <p className="text-muted-foreground text-sm">
            Subscribe to our newsletter to reciecve updates and exclusive
            offers.
          </p>
          <form className="space-y-3">
            <Input
              type="email"
              placeholder="Enter your email"
              required
              className="border-accent focus-visible:ring-2 focus-visible:ring-accent/90 focus-visible:border-accent"
            />
            <Button className="w-full" type="submit">
              Subscribe
            </Button>
          </form>
        </div>
      </Container>
      <div className="py-6 text-center text-sm text-muted-foreground border-t">
      &copy; 2025 Tulos. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
