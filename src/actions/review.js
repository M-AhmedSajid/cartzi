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

        if (!productId || !title || !rating || !comment) {
            return { success: false, message: "All fields are required." };
        }

        const newReview = {
            _type: "review",
            title,
            rating,
            comment,
            authorName,
            verifiedBuyer: false,
            date: new Date().toISOString(),
            helpfulCount: 0,
            product: {
                _type: "reference",
                _ref: productId,
            },
        };

        await backendClient.create(newReview);
        revalidatePath(`/product/${formData.get("slug")}`);
        return { success: true, message: "Review submitted successfully!" };
    } catch (err) {
        console.error("Review submit error:", err);
        return { success: false, message: "Something went wrong." };
    }
}
