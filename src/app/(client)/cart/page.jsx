"use client";
import React, { useEffect, useState } from "react";
import useCartStore from "../../../../store";
import EmptyCart from "@/components/EmptyCart";
import { Heart, ShoppingCart, Trash, Trash2 } from "lucide-react";
import Link from "next/link";
import PriceDisplay from "@/components/product/PriceDisplay";
import StarRating from "@/components/product/StarRating";
import Image from "next/image";
import { urlFor } from "@/sanity/lib/image";
import { Button } from "@/components/ui/button";
import WishlistButton from "@/components/product/WishlistButton";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { toast } from "sonner";
import ProductActions from "@/components/product/ProductActions";
import { priceFormatter } from "@/lib";
import { Separator } from "@/components/ui/separator";
import { ResetCartButton } from "@/components/ResetCart";
import { Skeleton } from "@/components/ui/skeleton";

const CartPage = () => {
  const [isClient, setIsClient] = useState(false);
  const {
    removeItem,
    getCartCount,
    getSubtotalCents,
    getItems,
    getTotalCents,
  } = useCartStore();

  const cartProducts = getItems();

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleRemoveItem = (product, variant) => {
    removeItem(product, variant);
    toast.success("Item removed from cart!");
  };

  const handleCheckout = () => {
    toast.error("Checkout is Building ;)");
  };

  return (
    <div className="max-w-screen-xl mx-auto py-5 md:py-10 px-4">
      {cartProducts.length ? (
        <>
          <div className="flex items-center gap-2 pb-5">
            <ShoppingCart />
            <h1 className="text-2xl font-semibold">Shopping Cart</h1>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Products */}
            <div className="md:col-span-2">
              <div className="bg-card border rounded-lg shadow">
                {!isClient
                  ? Array.from({ length: 3 }).map((_, i) => (
                      <div
                        className="p-2 flex items-center gap-3 md:gap-5 border-b last:border-b-0"
                        key={i}
                      >
                        {/* Thumbnail placeholder */}
                        <div className="relative bg-card rounded-md overflow-hidden aspect-[3/4] border w-28 md:w-[7.5rem] shrink-0">
                          <Skeleton className="w-full h-full" />
                        </div>

                        {/* Content placeholders */}
                        <div className="flex-grow space-y-1">
                          {/* Title + actions */}
                          <div className="flex items-center justify-between gap-2">
                            <Skeleton className="h-5 w-4/5" />
                            <div className="flex items-center gap-2">
                              <Skeleton className="h-7 w-7 rounded-md" />
                              <Skeleton className="h-7 w-7 rounded-md" />
                            </div>
                          </div>

                          {/* Variant line */}
                          <Skeleton className="h-4 w-30" />

                          {/* Intro line */}
                          <Skeleton className="h-4 w-full" />

                          {/* Rating */}
                          <Skeleton className="h-4 w-28" />

                          {/* Price */}
                          <div className="flex items-baseline gap-1">
                            <Skeleton className="h-4 w-16" />
                            <Skeleton className="h-3 w-12" />
                          </div>
                          {/* Product Actions (qty stepper etc.) */}
                          <div className="flex-1 text-xs">
                            <div className="flex justify-between items-center">
                              <Skeleton className="h-4 w-12" />
                              <div className="flex items-center gap-1 text-base pb-1">
                                <Skeleton className="h-5 w-5" />
                                <Skeleton className="h-5 w-8" />
                                <Skeleton className="h-5 w-5" />
                              </div>
                            </div>
                            <div className="flex justify-between items-center border-t pt-1 font-semibold text-foreground">
                              <Skeleton className="h-4 w-12" />
                              <Skeleton className="h-5 w-12" />
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  : cartProducts.map((item) => {
                      return (
                        <div
                          key={item?.key}
                          className="p-2 flex items-center gap-3 md:gap-5 border-b last:border-b-0"
                        >
                          <Link href={`/product/${item?.slug}`}>
                            <div className="relative bg-card rounded-md overflow-hidden aspect-[3/4] group border w-28 md:w-[7.5rem] shrink-0">
                              <Image
                                src={urlFor(item?.image)
                                  .width(100)
                                  .height(130)
                                  .auto("format")
                                  .url()}
                                alt={item?.image?.alt}
                                width={100}
                                height={130}
                                loading="lazy"
                                className="w-full h-full object-cover overflow-hidden hoverEffect group-hover:scale-105"
                              />
                            </div>
                          </Link>
                          <div className="flex-grow">
                            <div className="flex items-center justify-between gap-2">
                              <h3 className="text-base md:text-lg font-semibold line-clamp-1">
                                <Link href={`/product/${item?.slug}`}>
                                  {item.name}
                                </Link>
                              </h3>
                              <div className="flex items-center gap-2">
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Button
                                      variant="outline"
                                      size="icon"
                                      className="size-6 md:size-7"
                                      onClick={() =>
                                        handleRemoveItem(
                                          item.product,
                                          item.variant
                                        )
                                      }
                                    >
                                      <Trash className="size-4 md:size-5" />
                                    </Button>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p>Remove Product</p>
                                  </TooltipContent>
                                </Tooltip>
                                <WishlistButton
                                  size="size-4 md:size-5"
                                  className="size-6 md:size-7"
                                />
                              </div>
                            </div>
                            {item.variant?.colorName && (
                              <p className="text-sm font-semibold text-muted-foreground">
                                {item?.variant?.colorName}{" "}
                                {item.variant?.size &&
                                  "/ " + item?.variant?.size}
                              </p>
                            )}
                            <p className="text-sm text-muted-foreground line-clamp-1">
                              {item.product?.intro}
                            </p>
                            <StarRating
                              rating={item?.rating ?? 4.2}
                              size="size-3.5"
                            />
                            <PriceDisplay
                              product={item.product}
                              variant={item?.product?.variants}
                              size="text-base"
                            />
                            <ProductActions
                              product={item.product}
                              variant={item?.variant}
                              isOutOfStock={
                                item.variant?.stock === 0 ||
                                item.variant?.stock == null
                              }
                            />
                          </div>
                        </div>
                      );
                    })}
                <ResetCartButton />
              </div>
            </div>
            {/* Summary */}
            <div className="col-span-1">
              <div className="hidden md:block w-full bg-card border rounded-lg p-6 shadow sticky top-24">
                <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
                {!isClient ? (
                  <>
                    <Skeleton className="h-5 w-full mb-2" />
                    <Skeleton className="h-5 w-full" />
                    <Separator className="my-2" />
                    <Skeleton className="h-6 w-full" />
                    <Separator className="my-2" />
                    <Skeleton className="h-9 w-full bg-primary mb-2" />
                  </>
                ) : (
                  <>
                    <p className="flex items-center justify-between">
                      <span>
                        Subtotal ({getCartCount()} item
                        {getCartCount() !== 1 ? "s" : ""}):
                      </span>
                      <span className="font-bold">
                        {priceFormatter(getSubtotalCents() / 100)}
                      </span>
                    </p>
                    <p className="flex items-center justify-between">
                      <span>Shipping</span>
                      <span className="font-bold">Free Over $100</span>
                    </p>
                    <Separator className="my-2" />
                    <p className="flex items-center justify-between">
                      <span>Total:</span>
                      <span className="font-bold">
                        {priceFormatter(getTotalCents() / 100)}
                      </span>
                    </p>
                    <Separator className="my-2" />
                    <Button className="w-full mb-2" onClick={handleCheckout}>
                      Checkout Securely 🔒
                    </Button>
                  </>
                )}
                <div className="text-center text-muted-foreground space-y-1">
                  <p className="text-sm font-medium">
                    Secure Checkout • Free Returns • Fast Shipping
                  </p>
                  <p className="text-xs">
                    By proceeding, you agree to our{" "}
                    <Link
                      href="/terms-and-conditions"
                      className="underline hover:text-primary"
                    >
                      Terms & Conditions
                    </Link>{" "}
                    and{" "}
                    <Link
                      href="/privacy-policy"
                      className="underline hover:text-primary"
                    >
                      Privacy Policy.
                    </Link>
                  </p>
                </div>
              </div>
            </div>

            {/* Mobile Sticky Checkout */}
            <div className="fixed bottom-0 left-0 right-0 z-50 bg-background border-t-2 p-4 pt-2 space-y-2 md:hidden">
              <h2 className="text-lg font-semibold">Order Summary</h2>
              {!isClient ? (
                <>
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-full" />
                  <Separator className="my-2" />
                  <Skeleton className="h-6 w-full" />
                  <Separator className="my-2" />
                  <Skeleton className="h-9 w-full bg-primary mb-2" />
                </>
              ) : (
                <>
                  <p className="flex items-center justify-between text-sm">
                    <span>Subtotal ({getCartCount()} items):</span>
                    <span className="font-bold">
                      {priceFormatter(getSubtotalCents() / 100)}
                    </span>
                  </p>
                  <p className="flex items-center justify-between text-sm">
                    <span>Shipping</span>
                    <span className="font-bold">Free Over 100</span>
                  </p>
                  <Separator className="my-2" />
                  <p className="flex items-center justify-between font-semibold">
                    <span>Total:</span>
                    <span className="font-bold">
                      {priceFormatter(getTotalCents() / 100)}
                    </span>
                  </p>
                  <Separator className="my-2" />
                  <Button className="w-full my-2" onClick={handleCheckout}>
                    Checkout Securely 🔒
                  </Button>
                </>
              )}
              <div className="text-center text-muted-foreground space-y-1">
                <p className="text-sm font-medium">
                  Secure Checkout • Free Returns • Fast Shipping
                </p>
                <p className="text-xs">
                  By proceeding, you agree to our{" "}
                  <Link
                    href="/terms-and-conditions"
                    className="underline hover:text-primary"
                  >
                    Terms & Conditions
                  </Link>{" "}
                  and{" "}
                  <Link
                    href="/privacy-policy"
                    className="underline hover:text-primary"
                  >
                    Privacy Policy.
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </>
      ) : (
        <EmptyCart />
      )}
    </div>
  );
};

export default CartPage;
