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

    const MY_ORDERS_QUERY = defineQuery(`*[
        _type == "order" && customer.clerkUserId == $userId]
        | order(order desc){
            ...products[]
        }
    `);
    try {
        const orders = await sanityFetch({
            query: MY_ORDERS_QUERY,
        });
        return orders?.data || [];
    } catch (error) {
        console.error("Error fetching my orders:", error);
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
        date,
        helpfulCount,
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
          date,
          helpfulCount,
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
        });

        const reviews = [
            ...(result?.data?.userReview?.map(r => ({ ...r, isUserReview: true })) || []),
            ...(result?.data?.otherReviews || []),
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