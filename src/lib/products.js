export function buildProductFilters(options) {
    const {
        search,
        category,
        colors = [],
        sizes = [],
        materials = [],
        stock,
        discount,
        minPrice,
        maxPrice,
    } = options;
    const filters = ['_type == "product"'];
    const params = {};

    // Search
    if (search?.trim()) {
        filters.push(`(
      name match $search ||
      intro match $search ||
      description match $search ||
      sku match $search ||
      tags[] match $search
    )`);

        params.search = `${search.trim()}*`;
    }

    // Category
    const hasCategory = Array.isArray(category)
        ? category.length > 0
        : Boolean(category);

    if (hasCategory) {
        const categoryArray = Array.isArray(category) ? category : [category];
        const categoryClauses = [];

        const slugify = (value) =>
            String(value || "")
                .trim()
                .toLowerCase()
                .replace(/\s+/g, "-");

        categoryArray.forEach((value, index) => {
            const [parentPart, ...rest] = String(value || "").split("-");
            const childPart = rest.join("-");

            if (childPart) {
                const parentSlug = slugify(parentPart);
                const childSlug = slugify(childPart);

                categoryClauses.push(
                    `count(categories[@->slug.current == $categoryChild${index} && @->parent->slug.current == $categoryParent${index}]) > 0`,
                );
                params[`categoryChild${index}`] = childSlug;
                params[`categoryParent${index}`] = parentSlug;
            } else {
                const slug = slugify(value);
                categoryClauses.push(
                    `count(categories[@->slug.current == $category${index} || @->parent->slug.current == $category${index}]) > 0`,
                );
                params[`category${index}`] = slug;
            }
        });

        filters.push(`(${categoryClauses.join(" || ")})`);
    }

    // Colors
    if (colors.length) {
        filters.push(`
      count(variants[@.color->name in $colors]) > 0
    `);

        params.colors = colors;
    }

    // Sizes
    if (sizes.length) {
        filters.push(`
      count(variants[].sizes[@.size in $sizes]) > 0
    `);

        params.sizes = sizes;
    }

    // Materials
    if (materials.length) {
        filters.push(`
      material->name in $materials
    `);

        params.materials = materials;
    }

    // Stock
    if (stock === "in-stock") {
        filters.push(`
      stock > 0 ||
      count(variants[].sizes[@.stock > 0]) > 0
    `);
    }

    // Discount
    if (discount === "on-sale") {
        filters.push(`discount > 0`);
    }

    // Price
    if (typeof minPrice === "number") {
        filters.push(`price >= $minPrice`);
        params.minPrice = minPrice;
    }

    if (typeof maxPrice === "number") {
        filters.push(`price <= $maxPrice`);
        params.maxPrice = maxPrice;
    }
    return { filters, params };
}

const SORTS = {
    newest: "_createdAt desc",
    oldest: "_createdAt asc",
    "price-asc": "price asc",
    "price-desc": "price desc",
    rating: "rating desc",
    popular: "sales desc",
    featured: "featured desc",
};

export function buildSort(sort) {
    return SORTS[sort] ?? SORTS.newest;
}

export function buildPagination(page, limit) {
    const start = (page - 1) * limit;
    return {
        start,
        end: start + limit,
    };
    
}

export const PRODUCT_PROJECTION = `
    _id,
    name,
    intro,
    description,
    sku,
    price,
    discount,
    stock,
    "slug": slug.current,

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
        parent->{
        name,
        "slug": slug.current
        }
    },

    variants[]{
        color->{name,hex},
        images[],
        sizes[]{
        size,
        sku,
        stock,
        priceOverride
        }
    },

    material->{name},

    "rating": round(
        math::avg(
        *[_type=="review" && product._ref == _id].rating
        ),
        1
    )
`;

export function parseSearchParams(searchParams = {}) {
  const getString = (key) => {
    const value = searchParams[key];

    if (Array.isArray(value)) {
      return value[0] ?? "";
    }

    return value ?? "";
  };

  const getArray = (key) => {
    const value = getString(key);

    return value
      ? value
          .split(",")
          .map((v) => v.trim())
          .filter(Boolean)
      : [];
  };

  const getNumber = (key) => {
    const stringValue = getString(key);
    if (stringValue === "") return undefined;

    const value = Number(stringValue);
    return Number.isFinite(value) ? value : undefined;
  };

  return {
    search: getString("q"),

    category: getArray("category"),
    colors: getArray("color"),
    sizes: getArray("size"),
    materials: getArray("material"),

    stock: getString("stock") || undefined,
    discount: getString("discount") || undefined,

    minPrice: getNumber("min"),
    maxPrice: getNumber("max"),

    sort: getString("sort") || "newest",

    page: Math.max(getNumber("page") ?? 1, 1),
    limit: Math.max(getNumber("limit") ?? 18, 1),
  };
}