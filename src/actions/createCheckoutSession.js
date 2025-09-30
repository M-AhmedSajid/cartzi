"use server";

import stripe from "@/lib/stripe";
import { urlFor } from "@/sanity/lib/image";

function portableTextToPlainText(blocks) {
    return blocks
        .map(block => {
            if (block._type !== 'block' || !block.children) return ''
            return block.children.map(child => child.text).join('')
        })
        .join('\n')
}

export async function createCheckoutSession(items, metadata, shippingOptions, appliedDiscount = null) {
    try {
        // find existing customer
        const customers = await stripe.customers.list({
            email: metadata?.customerEmail,
            limit: 1,
        });
        const customerId = customers.data.length > 0 ? customers.data[0].id : "";

        // subtotal in cents, used for freeOver checks and discount calculations
        const subtotalCents = items.reduce(
            (sum, item) => sum + (item.unitPriceCents || 0) * (item.quantity || 1),
            0
        );

        // build line items
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
                        ...(item.description ? { description: portableTextToPlainText(item.description) } : {}),
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

        // cart-level discount: keep your negative-line-item behavior as a fallback
        // but skip creating that fake negative item if a stripePromoId exists
        if (appliedDiscount && appliedDiscount.discountType !== "shipping" && !appliedDiscount?.stripePromoId) {
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
                        unit_amount: -discountCents,
                        product_data: {
                            name: `Discount (${appliedDiscount.code})`,
                        },
                    },
                    quantity: 1,
                });
            }
        }

        // Determine if a shipping discount applies to a specific shipping method
        const hasFreeShippingDiscount =
            !!appliedDiscount &&
            (appliedDiscount.discountType === "shipping" || appliedDiscount.isFreeShipping === true);

        // If discount has specific rules, extract their ids, else null to mean "all"
        const appliesToShippingIds =
            hasFreeShippingDiscount && appliedDiscount.appliesToShipping?.length
                ? appliedDiscount.appliesToShipping.map(ref => ref._ref)
                : null; // null means applies to all

        // Build shipping options and make them free when conditions match
        const shippingOptionsPayload = (shippingOptions || []).map((rule) => {
            const dtMatch = (rule.deliveryTime || "").match(/(\d+)(?:-(\d+))?/);
            const minDays = dtMatch ? parseInt(dtMatch[1], 10) : 3;
            const maxDays = dtMatch ? parseInt(dtMatch[2] || dtMatch[1], 10) : minDays;

            const freeOverCents = rule.freeOver != null ? Math.round(rule.freeOver * 100) : null;
            let amount = Math.round((rule.shippingCost || 0) * 100);

            // freeOver condition
            const isFreeByRule = freeOverCents != null && subtotalCents >= freeOverCents;

            // free-shipping discount applies only if rule is in appliesToShipping
            const isFreeByDiscount =
                hasFreeShippingDiscount &&
                (
                    appliesToShippingIds === null || // no refs = all rules
                    appliesToShippingIds.includes(rule._id)
                );

            if (isFreeByRule || isFreeByDiscount) {
                amount = 0;
            }

            const displayName = amount === 0 ? `${rule.name} - Free` : rule.name;

            const shippingRateData = {
                display_name: displayName,
                delivery_estimate: {
                    minimum: { unit: "business_day", value: minDays },
                    maximum: { unit: "business_day", value: maxDays },
                },
                fixed_amount: {
                    amount,
                    currency: "USD",
                },
                type: "fixed_amount",
            };

            if (rule.freeOver) {
                shippingRateData.metadata = { freeOver: rule.freeOver };
            }

            return { shipping_rate_data: shippingRateData };
        });

        // put cheapest shipping first so free shipping becomes default in Checkout
        shippingOptionsPayload.sort(
            (a, b) => a.shipping_rate_data.fixed_amount.amount - b.shipping_rate_data.fixed_amount.amount
        );

        // Build session payload
        const sessionPayload = {
            mode: "payment",
            payment_method_types: ["card"],
            line_items: lineItems,
            metadata: {
                orderNumber: metadata?.orderNumber,
                customerName: metadata?.customerName,
                customerEmail: metadata?.customerEmail,
                clerkUserId: metadata?.clerkUserId,
                discountId: appliedDiscount?._id || "",
                items: JSON.stringify(
                    items.map((i) => ({
                        productId: i.productId,
                        variantSku: i.variant?.sku || null,
                        quantity: i.quantity,
                    }))
                ),
            },
            shipping_address_collection: {
                allowed_countries: ["US", "CA", "GB", "PK"],
            },
            shipping_options: shippingOptionsPayload,
            success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/success?session_id={CHECKOUT_SESSION_ID}&order_number=${metadata?.orderNumber}`,
            cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/cart`,
        };

        // Attach customer info
        if (customerId) {
            sessionPayload.customer = customerId;
        } else if (metadata?.customerEmail) {
            sessionPayload.customer_email = metadata.customerEmail;
        }

        // If you store the Stripe promotion code id on the discount, attach it so Stripe does the discount
        if (appliedDiscount?.stripePromoId) {
            sessionPayload.discounts = [
                { promotion_code: appliedDiscount.stripePromoId }
            ];
        } else {
            // No discount applied → let user enter one in Stripe checkout
            sessionPayload.allow_promotion_codes = true;
        }

        // Create Checkout Session
        const session = await stripe.checkout.sessions.create(sessionPayload);

        return session.url;
    } catch (error) {
        console.error("Error creating checkout session:", error);
        throw error;
    }
}
