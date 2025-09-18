// app/api/sync-discount/route.js
import { NextResponse } from "next/server";
import { parseBody } from "next-sanity/webhook";
import stripe from "@/lib/stripe";
import { client } from "@/sanity/lib/client";

const writeToken = process.env.SANITY_WRITE_TOKEN;
const webhookSecret = process.env.SANITY_WEBHOOK_SECRET;

export async function POST(req) {
    try {
        const { isValidSignature, body } = await parseBody(req, webhookSecret);
        if (!isValidSignature) {
            return new NextResponse("Invalid signature", { status: 401 });
        }

        const discount = body;
        if (!discount?._id || !discount?.code) {
            return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
        }

        // 🚫 Skip self-updates
        if (discount.updatedBySync) {
            return NextResponse.json({ status: "skip-self" });
        }


        // 🚫 Skip shipping-only codes (Cart handles these)
        if (discount.discountType === "shipping") {
            await client
                .withConfig({ token: writeToken })
                .patch(discount._id)
                .set({ stripePromoId: null, updatedBySync: true, })
                .commit();
            return NextResponse.json({ status: "shipping-skip" });
        }

        const currency = "usd";

        /* ------------------ Handle Deactivation ------------------ */
        if (!discount.active) {
            if (discount.stripePromoId) {
                try {
                    await stripe.promotionCodes.update(discount.stripePromoId, { active: false });
                } catch (err) {
                    console.error("Failed to deactivate promo:", err.message);
                }
            }

            await client
                .withConfig({ token: writeToken })
                .patch(discount._id)
                .set({ stripePromoId: null, updatedBySync: true, })
                .commit();

            return NextResponse.json({ status: "deactivated" });
        }

        /* ------------------ Create or Update ------------------ */
        let promoCode;
        let recreate = false;

        if (discount.stripePromoId) {
            // fetch current promo + coupon
            promoCode = await stripe.promotionCodes.retrieve(discount.stripePromoId);
            const coupon = await stripe.coupons.retrieve(promoCode.coupon.id);

            // detect if immutable fields changed in Sanity
            const typeChanged =
                (discount.discountType === "percentage" && coupon.percent_off !== discount.value) ||
                (discount.discountType === "fixed" &&
                    coupon.amount_off !== Math.round(discount.value * 100));
            const expiresChanged =
                !!discount.expiresAt !== !!coupon.redeem_by ||
                (discount.expiresAt &&
                    Math.floor(new Date(discount.expiresAt).getTime() / 1000) !== coupon.redeem_by);
            const codeChanged = promoCode.code !== discount.code;
            const maxChanged = discount.maxRedemptions !== promoCode.max_redemptions;
            const minCartChanged =
                (discount.minCartValue ?? 0) * 100 !== (coupon?.metadata?.minCartValueCents ?? 0);
            const firstTimeChanged =
                !!discount.firstTimeCustomer !== !!coupon?.metadata?.firstTimeCustomer;

            if (typeChanged || expiresChanged || codeChanged || maxChanged || minCartChanged || firstTimeChanged) {
                recreate = true;

                // Deactivate old promo code (safe replacement for delete)
                try {
                    await stripe.promotionCodes.update(discount.stripePromoId, { active: false });
                } catch (err) {
                    console.warn("Could not deactivate old promo code:", err.message);
                }
                try {
                    await stripe.coupons.del(coupon.id);
                } catch (err) {
                    console.warn("Could not delete old coupon:", err.message);
                }
            }
        }

        if (recreate || !discount.stripePromoId) {
            // ✅ Create new coupon
            const coupon = await stripe.coupons.create({
                duration: "once", // applies once per redemption
                ...(discount.discountType === "percentage" && { percent_off: discount.value }),
                ...(discount.discountType === "fixed" && {
                    amount_off: Math.round(discount.value * 100),
                    currency,
                }),
                ...(discount.expiresAt && {
                    redeem_by: Math.floor(new Date(discount.expiresAt).getTime() / 1000),
                }),
                metadata: { description: discount.description ?? "" },
            });

            // ✅ Create new promo code
            promoCode = await stripe.promotionCodes.create({
                code: discount.code,
                coupon: coupon.id,
                active: true,
                restrictions: {
                    ...(discount.firstTimeCustomer ? { first_time_transaction: true } : {}),
                    minimum_amount: discount.minCartValue
                        ? Math.round(discount.minCartValue * 100)
                        : undefined,
                    minimum_amount_currency: discount.minCartValue ? currency : undefined,
                },
                ...(discount.maxRedemptions ? { max_redemptions: discount.maxRedemptions } : {}),
                metadata: { description: discount.description ?? "" },
            });
        } else {
            // ✅ Only allowed updates
            // Only allowed updates: active + metadata
            promoCode = await stripe.promotionCodes.update(discount.stripePromoId, {
                active: true,
                metadata: { description: discount.description ?? "" },
            });

            // Coupon → only metadata allowed
            await stripe.coupons.update(promoCode.coupon.id, {
                metadata: { description: discount.description ?? "" },
            });
        }

        /* ------------------ Update Sanity ------------------ */
        await client
            .withConfig({ token: writeToken })
            .patch(discount._id)
            .set({
                stripePromoId: promoCode.id,
                redemptions: promoCode.times_redeemed ?? 0,
                updatedBySync: true,
            })
            .commit();

        return NextResponse.json({
            status: recreate ? "recreated" : "synced",
            stripePromoId: promoCode.id,
        });
    } catch (err) {
        console.error("Sync error:", err);
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
