"use server";

import { backendClient } from "@/sanity/lib/backendClient";
import { revalidatePath } from "next/cache";
import { defineQuery } from "next-sanity";
import { sanityFetch } from "@/sanity/lib/live";

export async function submitReview(formData) {
    try {
        const productId = formData.get("productId");
        const title = formData.get("title");
        const rating = Number(formData.get("rating"));
        const comment = formData.get("comment");
        const authorName = formData.get("authorName") || "Anonymous";
        const slug = formData.get("slug");

        // Clerk user info
        const clerkUserId = formData.get("verifiedBuyer") || null;
        console.log("➡️ Review submission received", {
      productId,
      title,
      rating,
      comment,
      authorName,
      slug,
      clerkUserId,
    });

        if (!productId || !title || !rating || !comment) {
            return { success: false, message: "All fields are required." };
        }

        /* ---------------- Verify Buyer & Get Variant ---------------- */
        let isVerified = false;
        let variantDetails = null;

        if (clerkUserId) {
            const VERIFIED_BUYER_QUERY = defineQuery(`
                *[_type == "order" && customer.clerkUserId == $clerkUserId]{
                    items[]{
                        product->{_id},
                        variant
                    }
                }
            `);

            const orders = await sanityFetch({
                query: VERIFIED_BUYER_QUERY,
                params: { clerkUserId },
            });
      console.log("🧾 Orders found for user:", orders);

            const purchasedItems =
                orders?.data?.flatMap((o) => o.items || []) || [];

      console.log("🛒 Flattened purchased items:", purchasedItems);
            const match = purchasedItems.find(
                (i) => i.product?._id === productId
            );
            
      console.log("🎯 Matched purchased item:", match);

            if (match) {
                isVerified = true;
                if (match.variant) {
                    const parts = match.variant.split("/").map((s) => s.trim());
                    variantDetails = {
                        color: parts[0] || null,
                        size: parts[1] || null,
                    };
                    
          console.log("🎨 Parsed variant details:", variantDetails);
                }
            }
        }

        /* ---------------- Check for Existing Review ---------------- */
        const EXISTING_REVIEW_QUERY = defineQuery(`
            *[_type == "review" && product._ref == $productId && clerkUserId == $clerkUserId][0]{_id}
        `);

        const existing = await sanityFetch({
            query: EXISTING_REVIEW_QUERY,
            params: { productId, clerkUserId },
        });
    console.log("🔍 Existing review result:", existing);

        if (existing?.data?._id) {
      console.log("🗑️ Deleting old review:", existing.data._id);
            await backendClient.delete(existing.data._id);
        }

        /* ---------------- Create New Review ---------------- */
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
            product: {
                _type: "reference",
                _ref: productId,
            },
        };

        if (variantDetails) {
            newReview.variantDetails = variantDetails;
        }

    console.log("📝 Creating new review:", newReview);
        await backendClient.create(newReview);

    console.log("✅ Review created successfully for product:", productId);
        revalidatePath(`/product/${slug}`);

        return { success: true, message: "Review submitted successfully!" };
    } catch (err) {
        console.error("Review submit error:", err);
        return { success: false, message: "Something went wrong." };
    }
}
