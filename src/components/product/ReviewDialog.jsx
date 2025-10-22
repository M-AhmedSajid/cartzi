"use client";
import { Button } from "../ui/button";
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
import { submitReview, updateReview } from "@/actions/review";
import { useEffect, useState } from "react";
import StarRating from "./StarRating";
import { toast } from "sonner";
import { useClerk, useUser } from "@clerk/nextjs";
import { client } from "@/sanity/lib/client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

const ReviewDialog = ({
  productId,
  slug,
  variants,
  existingReview = null,
  mode = "add",
  children,
}) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isVerifiedBuyer, setIsVerifiedBuyer] = useState(false);
  const [orderedVariants, setOrderedVariants] = useState([]);
  const { isSignedIn, user } = useUser();
  const { openSignIn } = useClerk();

  // Single state for all form fields
  const [formData, setFormData] = useState({
    title: "",
    rating: 0,
    comment: "",
    authorName: "",
    selectedVariant: "",
  });

  const query = `*[_type == "order" && customer.clerkUserId == $clerkUserId]{
    items[]{
      product->{_id, name},
      variant
    }
  }`;

  // Fetch variants for verified buyers
  useEffect(() => {
    async function fetchBuyerVariants() {
      if (isSignedIn && open) {
        const orders = await client.fetch(query, { clerkUserId: user?.id });
        const items = (await orders?.flatMap((o) => o.items || [])) || [];
        const variants = items
          .filter((i) => i.product?._id === productId && i.variant)
          .map((i) => {
            const [colorName, size] = i.variant.split("/").map((x) => x.trim());
            return { sku: i.variant, colorName, size };
          });

        const uniqueVariants = Array.from(
          new Map(variants.map((v) => [v.sku, v])).values()
        );

        setIsVerifiedBuyer(uniqueVariants.length > 0);
        setOrderedVariants(uniqueVariants);
      }
    }
    fetchBuyerVariants();
  }, [open, isSignedIn, productId, user?.id]);

  // Prefill form when editing
  useEffect(() => {
    if (existingReview && open) {
      setFormData({
        title: existingReview.title || "",
        rating: existingReview.rating || 0,
        comment: existingReview.comment || "",
        authorName: existingReview.authorName || "",
        selectedVariant: existingReview.variantDetails
          ? `${existingReview.variantDetails.color} / ${existingReview.variantDetails.size}`
          : "",
      });
    } else if (!existingReview && open) {
      setFormData({
        title: "",
        rating: 0,
        comment: "",
        authorName: "",
        selectedVariant: "",
      });
    }
  }, [existingReview, open]);

  // Handle submit
  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);

    const { title, rating, comment, authorName, selectedVariant } = formData;

    try {
      if (!title || title.length < 5) {
        toast.error("Title must be at least 5 characters long.");
        return;
      }
      if (!rating || rating < 1 || rating > 5) {
        toast.error("Please select a star rating between 1 and 5.");
        return;
      }
      if (!comment || comment.length < 10) {
        toast.error("Review must be at least 10 characters long.");
        return;
      }
      if (authorName && authorName.length < 3) {
        toast.error("Name must be at least 3 characters long.");
        return;
      }
      if (isVerifiedBuyer && variants?.length > 0 && !selectedVariant) {
        toast.error("Please select the variant you purchased.");
        return;
      }

      // Prepare payload
      const payload = new FormData();
      payload.append("productId", productId);
      payload.append("title", title);
      payload.append("rating", rating);
      payload.append("comment", comment);
      payload.append("authorName", authorName);
      payload.append("slug", slug);
      if (isSignedIn) payload.append("clerkUserId", user?.id);
      if (selectedVariant) payload.append("variantSku", selectedVariant);

      const result =
        mode === "edit"
          ? await updateReview(payload, existingReview._id)
          : await submitReview(payload);

      if (result.success) {
        toast.success(result.message);
        setOpen(false);
      } else {
        toast.error(result.message);
      }
    } catch (err) {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return !isSignedIn ? (
    <Button
      className="w-full md:w-auto"
      size="lg"
      onClick={() =>
        openSignIn({
          afterSignInUrl: `/product/${slug}`,
        })
      }
    >
      ✍️ Write a Review
    </Button>
  ) : (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {mode === "edit" ? "Edit Review" : "Write a Review"}
          </DialogTitle>
        </DialogHeader>
        <DialogDescription className="hidden" />

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Title */}
          <div>
            <Label className="mb-1.5" htmlFor="title">Review Title</Label>
            <Input
              id="title"
              name="title"
              placeholder="e.g. Great quality and perfect fit"
              value={formData.title}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, title: e.target.value }))
              }
            />
          </div>

          {/* Rating */}
          <div>
            <input type="hidden" name="rating" value={formData.rating} />
            <Label>Star Rating</Label>
            <StarRating
              rating={formData.rating}
              setRating={(val) =>
                setFormData((prev) => ({ ...prev, rating: val }))
              }
              size="size-6"
              interactive
            />
            <p className="text-xs text-muted-foreground">Select 1 to 5 stars</p>
          </div>

          {/* Variant Selector */}
          {isVerifiedBuyer && variants?.length > 0 && (
            <div>
              <Label className="mb-1.5" htmlFor="variant">Select Variant</Label>
              <Select
                onValueChange={(value) =>
                  setFormData((prev) => ({ ...prev, selectedVariant: value }))
                }
                value={formData.selectedVariant}
                disabled={mode === "edit"}
              >
                <SelectTrigger id="variant" className="w-full">
                  <SelectValue placeholder="Select one" />
                </SelectTrigger>
                <SelectContent>
                  {orderedVariants.map((v) => (
                    <SelectItem key={v.sku} value={v.sku}>
                      {v.colorName} / {v.size}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                Only variants you purchased are shown.
              </p>
            </div>
          )}

          {/* Comment */}
          <div>
            <Label className="mb-1.5" htmlFor="comment">Your Review</Label>
            <Textarea
              id="comment"
              name="comment"
              rows={4}
              placeholder="Tell us about the fit, quality, and your experience..."
              value={formData.comment}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, comment: e.target.value }))
              }
            />
            <p className="text-xs text-muted-foreground">
              Minimum 10 characters
            </p>
          </div>

          {/* Author Name */}
          <div>
            <Label className="mb-1.5" htmlFor="authorName">Your Name (Optional)</Label>
            <Input
              id="authorName"
              name="authorName"
              placeholder="Enter your name (at least 3 letters)"
              value={formData.authorName}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, authorName: e.target.value }))
              }
            />
            <p className="text-xs text-muted-foreground">
              Shown publicly with your review
            </p>
          </div>

          <DialogFooter className="justify-end">
            <DialogClose asChild>
              <Button type="button" variant="ghost" disabled={loading}>
                Close
              </Button>
            </DialogClose>
            <Button type="submit" disabled={loading}>
              {loading && mode === "edit"
                ? "Saving..."
                : loading
                  ? "Submitting..."
                  : mode === "edit"
                    ? "Save Changes"
                    : "Submit Review"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ReviewDialog;
