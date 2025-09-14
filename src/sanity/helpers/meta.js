import { defineQuery } from "next-sanity";
import { sanityFetch } from "@/sanity/lib/live";

// Fetch all categories
export async function getAllCategories() {
    try {
        const query = defineQuery(`*[_type == "category"] | order(name asc) {
      _id,
      name,
      slug
    }`);
        const result = await sanityFetch({ query });
        return result?.data || [];
    } catch (error) {
        console.error("Error fetching categories:", error);
        return [];
    }
}

// Fetch all unique tags
export async function getAllTags() {
    try {
        const query = defineQuery(`array::unique(*[_type == "product"].tags[])`);
        const result = await sanityFetch({ query });
        return result?.data || [];
    } catch (error) {
        console.error("Error fetching tags:", error);
        return [];
    }
}
