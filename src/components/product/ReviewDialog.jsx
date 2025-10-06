"use client";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { Input } from "../ui/input";
import { submitReview } from "@/actions/review";
import { useEffect, useRef, useState } from "react";
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

const ReviewDialog = ({ productId, slug, variants }) => {
  const [rating, setRating] = useState(0);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isVerifiedBuyer, setIsVerifiedBuyer] = useState(false);
  const [orderedVariants, setOrderedVariants] = useState([]);
  const [selectedVariant, setSelectedVariant] = useState("");
  const form = useRef(null);
  const { isSignedIn, user } = useUser();
  const { openSignIn } = useClerk();
  const query = `*[_type == "order" && customer.clerkUserId == $clerkUserId]{
        items[]{
          product->{_id, name},
          variant
        }
      }`;

  useEffect(() => {
    async function fetchBuyerVariants() {
      if (isSignedIn && open) {
        console.log(user?.id);
        const orders = await client.fetch(query, { clerkUserId: user?.id });
        const items = (await orders?.flatMap((o) => o.items || [])) || [];
        const variants = items
          .filter((i) => i.product?._id === productId && i.variant)
          .map((i) => {
            const [colorName, size] = i.variant.split("/").map((x) => x.trim());
            return { sku: i.variant, colorName, size };
          });
        // remove duplicates by SKU
        const uniqueVariants = Array.from(
          new Map(variants.map((v) => [v.sku, v])).values()
        );

        setIsVerifiedBuyer(uniqueVariants.length > 0);
        setOrderedVariants(uniqueVariants);
        console.log(uniqueVariants);
      }
    }
    fetchBuyerVariants();
  }, [open, isSignedIn, productId, user?.id]);

  async function handleSubmit(formData) {
    setLoading(true);
    const title = formData.get("title")?.trim();
    const ratingValue = Number(formData.get("rating"));
    const comment = formData.get("comment")?.trim();
    const authorName = formData.get("authorName")?.trim();

    try {
      if (!title || title.length < 5) {
        toast.error("Title must be at least 5 characters long.");
        return;
      }
      if (!ratingValue || ratingValue < 1 || ratingValue > 5) {
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
      if (
        isVerifiedBuyer &&
        variants?.length > 0 &&
        !selectedVariant
      ) {
        toast.error("Please select the variant you purchased.");
        return;
      }
      if (isSignedIn) {
        formData.append("clerkUserId", user?.id);
      }
      if (selectedVariant) {
        formData.append("variantSku", selectedVariant);
      }
      formData.append("slug", slug);
      const result = await submitReview(formData);

      if (result.success) {
        toast.success(result.message);

        // reset form + rating
        form.current?.reset();
        setRating(0);
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
      <DialogTrigger asChild>
        <Button className="w-full md:w-auto" size="lg">
          ✍️ Write a Review
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Write a Review</DialogTitle>
        </DialogHeader>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const formData = new FormData(e.currentTarget);
            handleSubmit(formData);
          }}
          className="space-y-4"
          ref={form}
        >
          <input type="hidden" name="productId" value={productId} />

          <div>
            <Label htmlFor="title">Review Title</Label>
            <Input
              id="title"
              name="title"
              placeholder="e.g. Great quality and perfect fit"
            />
          </div>
          <div>
            <input type="hidden" name="rating" value={rating} />
            <Label>Star Rating</Label>
            <StarRating
              rating={rating}
              setRating={setRating}
              size="size-6"
              interactive
            />
            <p className="text-xs text-muted-foreground">Select 1 to 5 stars</p>
          </div>
          {/* 🧩 Variant Selector */}
          {isVerifiedBuyer && variants?.length > 0 && (
            <div>
              <Label htmlFor="variant">Select Variant</Label>
              <Select
                onValueChange={(value) => setSelectedVariant(value)}
                value={selectedVariant}
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
          <div>
            <Label htmlFor="comment">Your Review</Label>
            <Textarea
              id="comment"
              name="comment"
              rows={4}
              placeholder="Tell us about the fit, quality, and your experience..."
            />
            <p className="text-xs text-muted-foreground">
              Minimum 10 characters
            </p>
          </div>
          <div>
            <Label htmlFor="authorName">Your Name (Optional)</Label>
            <Input
              id="authorName"
              name="authorName"
              placeholder="Enter your name (at least 3 letters)"
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
              {loading ? "Submitting..." : "Submit Review"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ReviewDialog;
