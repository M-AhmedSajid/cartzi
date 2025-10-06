"use client";
import StarRating from "./StarRating";
import { BadgeCheck, Pencil, ThumbsUp, Trash2 } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import Link from "next/link";
import { dateFormatter } from "@/lib";
import ReviewDialog from "./ReviewDialog";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { toast } from "sonner";
import { deleteReview } from "@/actions/review";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../ui/alert-dialog";
import { useState } from "react";

const ReviewTab = ({ product, reviews }) => {
  const [loading, setLoading] = useState(false);

  const handleDelete = async (reviewId) => {
    setLoading(true);
    const result = await deleteReview(reviewId, product?.slug);
    if (result.success) {
      toast.success(result.message);
    } else {
      toast.error(result.message);
    }
    setLoading(false);
  };

  return (
    <>
      <div className="md:flex justify-between items-center space-y-3 md:space-y-0 border-b pb-5">
        <div>
          <h3 className="text-lg font-semibold">Customer Reviews</h3>
          <div className="flex items-center gap-5">
            <StarRating rating={reviews?.averageRating || 0} size="size-5" />
            <p className="text-sm">
              {reviews?.reviewCount > 0
                ? `Based on ${reviews.reviewCount} review${
                    reviews.reviewCount > 1 ? "s" : ""
                  }`
                : "No reviews yet"}
            </p>
          </div>
        </div>
        <ReviewDialog
          productId={product?._id}
          slug={product?.slug}
          variants={product?.variants}
        />
      </div>
      {reviews?.reviewCount > 0 ? (
        reviews?.reviews?.map((review) => (
          <div className="py-5 border-b space-y-2" key={review._id}>
            {review.isUserReview && (
              <div className="flex justify-between items-end mb-0">
                <Badge>Your Review</Badge>
                <div className="flex justify-center items-center">
                  <Button size="sm" variant="ghost" className="size-7">
                    <Pencil className="size-[1.125rem]" />
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="size-7 text-destructive hover:bg-destructive/75 hover:text-background"
                      >
                        <Trash2 className="size-[1.125rem]" />
                      </Button>
                    </AlertDialogTrigger>

                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete this review?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone. Your review will be
                          permanently removed.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel disabled={loading}>
                          No
                        </AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleDelete(review._id)}
                          disabled={loading}
                          variant="destructive"
                        >
                          {loading ? "Deleting..." : "Yes, Delete"}
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            )}
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
              <span>
                {review.date ? dateFormatter(review.date) : "No Date"}
              </span>
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
