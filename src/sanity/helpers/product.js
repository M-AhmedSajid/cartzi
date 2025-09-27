import { defineQuery } from "next-sanity";
import { sanityFetch } from "@/sanity/lib/live";

export const getProductBySlug = async (slug) => {
    const PRODUCT_BY_SLUG_QUERY = defineQuery(`
        *[_type == "product" && slug.current == $slug][0]{
            ...,
            "slug": slug.current,
            material->{ name },
            categories[]->{
                ...,
                name,
                slug,
                "parent": parent->{
                    name,
                    slug,
                    "parent": parent->{
                        name,
                        slug
                    }
                }
            },
            variants[] {
                color->{ name, hex },
                images[],
                sizes[] {
                    size,
                    sku,
                    stock,
                    priceOverride
                }
            },
            "reviews": *[_type == "review" && references(^._id)] | order(helpfulCount desc, date desc){
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
            "averageRating": round(math::avg(*[_type == "review" && product._ref == ^._id].rating), 1),
            "reviewCount": count(*[_type == "review" && product._ref == ^._id])
        }
      `);
    try {
        const product = await sanityFetch({
            query: PRODUCT_BY_SLUG_QUERY,
            params: {
                slug,
            },
        });
        return product?.data || null;
    } catch (error) {
        console.error("Error fetching product by slug:", error);
    }
};

export const getParentCategories = async () => {
    const CATEGORIES_QUERY = defineQuery(`*[
        _type == "category" && parent == null]
        | order(order asc)[0...6]{
            _id,
            name,
            "slug": slug.current,
            description,
            image,
            order
        }
    `);
    try {
        const categories = await sanityFetch({
            query: CATEGORIES_QUERY,
        });
        return categories?.data || [];
    } catch (error) {
        console.error("Error fetching parent categories:", error);
    }
};