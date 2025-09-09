import { defineQuery } from "next-sanity";
import { sanityFetch } from "../lib/live";

export const getProductBySlug = async (slug) => {
  const PRODUCT_BY_SLUG_QUERY = defineQuery(`
        *[_type == "product" && slug.current == $slug][0]{
            ...,
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
                images[]{ asset->{ url }, alt },
                sizes[] {
                    size,
                    sku,
                    stock,
                    priceOverride
                }
            }
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

export const getCategoriesForMenu = async () => {
  const MENU_CATEGORIES_QUERY = defineQuery(`*[
        _type == "category" && !defined(parent)]{
        _id,
        name,
        "slug": slug.current,
        "subcategories": *[_type == "category" && parent._ref == ^._id]{_id, name, "slug": slug.current}
      }
    `);
  try {
    const categories = await sanityFetch({
      query: MENU_CATEGORIES_QUERY,
    });
    return categories?.data || [];
  } catch (error) {
    console.error("Error fetching categories for menu:", error);
  }
};

// export const getCategoriesOfProduct = async (slug) => {
//     const CATEGORIES_OF_PRODUCT_QUERY = defineQuery(
//         `*[_type == "product" && slug.current == $slug][0].categories[]->{
//             name,
//             slug,
//             "parent": parent->{
//                 name,
//                 slug,
//                 "parent": parent->{
//                 name,
//                 slug
//                 }
//             }
//             }`
//     )
//     try {
//         const categories = await sanityFetch({
//             query: CATEGORIES_OF_PRODUCT_QUERY,
//             params: {
//                 slug
//             }
//         })
//         return categories?.data || null
//     } catch (error) {
//         console.error("Error fetching categories of a product:", error)
//     }
// }

// export const getVariants = async (slug) => {
//     const VARIANTS_QUERY = defineQuery(
//         `*[_type == "product" && slug.current == $slug][0].variants[]{
//             size,
//             color->{name, hex},
//             sku,
//             stock,
//             priceOverride,
//             images[]{
//                 asset->{url},
//                 alt
//             }
//         }`
//     )
//     try {
//         const variants = await sanityFetch({
//             query: VARIANTS_QUERY,
//             params: {
//                 slug
//             }
//         })
//         return variants?.data || null
//     } catch (error) {
//         console.error("Error fetching variants of a product:", error)
//     }
// }
