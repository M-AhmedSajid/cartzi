"use client"
import { cancelOrder } from "@/actions/cancelOrder";
import { useState } from "react";
import { toast } from "sonner";
import useCartStore from "../../store";
import { client } from "@/sanity/lib/client";

export function useOrderActions() {
    const [loading, setLoading] = useState(false);
    const { addItem } = useCartStore();

    const handleCancelOrder = async (orderId) => {
        setLoading(true);
        const res = await cancelOrder(orderId);

        if (res.success) {
            toast.success(res.message);
        } else {
            toast.error(res.message);
        }
        setLoading(false);
    };

    const buyAgain = async (orderItems) => {
        if (!orderItems?.length) return;

        setLoading(true);
        try {
            const query = `*[_type == "product" && _id in $ids]{ 
                _id, name, "slug": slug.current, price, discount, stock, sku, 
                variants[]{
                    color->{name}, 
                    images[]{asset->{_id,url}, alt},
                    sizes[]{size, sku, stock, priceOverride}
                }, 
                images[]{asset->{_id,url}, alt}
            }`;
            // Extract product IDs for a single fetch
            const productIds = orderItems.map((item) => item.productId).filter(Boolean);

            const products = await client.fetch(query, { ids: productIds });
            if (!products || products.length === 0) {
                toast.error("Products not found.");
                return;
            }

            let added = 0;
            let skipped = 0;

            for (const item of orderItems) {
                const product = products.find((p) => p._id === item.productId);
                if (!product) {
                    skipped++;
                    continue;
                }

                // Match variant by SKU (if applicable)
                let variant = null;
                if (Array.isArray(product.variants) && product.variants.length > 0) {
                    for (const color of product.variants) {
                        const sizeMatch = color.sizes?.find(
                            (s) => s.sku === item.sku || s.sku === item.sku?.[0]
                        );
                        if (sizeMatch) {
                            variant = {
                                colorName: color.color?.name,
                                size: sizeMatch.size,
                                sku: sizeMatch.sku,
                                priceOverride: sizeMatch.priceOverride,
                                stock: sizeMatch.stock,
                                images: color.images ?? [],
                            };
                            break;
                        }
                    }
                }

                const stock = variant?.stock ?? product.stock ?? 0;
                if (stock <= 0) {
                    skipped++;
                    continue;
                }

                addItem({ product, variant, quantity: item.quantity });
                added++;
            }

            if (added > 0) toast.success(`Added ${added} item${added > 1 ? "s" : ""} to cart.`);
            if (skipped > 0) toast.warning(`${skipped} item${skipped > 1 ? "s" : ""} unavailable.`);
        } catch (err) {
            console.error("Buy Again Error:", err);
            toast.error("Failed to reorder items.");
        } finally {
            setLoading(false);
        }
    };

    return { loading, handleCancelOrder, buyAgain };
}
