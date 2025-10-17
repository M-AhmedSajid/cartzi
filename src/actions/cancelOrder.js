"use server";
import { backendClient } from "@/sanity/lib/backendClient";
import { revalidatePath } from "next/cache";

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
