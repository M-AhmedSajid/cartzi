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
import { useRef, useState } from "react";
import StarRating from "./StarRating";
import { toast } from "sonner";
import { useClerk, useUser } from "@clerk/nextjs";

const ReviewDialog = ({ productId, slug }) => {
  const [rating, setRating] = useState(0);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const form = useRef(null);
  const { isSignedIn, user } = useUser();
  const { openSignIn } = useClerk();

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
