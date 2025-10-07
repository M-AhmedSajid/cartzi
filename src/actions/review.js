"use server";

import { backendClient } from "@/sanity/lib/backendClient";
import { client } from "@/sanity/lib/client";
import { revalidateTag } from "next/cache";

export async function submitReview(formData) {
    try {
        const productId = formData.get("productId");
        const title = formData.get("title");
        const rating = Number(formData.get("rating"));
        const comment = formData.get("comment");
        const authorName = formData.get("authorName") || "Anonymous";
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
            existing = await client.fetch(EXISTING_REVIEW_QUERY, {
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
        revalidateTag(`reviews:${productId}`)

        return { success: true, message: "Review submitted successfully!" };
    } catch (err) {
        console.error("Review submit error:", err);
        return { success: false, message: "Something went wrong." };
    }
}

export async function updateReview(formData, reviewId) {
    try {
        const productId = formData.get("productId");
        const title = formData.get("title");
        const rating = Number(formData.get("rating"));
        const comment = formData.get("comment");
        const authorName = formData.get("authorName") || "Anonymous";
        const variantSku = formData.get("variantSku") || null;
        const slug = formData.get("slug");

        if (!reviewId) {
            return { success: false, message: "Invalid review ID." };
        }

        const updatedReview = {
            title,
            rating,
            comment,
            authorName,
            date: new Date().toISOString(),
        };

        if (variantSku) {
            const [color, size] = variantSku.split("/").map((s) => s.trim());
            updatedReview.variantDetails = { color, size };
        }

        await backendClient
            .patch(reviewId)
            .set(updatedReview)
            .commit();

        revalidateTag(`reviews:${productId}`)

        return { success: true, message: "Review updated successfully!" };
    } catch (err) {
        console.error("Review update error:", err);
        return { success: false, message: "Failed to update review." };
    }
}

export async function deleteReview(reviewId, productId) {
    try {
        if (!reviewId) {
            return { success: false, message: "Invalid review ID." };
        }

        await backendClient.delete(reviewId);
        revalidateTag(`reviews:${productId}`)

        return { success: true, message: "Review deleted successfully." };
    } catch (err) {
        console.error("Delete review error:", err);
        return { success: false, message: "Failed to delete review." };
    }
}

export async function toggleReviewHelpful(reviewId, productId, userId) {
    if (!userId) {
        return { success: false, message: "You must be logged in to vote." };
    }

    try {
        const review = await client.fetch(
            `*[_type == "review" && _id == $reviewId][0]{
        helpfulUsers,
        helpfulCount
      }`,
            { reviewId }
        );

        if (!review) {
            return { success: false, message: "Review not found." };
        }

        const alreadyVoted = review.helpfulUsers?.includes(userId);

        if (alreadyVoted) {
            // Remove user and decrement
            const updatedUsers = review.helpfulUsers.filter((id) => id !== userId);

            await backendClient
                .patch(reviewId)
                .set({
                    helpfulUsers: updatedUsers,
                    helpfulCount: Math.max((review.helpfulCount || 1) - 1, 0),
                })
                .commit();

            revalidateTag(`reviews:${productId}`);
            return { success: true, message: "Removed your helpful vote." };
        } else {
            // Add user and increment safely
            await backendClient
                .patch(reviewId)
                .setIfMissing({ helpfulUsers: [] })
                .insert("after", "helpfulUsers[-1]", [userId])
                .set({ helpfulCount: (review.helpfulCount || 0) + 1 })
                .commit();

            revalidateTag(`reviews:${productId}`);
            return { success: true, message: "Thanks for your feedback!" };
        }
    } catch (error) {
        console.error("Error toggling helpful vote:", error);
        return { success: false, message: "Something went wrong." };
    }
}