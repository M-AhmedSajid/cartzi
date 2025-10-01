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
            const session = await stripe.checkout.sessions.retrieve(
                event.data.object.id,
                {
                    expand: ["shipping_cost.shipping_rate"],
                }
            );

            // Expand line items
            const lineItems = await stripe.checkout.sessions.listLineItems(session.id, {
                expand: ["data.price.product"],
            });

            // Parse cart items metadata (fallback if needed)
            const cartItems = session.metadata?.items
                ? JSON.parse(session.metadata.items)
                : [];

            const sanityRuleId = session.shipping_cost?.shipping_rate?.metadata?.sanityShippingRuleId;

            // Build order doc for Sanity
            const orderDoc = {
                _type: "order",
                orderNumber: session.metadata?.orderNumber || session.id,
                customer: {
                    accountName: session.metadata?.customerName,
                    shippingName: session.customer_details?.name,
                    email: session.metadata?.customerEmail,
                    clerkUserId: session.metadata?.clerkUserId,
                },
                items: lineItems.data.map((item, idx) => {
                    const product = item.price?.product;
                    const productMeta = product?.metadata || {};
                    const cartItem = cartItems[idx]; // still used as fallback

                    return {
                        _key: item.id,
                        product: productMeta.productId
                            ? { _type: "reference", _ref: productMeta.productId }
                            : cartItem?.productId
                                ? { _type: "reference", _ref: cartItem.productId }
                                : null,
                        name: product?.name || item.description, // prefer product name from Stripe
                        sku: productMeta.variantSku || cartItem?.variant?.sku || cartItem?.sku || null,
                        variant: [productMeta.color, productMeta.size].filter(Boolean).join(" / ") || null,
                        quantity: item.quantity,
                        price: (item.price?.unit_amount ?? 0) / 100,
                        subtotal: (item.amount_subtotal ?? 0) / 100,
                    };
                }),
                shipping: {
                    ...(sanityRuleId && {
                        rule: { _type: "reference", _ref: sanityRuleId },
                    }),
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
                ...(session.metadata?.discountId
                    ? { discount: { _type: "reference", _ref: session.metadata.discountId } }
                    : {}),
                total: (session.amount_total ?? 0) / 100,
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
