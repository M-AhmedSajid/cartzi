"use client";
import React, { useState } from "react";
import ProductDetails from "./ProductDetails";
import { ImageGallery } from "./ImageGallery";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { PortableText } from "next-sanity";
import { Button } from "../ui/button";
import StarRating from "./StarRating";
import { BadgeCheck, ThumbsUp } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import Link from "next/link";
import { dateFormatter } from "@/lib";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { Input } from "../ui/input";
import { submitReview } from "@/actions";

function ProductView({ product }) {
  const [variant, setVariant] = useState(null);
  const [rating, setRating] = useState(0);

  const components = {
    block: {
      h2: ({ children }) => (
        <h2 className="text-xl font-bold mt-4 mb-2">{children}</h2>
      ),
      normal: ({ children }) => (
        <p className="mb-3 leading-relaxed">{children}</p>
      ),
    },
    list: {
      bullet: ({ children }) => (
        <ul className="list-disc list-inside space-y-1 pl-4">{children}</ul>
      ),
      number: ({ children }) => (
        <ol className="list-decimal list-inside space-y-1 pl-4">{children}</ol>
      ),
    },
    listItem: {
      bullet: ({ children }) => (
        <li className="text-muted-foreground">{children}</li>
      ),
      number: ({ children }) => <li>{children}</li>,
    },
    marks: {
      strong: ({ children }) => (
        <strong className="font-semibold">{children}</strong>
      ),
      em: ({ children }) => <em className="italic">{children}</em>,
      link: ({ value, children }) => (
        <a
          href={value?.href}
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary underline hover:opacity-80"
        >
          {children}
        </a>
      ),
    },
  };

  return (
    <>
      {product?.images || variant ? (
        <ImageGallery images={variant ? variant.images : product.images} />
      ) : (
        <div className="w-full"></div>
      )}
      <ProductDetails
        product={product}
        variant={variant}
        setVariant={setVariant}
      />
      <Tabs defaultValue="description" className="gap-4">
        <TabsList className="border-b h-10 bg-background rounded-none w-full justify-start p-0 gap-8">
          <TabsTrigger
            value="description"
            className="data-[state=active]:shadow-none flex-none hover:border-b border-accent border-0 rounded-none hover:text-primary data-[state=active]:border-b data-[state=active]:border-primary data-[state=active]:text-primary text-muted-foreground"
          >
            Description
          </TabsTrigger>
          <TabsTrigger
            value="reviews"
            className="data-[state=active]:shadow-none flex-none hover:border-b border-accent border-0 rounded-none hover:text-primary data-[state=active]:border-b data-[state=active]:border-primary data-[state=active]:text-primary text-muted-foreground"
          >
            Reviews ({product?.reviewCount})
          </TabsTrigger>
          <TabsTrigger
            value="qanda"
            className="data-[state=active]:shadow-none flex-none hover:border-b border-accent border-0 rounded-none hover:text-primary data-[state=active]:border-b data-[state=active]:border-primary data-[state=active]:text-primary text-muted-foreground"
          >
            Q&As
          </TabsTrigger>
        </TabsList>
        <TabsContent value="description">
          <PortableText value={product.description} components={components} />
        </TabsContent>
        <TabsContent value="reviews">
          <div className="md:flex justify-between items-center space-y-3 md:space-y-0 border-b pb-5">
            <div>
              <h3 className="text-lg font-semibold">Customer Reviews</h3>
              <div className="flex items-center gap-5">
                <StarRating
                  rating={product?.averageRating || 0}
                  size="size-5"
                />
                <p className="text-sm">
                  {product?.reviewCount > 0
                    ? `Based on ${product.reviewCount} review${
                        product.reviewCount > 1 ? "s" : ""
                      }`
                    : "No reviews yet"}
                </p>
              </div>
            </div>
            <Dialog>
              <DialogTrigger asChild>
                <Button className="w-full md:w-auto" size="lg">
                  ✍️ Write a Review
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Write a Review</DialogTitle>
                </DialogHeader>
                <form action={submitReview} className="space-y-4">
                  <input type="hidden" name="productId" value={product._id} />

                  <div>
                    <Label htmlFor="title">Review Title</Label>
                    <Input
                      id="title"
                      name="title"
                      placeholder="e.g. Exceptional quality and comfort"
                      required
                    />
                  </div>
                  <div>
                    <Label>Rating</Label>
                    {/* hidden field to pass rating value to server */}
                    <input type="hidden" name="rating" value={rating} />
                    <StarRating
                      rating={rating}
                      setRating={setRating}
                      size="size-6"
                      interactive
                    />
                  </div>
                  <div>
                    <Label htmlFor="comment">Your Review</Label>
                    <Textarea
                      id="comment"
                      name="comment"
                      rows={4}
                      placeholder="Write your thoughts..."
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="authorName">Your Name (Optional)</Label>
                    <Input
                      id="authorName"
                      name="authorName"
                      placeholder="Enter your name (if you want)"
                      required
                    />
                  </div>
                  <DialogFooter className="justify-end">
                    <DialogClose asChild>
                      <Button type="button" variant="ghost">
                        Close
                      </Button>
                    </DialogClose>
                    <Button type="submit">Submit Review</Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>
          {product?.reviewCount > 0 ? (
            product?.reviews.map((review) => (
              <div className="py-5 border-b space-y-2" key={review._id}>
                <div className="flex items-center justify-between">
                  <h3 className="text-medium text-lg">{review.title}</h3>
                  <StarRating rating={review.rating} className="hidden!" />
                </div>
                <div className="flex items-center gap-1.5 text-muted-foreground text-sm">
                  <span>{review.authorName}</span>
                  {review.verifiedBuyer && (
                    <Tooltip>
                      <TooltipTrigger>
                        <BadgeCheck className="fill-blue-600 text-background size-5" />
                      </TooltipTrigger>
                      <TooltipContent>Verified Buyer</TooltipContent>
                    </Tooltip>
                  )}
                  <span className="font-bold">•</span>
                  <span>{dateFormatter(review.date)}</span>
                </div>
                {review.variantDetails && (
                  <p className="text-sm text-muted-foreground">
                    Size: <strong>{review?.variantDetails?.size}</strong>,
                    Color: <strong>{review?.variantDetails?.color}</strong>
                  </p>
                )}
                <p>{review.comment}</p>
                <Link
                  href="#"
                  className="text-muted-foreground text-sm flex items-center space-x-2 border-b border-transparent hover:border-primary hover:text-foreground w-fit"
                >
                  <ThumbsUp className="size-4 inline" />
                  <span>Helpful ({review.helpfulCount})</span>
                </Link>
              </div>
            ))
          ) : (
            <div className="py-10 text-center text-muted-foreground space-y-2 border-b">
              <p className="text-lg font-semibold">No reviews yet</p>
              <p className="text-sm">Be the first to share your thoughts!</p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </>
  );
}

export default ProductView;
