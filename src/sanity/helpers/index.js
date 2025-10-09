import { defineQuery } from "next-sanity";
import { sanityFetch } from "../lib/live";

export const getSocialLinks = async () => {
    const LINKS_QUERY = defineQuery(`*[
        _type == "socialLink"]
        | order(order asc)[0...6]{
            _id,
            platform,
            url,
            order
        }
    `);
    try {
        const links = await sanityFetch({
            query: LINKS_QUERY,
        });
        return links?.data || [];
    } catch (error) {
        console.error("Error fetching social links:", error);
    }
};

export const getMyOrders = async (userId) => {
    if (!userId) {
        throw new Error("User Id is required!")
    }

    const MY_ORDERS_QUERY = defineQuery(`*[_type == "order" && customer.clerkUserId == $userId] 
    | order(createdAt desc) {
        _id,
        orderNumber,
        createdAt,
        total,
        status,
        // Customer info
        customer {
            shippingName,
            accountName,
            email
        },
        // Items list with product details
        items[] {
            variant,
            quantity,
            price,
            subtotal,
            "name": product->name,
            "productId": product->_id,
            "productSlug": product->slug.current,
            "image": product->images[0],
            "sku": product->sku,
        },
        // Shipping details
        shipping {
            cost,
            rule->{
            name,
            deliveryTime
            },
            address {
            line1,
            city,
            postalCode,
            country
            }
        },
        // Discount details
        discount->{
            code,
            discountType,
            value
        },
        payment {
            provider,
            status
        }
    }
    `);
    try {
        const orders = await sanityFetch({
            query: MY_ORDERS_QUERY,
            params: { userId }
        });
        return orders?.data || [];
    } catch (error) {
        console.error("Error fetching my orders:", error);
        return []
    }
};

export const getVariantInfo = async (productId, variantString) => {
    //Case 1: No variant (simple product)
    if (!variantString) {
        const FALLBACK_QUERY = defineQuery(`*[_type == "product" && _id == $id][0]{
      "sku": sku,
      "image": images[0]
    }`);
        try {
            const res = await sanityFetch({
                query: FALLBACK_QUERY,
                params: { id: productId },
            });
            return res?.data || {};
        } catch (error) {
            console.error("Error fetching fallback product info:", error);
            return {};
        }
    }

    //Case 2: Has variant string ("Black / M" or just "Black")
    const [color, size] = variantString.includes("/")
        ? variantString.split("/").map((s) => s.trim())
        : [variantString.trim(), null];

    // If variant has size → check both color and size
    const VARIANT_WITH_SIZE_QUERY = defineQuery(`*[_type == "product" && _id == $id][0]{
    "sku": coalesce(
      variants[color->name == $color].sizes[size == $size][0].sku,
      variants[color->name == $color].sizes[0].sku,
      sku
    ),
    "image": coalesce(
      variants[color->name == $color].images[0],
      images[0]
    )
  }`);

    // If variant only has color (no size)
    const VARIANT_COLOR_ONLY_QUERY = defineQuery(`*[_type == "product" && _id == $id][0]{
    "sku": coalesce(
      variants[color->name == $color].sizes[0].sku,
      sku
    ),
    "image": coalesce(
      variants[color->name == $color].images[0],
      images[0]
    )
  }`);

    const queryToUse = size ? VARIANT_WITH_SIZE_QUERY : VARIANT_COLOR_ONLY_QUERY;

    try {
        const variant = await sanityFetch({
            query: queryToUse,
            params: { id: productId, color, size },
        });
        return variant?.data || {};
    } catch (error) {
        console.error("Error fetching variant Image/SKU:", error);
        return {};
    }
};

export const getReviewsByProduct = async (productId, clerkUserId = null) => {
    if (!productId) {
        throw new Error("productId is required to fetch reviews");
    }

    const REVIEWS_QUERY = defineQuery(`
    {
      "userReview": *[_type == "review" && product._ref == $productId && clerkUserId == $clerkUserId] | order(date desc){
        _id,
        title,
        rating,
        comment,
        authorName,
        verifiedBuyer,
        clerkUserId,
        date,
        helpfulCount,
        helpfulUsers,
        variantDetails
      },
      "otherReviews": *[_type == "review" && product._ref == $productId && clerkUserId != $clerkUserId] 
        | order(helpfulCount desc, date desc){
          _id,
          title,
          rating,
          comment,
          authorName,
          verifiedBuyer,
          clerkUserId,
          date,
          helpfulCount,
          helpfulUsers,
          variantDetails
      },
      "averageRating": round(math::avg(*[_type == "review" && product._ref == $productId].rating), 1),
      "reviewCount": count(*[_type == "review" && product._ref == $productId])
    }
  `);

    try {
        const result = await sanityFetch({
            query: REVIEWS_QUERY,
            params: { productId, clerkUserId },
            next: { tags: [`reviews:${productId}`] }
        });

        const reviews = [
            ...(result?.data?.userReview?.map(r => ({
                ...r,
                isUserReview: true,
                hasVotedHelpful: r?.helpfulUsers?.includes(clerkUserId) || false
            })) || []),
            ...(result?.data?.otherReviews?.map(r => ({
                ...r,
                hasVotedHelpful: r?.helpfulUsers?.includes(clerkUserId) || false
            })) || []),
        ];

        return {
            reviews,
            averageRating: result?.data?.averageRating || 0,
            reviewCount: result?.data?.reviewCount || 0,
        };
    } catch (error) {
        console.error("Error fetching product reviews:", error);
        return { reviews: [], averageRating: 0, reviewCount: 0 };
    }
};