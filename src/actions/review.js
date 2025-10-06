"use server";

import { backendClient } from "@/sanity/lib/backendClient";
import { revalidatePath } from "next/cache";

export async function submitReview(formData) {
    try {
        const productId = formData.get("productId");
        const title = formData.get("title");
        const rating = Number(formData.get("rating"));
        const comment = formData.get("comment");
        const authorName = formData.get("authorName") || "Anonymous";
        const slug = formData.get("slug");
        const clerkUserId = formData.get("clerkUserId") || null;
        const variantSku = formData.get("variantSku") || null;
        const isVerified = Boolean(clerkUserId);

        if (!productId || !title || !rating || !comment) {
            return { success: false, message: "All fields are required." };
        }

        // 🔍 Check if review already exists
        let existing = null;

        if (variantSku) {
            // ✅ Verified buyer with variant — check product + user + variant
            const EXISTING_REVIEW_QUERY = `
                *[_type == "review" 
                && product._ref == $productId 
                && clerkUserId == $clerkUserId 
                && variantDetails.color == $color 
                && variantDetails.size == $size][0]{_id}
            `;
            const [color, size] = variantSku.split("/").map((s) => s.trim());
            existing = await backendClient.fetch(EXISTING_REVIEW_QUERY, {
                productId,
                clerkUserId,
                color,
                size,
            });
        } else {
            // Unverified buyer — only one review per product
            const EXISTING_REVIEW_QUERY = `
                *[_type == "review" 
                && product._ref == $productId 
                && clerkUserId == $clerkUserId][0]{_id}
            `;
            existing = await backendClient.fetch(EXISTING_REVIEW_QUERY, {
                productId,
                clerkUserId,
            });
        }

        if (existing?._id) {
            return {
                success: false,
                message: variantSku
                    ? "You already reviewed this variant."
                    : "You already reviewed this product.",
            };
        }

        // 🆕 Create new review
        const newReview = {
            _type: "review",
            title,
            rating,
            comment,
            authorName,
            verifiedBuyer: isVerified,
            date: new Date().toISOString(),
            helpfulCount: 0,
            clerkUserId,
            product: { _type: "reference", _ref: productId },
        };

        if (variantSku) {
            const [color, size] = variantSku.split("/").map((s) => s.trim());
            newReview.variantDetails = { color, size };
        }

        await backendClient.create(newReview);

        revalidatePath(`/product/${slug}`);

        return { success: true, message: "Review submitted successfully!" };
    } catch (err) {
        console.error("Review submit error:", err);
        return { success: false, message: "Something went wrong." };
    }
}

export async function deleteReview(reviewId, slug) {
  try {
    if (!reviewId) {
      return { success: false, message: "Invalid review ID." };
    }

    await backendClient.delete(reviewId);
    revalidatePath(`/product/${slug}`);

    return { success: true, message: "Review deleted successfully." };
  } catch (err) {
    console.error("Delete review error:", err);
    return { success: false, message: "Failed to delete review." };
  }
}
