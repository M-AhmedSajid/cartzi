import React from "react";
import Link from "next/link";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import Logo from "./Logo";
import SocialMedia from "../SocialMedia";
import { categoriesData, quickLinks } from "../../constants";

const paymentProviders = [
  { name: "Stripe", src: "/payments/stripe.svg" },
  { name: "Visa", src: "/payments/visa.svg" },
  { name: "MasterCard", src: "/payments/mastercard.svg" },
];

const Footer = () => {
  return (
    <footer className="border-t">
      <div className="max-w-screen-xl mx-auto px-4 sm:px-10 lg:px-4 py-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {/* Brand */}
        <div className="space-y-4 sm:col-span-2 lg:col-span-1">
          <Logo>Cartzi</Logo>
          <p className="text-sm text-muted-foreground">
            Cartzi brings you handpicked clothing and accessories that blend
            style, comfort, and quality — empowering you to wear confidence
            every day.
          </p>
          <SocialMedia />
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="font-semibold text-foreground mb-4">Quick Links</h3>
          <nav className="flex flex-col gap-3">
            {quickLinks?.map((item) => (
              <Link
                key={item?.title}
                href={item?.href}
                className="text-muted-foreground hover:text-foreground text-sm font-medium hoverEffect w-fit"
              >
                {item?.title}
              </Link>
            ))}
          </nav>
        </div>

        {/* Categories */}
        <div>
          <h3 className="font-semibold text-foreground mb-4">Categories</h3>
          <nav className="flex flex-col gap-3">
            {categoriesData?.map((item) => (
              <Link
                key={item?.title}
                href={`/category${item?.href}`}
                className="text-muted-foreground hover:text-foreground text-sm font-medium hoverEffect w-fit"
              >
                {item?.title}
              </Link>
            ))}
          </nav>
        </div>

        {/* Newsletter */}
        <div className="space-y-4 sm:col-span-2 lg:col-span-1">
          <h3 className="font-semibold text-foreground">Stay in the Loop</h3>
          <p className="text-muted-foreground text-sm">
            Join our list to get <span className="font-medium">10% off</span>{" "}
            your first order, plus style tips & early access to new drops.
          </p>
          <form className="space-y-3">
            <Input
              type="email"
              placeholder="Enter your email"
              required
              className="border-accent focus-visible:ring-2 focus-visible:ring-accent/90 focus-visible:border-accent"
            />
            <Button className="w-full" type="submit">
              Subscribe & Save
            </Button>
          </form>
        </div>
      </div>

      {/* Bottom copyright */}
      <div className="py-6 text-center text-sm text-muted-foreground border-t">
        &copy; {new Date().getFullYear()} Cartzi. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
