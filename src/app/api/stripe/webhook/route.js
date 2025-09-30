import { NextResponse } from "next/server";
import stripe from "@/lib/stripe";
import { headers } from "next/headers";
import { backendClient } from "@/sanity/lib/backendClient";

export const config = {
    api: { bodyParser: false },
};

export async function POST(req) {
    const body = await req.text();
    const headerList = await headers();
    const sig = headerList.get("stripe-signature");

    if (!sig) {
        return NextResponse.json({ error: "Missing Stripe signature" }, { status: 400 });
    }

    const webhookSecret = process.env.STRIPE_WEBHOOK_KEY;
    if (!webhookSecret) {
        console.error("Stripe webhook secret is not set.");
        return NextResponse.json({ error: "Stripe webhook secret is not set." }, { status: 400 });
    }

    let event;
    try {
        event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
    } catch (err) {
        console.error("❌ Webhook signature verification failed:", err.message);
        return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
    }

    try {
        if (event.type === "checkout.session.completed") {
            const session = event.data.object;

            // Expand line items
            const lineItems = await stripe.checkout.sessions.listLineItems(session.id, {
                expand: ["data.price.product"],
            });

            // Parse items metadata we sent from the cart
            const cartItems = session.metadata?.items
                ? JSON.parse(session.metadata.items)
                : [];

            // Build order doc for Sanity
            const orderDoc = {
                _type: "order",
                orderNumber: session.metadata?.orderNumber || session.id,
                customer: {
                    name: session.metadata?.customerName,
                    email: session.metadata?.customerEmail,
                    clerkUserId: session.metadata?.clerkUserId,
                },
                items: lineItems.data.map((item, idx) => {
                    const cartItem = cartItems[idx]; // match order
                    return {
                        _key: item.id,
                        product: cartItem?.productId
                            ? { _type: "reference", _ref: cartItem.productId }
                            : null,
                        name: item.description,
                        sku: cartItem?.variant?.sku || cartItem?.sku,
                        variant: cartItem?.variant
                            ? `${cartItem.variant.colorName ?? ""} ${cartItem.variant.size ?? ""}`.trim()
                            : null,
                        quantity: item.quantity,
                        price: item.price?.unit_amount / 100,
                        subtotal: (item.amount_subtotal ?? 0) / 100,
                    };
                }),
                shipping: {
                    rule: session.metadata?.shippingRuleId
                        ? { _type: "reference", _ref: session.metadata.shippingRuleId }
                        : null,
                    address: session.customer_details?.address
                        ? {
                            line1: session.customer_details.address.line1,
                            line2: session.customer_details.address.line2,
                            city: session.customer_details.address.city,
                            state: session.customer_details.address.state,
                            postalCode: session.customer_details.address.postal_code,
                            country: session.customer_details.address.country,
                        }
                        : null,
                    cost: session.shipping_cost?.amount_total
                        ? session.shipping_cost.amount_total / 100
                        : 0,
                },

                discount: session.metadata?.discountId
                    ? { _type: "reference", _ref: session.metadata.discountId }
                    : null,
                total: session.amount_total / 100,
                status: "paid",
                payment: {
                    provider: "stripe",
                    sessionId: session.id,
                    paymentIntentId: session.payment_intent,
                    status: session.payment_status,
                },
                createdAt: new Date().toISOString(),
            };

            // Save in Sanity
            await backendClient.create(orderDoc);
            console.log("✅ Order saved to Sanity:", orderDoc.orderNumber);
        }
    } catch (err) {
        console.error("⚠️ Webhook handler error:", err);
        return new NextResponse("Webhook handler error", { status: 500 });
    }

    return new NextResponse("ok", { status: 200 });
}
