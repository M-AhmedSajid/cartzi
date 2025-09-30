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
        const links = await sanityFetch({
            query: LINKS_QUERY,
        });
        return links?.data || [];
    } catch (error) {
        console.error("Error fetching social links:", error);
    }
};