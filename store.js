import { create } from 'zustand'
import { persist } from 'zustand/middleware'

/* ----------------- Utilities ------------------ */

const toCents = (price) =>
    Math.max(0, Math.round(((price ?? 0)) * 100))

const computeBaseCents = (product, variant) => {
    const base =
        typeof variant?.priceOverride === 'number'
            ? variant.priceOverride
            : product.price ?? 0
    return toCents(base)
}

const applyDiscountCents = (baseCents, product) => {
    const pct = Number(product?.discount ?? 0)
    if (!pct) return { unitPriceCents: baseCents, compareAtCents: undefined }
    const discountCents = Math.round((pct / 100) * baseCents)
    const unitPriceCents = Math.max(0, baseCents - discountCents)
    return { unitPriceCents, compareAtCents: baseCents }
}

const pickImage = (product, variant) => {
    if (variant?.images?.[0]) {
        return variant.images[0]; // full Sanity image object
    }

    // If no variant, return first product image
    if (product?.images?.[0]) {
        return product.images[0] // full image object
    }

    return null // fallback if no images exist
}

/** Always return SKU as the cart key */
const resolveKey = (product, variant) => {
    const hasVariants =
        Array.isArray(product?.variants) && product.variants.length > 0
    const sku = hasVariants ? variant?.sku : product?.sku
    return sku
}

const resolveStock = (product, variant) => {
    const hasVariants =
        Array.isArray(product?.variants) && product.variants.length > 0
    if (hasVariants) return variant?.stock ?? 0
    return product?.stock ?? 0
}

/* ----------------- Store ------------------ */

export const useCartStore = create()(
    persist(
        (set, get) => ({
            items: [],

            addItem: ({ product, variant, quantity = 1 }) => {
                const key = resolveKey(product, variant)
                const baseCents = computeBaseCents(product, variant)
                const { unitPriceCents, compareAtCents } = applyDiscountCents(
                    baseCents,
                    product
                )
                const image = pickImage(product, variant)
                const stock = resolveStock(product, variant)

                set((state) => {
                    const idx = state.items.findIndex((it) => it.key === key)
                    if (idx >= 0) {
                        const current = state.items[idx]
                        const nextQty = Math.min(
                            current.quantity + quantity,
                            Math.max(0, stock)
                        )
                        const next = [...state.items]
                        next[idx] = { ...current, quantity: nextQty }
                        return { items: next }
                    }

                    const newItem = {
                        key,
                        productId: product._id,
                        name: product.name,
                        slug: product?.slug,
                        image,
                        product,
                        description: product.description || "",
                        variant: variant
                            ? {
                                colorName: variant.colorName,
                                size: variant.size,
                                sku: variant.sku,
                                priceOverride: variant.priceOverride,
                                stock: stock,
                            }
                            : {
                                sku: key,
                                stock: stock,
                            },
                        unitPriceCents,
                        compareAtCents,
                        quantity: Math.min(quantity, Math.max(0, stock)),
                    }

                    return { items: [...state.items, newItem] }
                })
            },

            increment: (product, variant) => {
                const key = resolveKey(product, variant)
                set((state) => {
                    const idx = state.items.findIndex((it) => it.key === key)
                    if (idx < 0) return { items: state.items }
                    const item = state.items[idx]
                    const stock = resolveStock(item.product, item.variant)
                    const nextQty = Math.min(item.quantity + 1, Math.max(0, stock))
                    const next = [...state.items]
                    next[idx] = { ...item, quantity: nextQty }
                    return { items: next }
                })
            },

            decrement: (product, variant) => {
                const key = resolveKey(product, variant)
                set((state) => {
                    const idx = state.items.findIndex((it) => it.key === key)
                    if (idx < 0) return { items: state.items }
                    const item = state.items[idx]
                    const nextQty = Math.max(0, item.quantity - 1)
                    if (nextQty === 0) {
                        return {
                            items: state.items.filter((it) => it.key !== key),
                        }
                    }
                    const next = [...state.items]
                    next[idx] = { ...item, quantity: nextQty }
                    return { items: next }
                })
            },

            updateQuantity: (product, variant, quantity) => {
                const key = resolveKey(product, variant)
                set((state) => {
                    const idx = state.items.findIndex((it) => it.key === key)
                    if (idx < 0) return { items: state.items }
                    const item = state.items[idx]
                    const stock = resolveStock(item.product, item.variant)
                    const nextQty = Math.max(
                        0,
                        Math.min(quantity, Math.max(0, stock))
                    )
                    if (nextQty === 0) {
                        return {
                            items: state.items.filter((it) => it.key !== key),
                        }
                    }
                    const next = [...state.items]
                    next[idx] = { ...item, quantity: nextQty }
                    return { items: next }
                })
            },

            removeItem: (product, variant) => {
                const key = resolveKey(product, variant)
                set((state) => ({
                    items: state.items.filter((it) => it.key !== key),
                }))
            },

            resetCart: () => set({ items: [] }),

            // selectors
            getItems: () => get().items,
            isInCart: (product, variant) => {
                const key = resolveKey(product, variant)
                return get().items.some((it) => it.key === key)
            },
            getItemQuantity: (product, variant) => {
                const key = resolveKey(product, variant)
                return get().items.find((it) => it.key === key)?.quantity ?? 0
            },
            getItemSubtotalCents: (product, variant) => {
                const key = resolveKey(product, variant)
                const item = get().items.find((it) => it.key === key)
                return item ? item.unitPriceCents * item.quantity : 0
            },
            getCartCount: () =>
                get().items.reduce((sum, it) => sum + it.quantity, 0),

            getSubtotalCents: () =>
                get().items.reduce(
                    (sum, it) => sum + it.unitPriceCents * it.quantity,
                    0
                ),

            shippingRule: null,
            setShippingRule: (rule) => set({ shippingRule: rule }),
            clearShippingRule: () => set({ shippingRule: null }),
            getShippingCents: () => {
                const rule = get().shippingRule;
                if (!rule) return 0;

                const discount = get().appliedDiscount;

                // ✅ Free shipping for all rules
                if (discount?.discountType === "shipping" && (!discount.appliesToShipping || discount.appliesToShipping.length === 0)) {
                    return 0;
                }

                // ✅ Free shipping for specific rules (array)
                if (
                    discount?.discountType === "shipping" &&
                    Array.isArray(discount.appliesToShipping) &&
                    discount.appliesToShipping.some((r) => r._ref === rule._id)
                ) {
                    return 0;
                }

                // ✅ Threshold free shipping
                const subtotalDollars = get().getSubtotalCents() / 100;
                if (rule.freeOver && subtotalDollars >= rule.freeOver) {
                    return 0;
                }

                // Default → normal cost
                return Math.round((rule.shippingCost ?? 0) * 100);
            },

            appliedDiscount: null,
            applyDiscount: (discountDoc) => {
                // discountDoc will come from Sanity fetch (code + rules)
                const subtotal = get().getSubtotalCents() / 100; // dollars
                if (discountDoc?.minCartValue && subtotal < discountDoc.minCartValue) {
                    return { error: "Cart value is too low for this discount." };
                }

                set({ appliedDiscount: discountDoc });
                return { success: true };
            },
            removeDiscount: () => {
                set({ appliedDiscount: null });
            },
            calculateDiscount: (subtotalCents, discount) => {
                if (!discount) return 0;
                const { discountType, value } = discount;
                if (discountType === "percentage") {
                    return Math.round((value / 100) * subtotalCents);
                }
                if (discountType === "fixed") {
                    return Math.min(Math.round(value * 100), subtotalCents); // don’t exceed subtotal
                }
                if (discountType === "shipping") {
                    // Shipping is handled separately → no cart discount here
                    return 0;
                }
                return 0;
            },
            getTotalCents: () => {
                const subtotal = get().getSubtotalCents();
                const discount = get().appliedDiscount
                    ? get().calculateDiscount(subtotal, get().appliedDiscount)
                    : 0;

                const shipping = get().getShippingCents();

                return Math.max(0, subtotal + shipping - discount);
            },

            selectShippingRule: (rules, region) => {
                const subtotalDollars = get().getSubtotalCents() / 100;
                const totalWeight = get().items.reduce((sum, it) => {
                    const weight = it.product?.weight?.value ?? 0;
                    return sum + weight * it.quantity;
                }, 0);

                // Filter rules for the region
                let candidates = rules.filter(
                    (r) => r.region === region || r.region === "Worldwide"
                );

                // Apply minOrderValue and maxOrderWeight
                candidates = candidates.filter((r) => {
                    const meetsMin = !r.minOrderValue || subtotalDollars >= r.minOrderValue;
                    const withinWeight = !r.maxOrderWeight || totalWeight <= r.maxOrderWeight;
                    return meetsMin && withinWeight && r.active;
                });

                // Pick cheapest valid option
                const bestRule =
                    candidates.sort((a, b) => (a.shippingCost ?? 0) - (b.shippingCost ?? 0))[0] || null;

                set({ shippingRule: bestRule });
                return bestRule;
            },
        }),
        {
            name: 'cartzi-cart-v1',
            version: 1,
            partialize: (state) => ({ items: state.items }),
            migrate: (persistedState, version) => {
                const s = persistedState
                if (!s?.items) return persistedState
                s.items = s.items.map((it) => {
                    if (typeof it.unitPriceCents === 'number') return it
                    const base = computeBaseCents(it.product, it.variant)
                    const { unitPriceCents, compareAtCents } = applyDiscountCents(
                        base,
                        it.product
                    )
                    return { ...it, unitPriceCents, compareAtCents }
                })
                return s
            },
        }
    )
)

export default useCartStore
