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
                parent->{ _id, name, "slug": slug.current }
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

export const getFilteredProducts = async (filters = {}, range = []) => {
    const { color, size, material } = filters;
    const [minPrice, maxPrice] = range;
    console.log({
    color,
    size,
    material,
    minPrice,
    maxPrice,
  });

    const FILTERED_PRODUCTS_QUERY = defineQuery(`
    *[
      _type == "product" &&
      price >= $minPrice &&
      price <= $maxPrice &&
      (
        !$color ||
        count(variants[@.color->_id in $color]) > 0
      ) &&
      (
        !$size ||
        count(variants[].sizes[@.size in $size]) > 0
      ) &&
      (
        !$material ||
        material->_id in $material
      )
    ]{
      _id,
      name,
      price,
      discount,
      discountedPrice,
      "slug": slug.current,
      intro,
      images[0],
      categories[]->{
        name,
        "slug": slug.current,
        parent->{ name, "slug": slug.current }
      },
      variants[]{
        color->{ name, hex },
        images[],
        sizes[]{ size, sku, stock, priceOverride }
      },
      material->{ name }
    } | order(_createdAt desc)
  `);

    try {
        const products = await sanityFetch({
            query: FILTERED_PRODUCTS_QUERY,
            params: {
                color: Array.isArray(color) && color.length > 0 ? color : null,
                size: Array.isArray(size) && size.length > 0 ? size : null,
                material: Array.isArray(material) && material.length > 0 ? material : null,
                minPrice: typeof minPrice === "number" ? minPrice : 0,
                maxPrice: typeof maxPrice === "number" ? maxPrice : 999999,
            },
        });

        return products?.data || [];
    } catch (error) {
        console.error("Error fetching filtered products:", error);
        return [];
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