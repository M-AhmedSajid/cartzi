"use client";
import React, { useCallback, useEffect, useState } from "react";
import {
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Search, X } from "lucide-react";
import { client } from "@/sanity/lib/client";
import Link from "next/link";
import { urlFor } from "@/sanity/lib/image";
import Image from "next/image";
import PriceDisplay from "./product/PriceDisplay";
import { Skeleton } from "./ui/skeleton";
import useCartStore from "../../store";
import StarRating from "./product/StarRating";

const SearchDialog = () => {
  const [search, setSearch] = useState("");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const { getItems } = useCartStore();
  const cartItems = getItems();

  const fetchProducts = useCallback(async () => {
    if (!search) {
      setProducts([]);
      setLoading(false);
      return;
    }
    try {
      const query = `*[_type == "product" && (
        name match $q ||
        description match $q ||
        intro match $q ||
        count(categories[@->name match $q]) > 0 ||
        count(categories[@->parent->name match $q]) > 0 ||
        count(variants[color->name match $q]) > 0 ||
        count(variants[].sizes[sku match $q]) > 0 ||
        sku match $q ||
        count(variants[].sizes[size match $q]) > 0 ||
        tags[] match $q ||
        material->name match $q
      )]{
        _id,
        name,
        intro,
        "slug": slug.current,
        price,
        discount,
        "image": coalesce(
          variants[count(sizes[stock > 0]) > 0][0].images[0],
          variants[0].images[0],
          images[0]
        ),
        "stock": coalesce(
          variants[count(sizes[stock > 0]) > 0][0].sizes[stock > 0][0].stock,
          stock
        ),
        categories[]->{
          name,
          "slug": slug.current,
          parent->{ name, "slug": slug.current }
        },
        variants[]{
          color->{ name },
          sizes[]{ size, sku, stock, priceOverride }
        },
        tags,
        material->{ name }
      }[0...8] | order(name asc)
      `;
      const params = { q: `${search}*` };
      const res = await client.fetch(query, params);
      setProducts(res);
      console.log(res);
    } catch (error) {
      console.error("Error Fetching Products:", error);
    } finally {
      setLoading(false);
    }
  }, [search]);

  useEffect(() => {
    setLoading(true);
    const debounceTimer = setTimeout(() => {
      fetchProducts();
    }, 300);

    return () => {
      clearTimeout(debounceTimer);
    };
  }, [search, fetchProducts]);

  return (
    <DialogContent className="md:max-w-2xl min-h-[80vh] max-h-[80vh] flex flex-col overflow-hidden">
      <DialogHeader>
        <DialogTitle>Product Searchbar</DialogTitle>
        <form
          onSubmit={(e) => e.preventDefault()}
          className="relative gap-2 flex items-center justify-center"
        >
          <Input
            type="text"
            placeholder="Search hoodies, jeans, kids tees..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {search && (
            <Button
              size="icon"
              variant="outline"
              onClick={() => setSearch("")}
              className="absolute size-5 right-13 rounded-full"
            >
              <X className="size-3" />
            </Button>
          )}
          <Button size="icon" type="submit">
            <Search />
          </Button>
        </form>
      </DialogHeader>
      <DialogDescription className="hidden" />
      <div className="w-full h-full border border-border rounded-lg overflow-y-auto bg-card">
        {loading ? (
          Array.from({ length: 4 }).map((x, i) => (
            <div
              key={i}
              className="p-2 flex items-center gap-2 border-b last:border-b-0"
            >
              <Skeleton className="rounded-md aspect-[3/4] w-20 md:w-24 flex-shrink-0" />
              <div className="flex-grow pl-2 space-y-1">
                <Skeleton className="h-4 md:h-6 md:w-2/3" />
                <Skeleton className="h-4" />
                <div className="flex items-baseline gap-1">
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-3 w-12" />
                </div>
                <div className="flex items-center gap-2.5 justify-between">
                  <Skeleton className="h-4 w-28" />
                  <Skeleton className="h-6 w-24" />
                </div>
              </div>
            </div>
          ))
        ) : products.length ? (
          products?.map((product) => {
            const itemsInCart = cartItems.filter(
              (it) => it.productId === product._id
            );
            return (
              <div
                key={product._id}
                className="p-2 flex items-center gap-2 border-b last:border-b-0"
              >
                <DialogClose asChild>
                  <Link href={`/product/${product?.slug}`}>
                    <div className="relative bg-card rounded-md overflow-hidden aspect-[3/4] group border w-20 md:w-24 shrink-0">
                      {(product?.stock === 0 || product?.stock == null) && (
                        <span className="bg-foreground/50 absolute inset-0 text-base text-background flex items-center justify-center text-center font-semibold pointer-events-none z-10">
                          Out of Stock
                        </span>
                      )}
                      <Image
                        src={urlFor(product?.image).width(100).height(130).auto("format").url()}
                        alt={product?.image?.alt}
                        width={100}
                        height={130}
                        priority
                        className="w-full h-full object-cover overflow-hidden hoverEffect group-hover:scale-105"
                      />
                    </div>
                  </Link>
                </DialogClose>
                <div className="flex-grow pl-2">
                  <h3 className="text-base md:text-lg font-semibold line-clamp-1">
                    <DialogClose asChild>
                      <Link href={`/product/${product?.slug}`}>
                        {product.name}
                      </Link>
                    </DialogClose>
                  </h3>
                  <p className="text-sm text-muted-foreground line-clamp-1">
                    {product.intro}
                  </p>
                  <PriceDisplay
                    product={product}
                    variant={product?.variants?.[0]?.sizes?.[0]}
                    size="text-lg"
                  />
                  <div className="flex items-center gap-2.5 justify-between">
                    <StarRating rating={product?.rating ?? 4.2} />
                    {itemsInCart.length > 0 ? (
                      <span className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-700 font-medium line-clamp-1">
                        {itemsInCart.length} variant
                        {itemsInCart.length > 1 && "s"} in cart
                      </span>
                    ) : product?.stock === 0 || product?.stock == null ? (
                      <span className="text-xs px-2 py-1 rounded-full bg-red-100 text-red-700 font-medium">
                        Out of Stock
                      </span>
                    ) : (
                      <span className="text-xs px-2 py-1 rounded-full bg-red-100 text-red-700 font-medium">
                        Not in cart
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="font-semibold text-center px-5 py-10 md:p-10 tracking-wide">
            {search ? (
              <p>
                Hmm… nothing found for &quot;{search}&quot;. Try searching
                another style or keyword.
              </p>
            ) : (
              <p className="flex items-center flex-wrap justify-center gap-1">
                <Search className="size-5" />
                Explore Cartzi&apos;s collection by searching your product.
              </p>
            )}
          </div>
        )}
      </div>
    </DialogContent>
  );
};

export default SearchDialog;
