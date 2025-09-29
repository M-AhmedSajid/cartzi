"use client";
import StarRating from "./StarRating";
import { BadgeCheck, ThumbsUp } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import Link from "next/link";
import { dateFormatter } from "@/lib";
import ReviewDialog from "./ReviewDialog";

const ReviewTab = ({ product }) => {
  return (
    <>
      <div className="md:flex justify-between items-center space-y-3 md:space-y-0 border-b pb-5">
        <div>
          <h3 className="text-lg font-semibold">Customer Reviews</h3>
          <div className="flex items-center gap-5">
            <StarRating rating={product?.averageRating || 0} size="size-5" />
            <p className="text-sm">
              {product?.reviewCount > 0
                ? `Based on ${product.reviewCount} review${
                    product.reviewCount > 1 ? "s" : ""
                  }`
                : "No reviews yet"}
            </p>
          </div>
        </div>
        <ReviewDialog productId={product?._id} slug={product?.slug} variant={product?.variants} />
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
                Size: <strong>{review?.variantDetails?.size}</strong>, Color:{" "}
                <strong>{review?.variantDetails?.color}</strong>
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
    </>
  );
};

export default ReviewTab;
