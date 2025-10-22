import { defineQuery } from "next-sanity";
import { sanityFetch } from "../lib/live";

export const getFiltersData = async () => {
    const FILTERS_QUERY = defineQuery(`
        {
            "categories": *[_type == "category"]{
                _id,
                name,
                "slug":
                slug.current,
                parent->{ _id, name }
            },
            "sizes": array::unique(*[_type == "product"].variants[].sizes[].size),
            "colors": *[_type == "color"]{ _id, name, hex },
            "materials": *[_type == "material"]{ _id, name },
            "maxPrice": math::max(*[_type == "product"].price),
            "minPrice": math::min(*[_type == "product"].price)
        }
    `);
    try {
        const filters = await sanityFetch({ query: FILTERS_QUERY });

        return filters?.data || {};
    } catch (error) {
        console.error("Error fetching shop data:", error);
        return { filters: {}, products: [] };
    }
};

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