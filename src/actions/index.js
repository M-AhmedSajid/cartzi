"use server";
import { backendClient } from "@/sanity/lib/backendClient";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function cancelOrder(orderId) {
    if (!orderId) throw new Error("Missing order ID");

    try {
        // Update the order status to "cancelled"
        await backendClient
            .patch(orderId)
            .set({
                status: "cancelled",
                cancelledAt: new Date().toISOString(),
            })
            .commit();

        // Revalidate any pages showing orders
        revalidatePath("/orders");
        revalidatePath(`/orders/${orderId}`);

        return { success: true, message: "Order cancelled successfully." };
    } catch (err) {
        console.error("Error cancelling order:", err);
        return { success: false, message: "Failed to cancel order" };
    }
}

export async function applyFilters(formData) {
    // Create a new URLSearchParams instance
    const params = new URLSearchParams();

    // Helper to handle multi-select values
    const getValues = (name) => formData.getAll(name).filter(Boolean);

    // --- Categories ---
    const categories = getValues("category");
    if (categories.length) params.set("category", categories.join(","));

    // --- Sizes ---
    const sizes = getValues("size");
    if (sizes.length) params.set("size", sizes.join(","));

    // --- Colors ---
    const colors = getValues("color");
    if (colors.length) params.set("color", colors.join(","));

    // --- Materials ---
    const materials = getValues("material");
    if (materials.length) params.set("material", materials.join(","));

    // --- Stock ---
    const stock = getValues("stock");
    if (stock.includes("in-stock")) params.set("stock", "in-stock");

    // --- Discount ---
    const discount = getValues("discount");
    if (discount.includes("on-sale")) params.set("discount", "on-sale");

    // --- Price Range ---
    const minPrice = formData.get("min");
    const maxPrice = formData.get("max");

    if (minPrice) params.set("min", minPrice);
    if (maxPrice) params.set("max", maxPrice);

    // Build final query string
    const queryString = params.toString();
    const redirectUrl = queryString ? `/shop?${queryString}` : "/shop";

    // Redirect to the filtered page
    redirect(redirectUrl);
}
