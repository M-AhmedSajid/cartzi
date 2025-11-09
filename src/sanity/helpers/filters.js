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
  const { color, size, material, stock, discount, sort } = filters;
  const [minPrice, maxPrice] = range;
  console.log({
    color,
    size,
    material,
    minPrice,
    maxPrice,
    stock,
    discount,
    sort
  });

  let sortQuery = "_createdAt desc"
  switch (sort) {
    case "newest":
      sortQuery = "_createdAt desc";
      break;
    case "price-asc":
      sortQuery = "(price - (price * discount) / 100) asc";
      break;
    case "price-desc":
      sortQuery = "(price - (price * discount) / 100) desc";
      break;
    case "rating":
      sortQuery = "coalesce(rating, 0) desc";
      break;
    default:
      sortQuery = "_createdAt desc";
      break;
  }

  const FILTERED_PRODUCTS_QUERY = defineQuery(`
    *[
      _type == "product" &&
        (
          (!defined($minPrice) || price >= $minPrice) &&
          (!defined($maxPrice) || price <= $maxPrice)
        )
      &&
      (
        !defined($color) || !($color)[0] || count(variants[@.color->name in $color]) > 0
      ) &&
      (
        !defined($size) || !($size)[0] || count(variants[].sizes[@.size in $size]) > 0
      ) &&
      (
        !defined($material) || !($material)[0] || material->name in $material
      ) &&
      (
        !defined($stock) || $stock != "in-stock" ||
        stock > 0 ||
        count(variants[].sizes[@.stock > 0]) > 0
      ) &&
      (
        !defined($discount) || $discount != "on-sale" ||
        discount > 0
      )
    ]{
      _id,
      name,
      intro,
      "slug": slug.current,
      description,
      price,
      discount,
      stock,
      sku,
      "images": coalesce(
      variants[count(sizes[stock > 0]) > 0][0].images,
      variants[0].images,
      images
    ),
    "stock": coalesce(
          variants[count(sizes[stock > 0]) > 0][0].sizes[stock > 0][0].stock,
          stock
        ),
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
      material->{ name },
      "rating": round(math::avg(*[_type == "review" && product._ref == ^._id].rating), 1)
    } | order(${sortQuery})
  `);

  try {
    const products = await sanityFetch({
      query: FILTERED_PRODUCTS_QUERY,
      params: {
        color: Array.isArray(color) && color.length > 0 ? color : null,
        size: Array.isArray(size) && size.length > 0 ? size : null,
        material: Array.isArray(material) && material.length > 0 ? material : null,
        minPrice: typeof minPrice === "number" ? minPrice : null,
        maxPrice: typeof maxPrice === "number" ? maxPrice : null,
        stock: stock || null,
        discount: discount || null,
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