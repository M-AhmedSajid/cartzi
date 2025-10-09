"use client";
import React, { useEffect, useState } from "react";
import useCartStore from "../../../../store";
import EmptyCart from "@/components/EmptyCart";
import { ShoppingCart, Trash } from "lucide-react";
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
import { client } from "@/sanity/lib/client";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useClerk, useUser } from "@clerk/nextjs";
import { createCheckoutSession } from "@/actions/createCheckoutSession";

const CartPage = () => {
  const [isClient, setIsClient] = useState(false);
  const [value, setValue] = useState("item-1");
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [shippingOptions, setShippingOptions] = useState([]);
  const [discountCode, setDiscountCode] = useState("");
  const [isApplying, setIsApplying] = useState(false);
  const { isSignedIn, user } = useUser();
  const { openSignIn } = useClerk();
  const {
    removeItem,
    getCartCount,
    getItems,
    getSubtotalCents,
    appliedDiscount,
    applyDiscount,
    removeDiscount,
    calculateDiscount,
    getTotalCents,
  } = useCartStore();

  const handleApplyDiscount = async (e) => {
    e.preventDefault();
    if (!discountCode) return;
    if (!isSignedIn) {
      toast.error("Please sign in to use discount codes.");
      return;
    }
    setIsApplying(true);
    try {
      const code = discountCode.trim().toUpperCase();

      const discountDoc = await client.fetch(
        `*[_type == "discountCode" && code == $code && active == true][0]`,
        { code }
      );

      if (!discountDoc) {
        toast.error("Invalid or inactive discount code.");
        return;
      }

      if (
        discountDoc.expiresAt &&
        new Date(discountDoc.expiresAt) < new Date()
      ) {
        toast.error("This discount code has expired.");
        return;
      }

      // Handle first-time customer rule
      if (discountDoc.firstTimeCustomer) {
        const hasOrders = await client.fetch(
          `count(*[_type == "order" && customer.email == $email]) > 0`,
          { email: user?.emailAddresses[0]?.emailAddress }
        );

        if (hasOrders) {
          toast.error("This discount is only for first-time customers.");
          return;
        }
      }

      const result = applyDiscount(discountDoc);

      if (result?.error) {
        toast.error(result.error);
      } else {
        toast.success(`Discount ${code} applied!`);
        setDiscountCode("");
      }
    } catch (err) {
      toast.error("Failed to apply discount.");
    } finally {
      setIsApplying(false);
    }
  };

  const handleRemoveDiscount = () => {
    removeDiscount();
    toast.success("Discount removed.");
  };

  const cartProducts = getItems();

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setValue("");
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    async function fetchRules() {
      try {
        const rules = await client.fetch(
          `*[_type == "shippingRule" && active == true] | order(shippingCost asc)`
        );

        // Example: hardcode region to US for now
        const region = "United States";

        setShippingOptions(
          rules.filter((r) => r.region === region || r.region === "Worldwide")
        );
      } catch (error) {
        console.error("Error fetching shipping rules:", error);
      } finally {
      }
    }

    fetchRules();
  }, []);

  const handleRemoveItem = (product, variant) => {
    removeItem(product, variant);
    toast.success("Item removed from cart!");
  };

  const handleCheckout = async () => {
    setCheckoutLoading(true);
    try {
      if (!isSignedIn) {
        openSignIn({
          afterSignInUrl: "/cart",
        });
      } else {
        const metadata = {
          orderNumber: `ORD-${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
          customerName: user?.fullName ?? "Guest",
          customerEmail: user?.emailAddresses[0]?.emailAddress ?? "guest",
          clerkUserId: user?.id ?? "guest",
          discountId: appliedDiscount?._id || "",
        };
        const checkoutUrl = await createCheckoutSession(
          cartProducts,
          metadata,
          shippingOptions,
          appliedDiscount
        );

        if (checkoutUrl) {
          window.open(checkoutUrl, "_blank");
        }
      }
    } catch (error) {
      console.error("Error creating checkout session:", error);
    } finally {
      setCheckoutLoading(false);
    }
  };

  return (
    <>
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
                              className="hidden sm:inline"
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
              <div className="hidden md:block w-full bg-card border rounded-lg p-6 shadow sticky top-24 space-y-2">
                <h2 className="text-xl font-semibold">Order Summary</h2>
                {!isClient ? (
                  <>
                    <Skeleton className="h-5 w-full" />
                    <Skeleton className="h-5 w-full" />
                    <Separator />
                    <Skeleton className="h-6 w-full" />
                    <Separator />
                    <Skeleton className="h-9 w-full bg-primary" />
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

                    {/* Shipping Info (not selectable) */}
                    <p className="flex items-center justify-between">
                      <span>Shipping:</span>
                      <span className="font-medium">
                        Calculated at checkout
                      </span>
                    </p>

                    {/* Free shipping threshold badge */}
                    {shippingOptions.length > 0 &&
                      shippingOptions.some((opt) => opt.freeOver) && (
                        <p className="text-xs text-green-600 font-medium mt-1">
                          Free shipping on orders over{" "}
                          {priceFormatter(
                            Math.min(
                              ...shippingOptions
                                .filter((opt) => opt.freeOver)
                                .map((opt) => opt.freeOver)
                            )
                          )}
                        </p>
                      )}

                    <p className="text-xs text-muted-foreground -mt-1">
                      Fast shipping • Free returns
                    </p>

                    {/* Discount Code Input */}
                    {appliedDiscount ? (
                      <div className="flex items-center justify-between bg-green-100 py-1 px-2 rounded-md border border-green-300">
                        <span className="text-sm font-semibold text-green-700">
                          Applied: {appliedDiscount.code}
                        </span>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={handleRemoveDiscount}
                        >
                          Remove
                        </Button>
                      </div>
                    ) : (
                      <form
                        onSubmit={handleApplyDiscount}
                        className="flex gap-2"
                      >
                        <input
                          type="text"
                          value={discountCode}
                          onChange={(e) => setDiscountCode(e.target.value)}
                          placeholder="Discount code"
                          className="flex-1 border rounded px-3 py-2 text-sm bg-background"
                        />
                        <Button disabled={isApplying}>
                          {isApplying ? "Applying..." : "Apply"}
                        </Button>
                      </form>
                    )}
                    <Separator />

                    {appliedDiscount && (
                      <p className="flex items-center justify-between text-green-600 text-sm">
                        <span>Discount ({appliedDiscount.code}):</span>
                        <span className="font-bold">
                          {appliedDiscount.discountType === "shipping"
                            ? "Free Shipping"
                            : `-${priceFormatter(
                                calculateDiscount(
                                  getSubtotalCents(),
                                  appliedDiscount
                                ) / 100
                              )}`}
                        </span>
                      </p>
                    )}

                    <p className="flex items-center justify-between">
                      <span>Total:</span>
                      <span className="font-bold">
                        {priceFormatter(getTotalCents() / 100)}
                      </span>
                    </p>
                    <Separator />
                    <Button
                      className="w-full"
                      onClick={handleCheckout}
                      disabled={checkoutLoading}
                    >
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
            <div className="fixed bottom-0 inset-x-0 z-50 bg-background border-t-2 p-4 pt-0 space-y-2 md:hidden rounded-t-2xl shadow-[0_-4px_6px_-1px_rgba(0_0_0_/_0.1)]">
              {!isClient ? (
                <>
                  <p className="text-lg font-semibold pt-2">Order Summary</p>
                  <Separator />
                  <Skeleton className="h-5 w-full" />
                  <Skeleton className="h-6 w-full" />
                  <Separator />
                  <Skeleton className="h-9 w-full bg-primary" />
                </>
              ) : (
                <>
                  <Accordion
                    type="single"
                    collapsible
                    value={value}
                    onValueChange={setValue}
                    className="w-full"
                  >
                    <AccordionItem value="item-1">
                      <AccordionTrigger className="text-lg font-semibold pt-2 pb-0 [&[data-state=open]]:pb-2">
                        Order Summary
                      </AccordionTrigger>
                      <AccordionContent className="space-y-2 pb-0">
                        <p className="flex items-center justify-between text-sm">
                          <span>Subtotal ({getCartCount()} items):</span>
                          <span className="font-bold">
                            {priceFormatter(getSubtotalCents() / 100)}
                          </span>
                        </p>
                        {/* Shipping Info (not selectable) */}
                        <p className="flex items-center justify-between">
                          <span>Shipping:</span>
                          <span className="font-medium">
                            Calculated at checkout
                          </span>
                        </p>

                        {/* Free shipping threshold badge */}
                        {shippingOptions.length > 0 &&
                          shippingOptions.some((opt) => opt.freeOver) && (
                            <p className="text-xs text-green-600 font-medium mt-1">
                              Free shipping on orders over{" "}
                              {priceFormatter(
                                Math.min(
                                  ...shippingOptions
                                    .filter((opt) => opt.freeOver)
                                    .map((opt) => opt.freeOver)
                                )
                              )}
                            </p>
                          )}

                        <p className="text-xs text-muted-foreground -mt-1">
                          Fast shipping • Free returns
                        </p>
                        {/* Discount Code Input */}
                        {appliedDiscount ? (
                          <div className="flex items-center justify-between bg-green-100 py-1 px-2 rounded-md border border-green-300">
                            <span className="text-sm font-semibold text-green-700">
                              Applied: {appliedDiscount.code}
                            </span>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={handleRemoveDiscount}
                            >
                              Remove
                            </Button>
                          </div>
                        ) : (
                          <div className="flex gap-2">
                            <input
                              type="text"
                              value={discountCode}
                              onChange={(e) => setDiscountCode(e.target.value)}
                              placeholder="Discount code"
                              className="flex-1 border rounded px-3 py-2 text-sm bg-background"
                            />
                            <Button
                              onClick={handleApplyDiscount}
                              disabled={isApplying}
                            >
                              {isApplying ? "Applying..." : "Apply"}
                            </Button>
                          </div>
                        )}
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                  <Separator />
                  {appliedDiscount && (
                    <p className="flex items-center justify-between text-green-600 text-sm">
                      <span>Discount ({appliedDiscount.code}):</span>
                      <span className="font-bold">
                        {appliedDiscount.discountType === "shipping"
                          ? "Free Shipping"
                          : `-${priceFormatter(
                              calculateDiscount(
                                getSubtotalCents(),
                                appliedDiscount
                              ) / 100
                            )}`}
                      </span>
                    </p>
                  )}

                  <p className="flex items-center justify-between font-semibold">
                    <span>Total:</span>
                    <span className="font-bold">
                      {priceFormatter(getTotalCents() / 100)}
                    </span>
                  </p>
                  <Separator />
                  <Button
                    className="w-full"
                    onClick={handleCheckout}
                    disabled={checkoutLoading}
                  >
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
    </>
  );
};

export default CartPage;
