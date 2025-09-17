"use server";

import stripe from "@/lib/stripe";
import { urlFor } from "@/sanity/lib/image";

export async function createCheckoutSession(items, metadata, shippingRule, shippingCents, appliedDiscount = null) {
    try {
        // Check if customer already exists
        const customers = await stripe.customers.list({
            email: metadata?.customerEmail,
            limit: 1,
        });

        const customerId = customers.data.length > 0 ? customers.data[0].id : "";

        // Map products into Stripe line items
        const lineItems = items.map((item) => {
            const nameParts = [item.name];
            if (item.variant?.colorName) nameParts.push(item.variant.colorName);
            if (item.variant?.size) nameParts.push(item.variant.size);

            return {
                price_data: {
                    currency: "USD",
                    unit_amount: item.unitPriceCents,
                    product_data: {
                        name: nameParts.join(" "),
                        ...(item.description ? { description: item.description } : {}),
                        images: item.image ? [urlFor(item.image).url()] : [],
                        metadata: {
                            productId: item.productId,
                            variantSku: item.variant?.sku || "",
                        },
                    },
                },
                quantity: item.quantity,
            };
        });

        // Include shipping as a line item (if > 0)
        if (shippingCents > 0 && shippingRule) {
            lineItems.push({
                price_data: {
                    currency: "USD",
                    unit_amount: shippingCents,
                    product_data: {
                        name: `Shipping (${shippingRule.name})`,
                        description: shippingRule.deliveryTime || "",
                    },
                },
                quantity: 1,
            });
        }

        // Include cart-level discount as a negative line item
        if (appliedDiscount && appliedDiscount.discountType !== "shipping") {
            // Calculate discount in cents
            const subtotalCents = items.reduce((sum, item) => sum + item.unitPriceCents * item.quantity, 0);
            let discountCents = 0;

            if (appliedDiscount.discountType === "percentage") {
                discountCents = Math.round((appliedDiscount.value / 100) * subtotalCents);
            } else if (appliedDiscount.discountType === "fixed") {
                discountCents = Math.round(appliedDiscount.value * 100);
            }

            if (discountCents > 0) {
                lineItems.push({
                    price_data: {
                        currency: "USD",
                        unit_amount: -discountCents, // negative amount for discount
                        product_data: {
                            name: `Discount (${appliedDiscount.code})`,
                        },
                    },
                    quantity: 1,
                });
            }
        }

        // Build session payload
        const sessionPayload = {
            mode: "payment",
            allow_promotion_codes: true, // user can still add Stripe coupons if needed
            payment_method_types: ["card"],
            line_items: lineItems,
            metadata: {
                orderNumber: metadata?.orderNumber,
                customerName: metadata?.customerName,
                customerEmail: metadata?.customerEmail,
                clerkUserId: metadata?.clerkUserId,
            },
            success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/success?session_id={CHECKOUT_SESSION_ID}&order_number=${metadata?.orderNumber}`,
            cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/cart`,
        };

        // Assign customer if exists
        if (customerId) {
            sessionPayload.customer = customerId;
        } else if (metadata?.customerEmail) {
            sessionPayload.customer_email = metadata.customerEmail;
        }

        // Create Stripe Checkout Session
        const session = await stripe.checkout.sessions.create(sessionPayload);

        return session.url;
    } catch (error) {
        console.error("Error creating checkout session:", error);
        throw error;
    }
}
