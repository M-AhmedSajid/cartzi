import { defineQuery } from "next-sanity"
import { sanityFetch } from "../lib/live"

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
      `)
    try {
        const product = await sanityFetch({
            query: PRODUCT_BY_SLUG_QUERY,
            params: {
                slug
            }
        })
        return product?.data || null
    } catch (error) {
        console.error("Error fetching product by slug:", error)
    }
}

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