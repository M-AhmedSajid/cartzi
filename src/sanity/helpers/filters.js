import { defineQuery } from "next-sanity";
import { sanityFetch } from "../lib/live";
import { buildPagination, buildProductFilters, buildSort, PRODUCT_PROJECTION } from "@/lib/products";

export const getFiltersData = async () => {
    const FILTERS_QUERY = defineQuery(`
        {
            "categories": *[_type == "category"]{
                _id,
                name,
                "slug": slug.current,

                parent->{
                    _id,
                    name,
                    "slug": slug.current
                },

                "count": count(
                    *[
                        _type == "product" &&
                        references(^._id)
                    ]
                )
            },
            "sizes": [
                {
                    "name": "XS",
                    "count": count(
                        *[
                            _type == "product" &&
                            count(
                                variants[].sizes[
                                    size == "XS"
                                ]
                            ) > 0
                        ]
                    )
                },
                {
                    "name": "S",
                    "count": count(
                        *[
                            _type == "product" &&
                            count(
                                variants[].sizes[
                                    size == "S"
                                ]
                            ) > 0
                        ]
                    )
                },
                {
                    "name": "M",
                    "count": count(
                        *[
                            _type == "product" &&
                            count(
                                variants[].sizes[
                                    size == "M"
                                ]
                            ) > 0
                        ]
                    )
                },
                {
                    "name": "L",
                    "count": count(
                        *[
                            _type == "product" &&
                            count(
                                variants[].sizes[
                                    size == "L"
                                ]
                            ) > 0
                        ]
                    )
                },
                {
                    "name": "XL",
                    "count": count(
                        *[
                            _type == "product" &&
                            count(
                                variants[].sizes[
                                    size == "XL"
                                ]
                            ) > 0
                        ]
                    )
                },
                {
                    "name": "XXL",
                    "count": count(
                        *[
                            _type == "product" &&
                            count(
                                variants[].sizes[
                                    size == "XXL"
                                ]
                            ) > 0
                        ]
                    )
                }
            ],
            "colors": *[_type == "color"]{
                _id,
                name,
                hex,

                "count": count(
                    *[
                        _type == "product" &&
                        count(
                            variants[
                                color._ref == ^._id
                            ]
                        ) > 0
                    ]
                )
            },
            "materials": *[_type == "material"]{
                _id,
                name,

                "count": count(
                    *[
                        _type == "product" &&
                        material._ref == ^._id
                    ]
                )
            },
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

export async function getProducts(options = {}) {
    const page = options.page ?? 1;
    const limit = options.limit ?? 24;

    const { filters, params } =
        buildProductFilters(options);

    const order =
        buildSort(options.sort || "newest");

    const { start, end } =
        buildPagination(page, limit);

    const query = defineQuery(`
    {
        "products": *[
            ${filters.join(" && ")}
        ]{
            ${PRODUCT_PROJECTION}
        }
        | order(${order})
        [${start}...${end}],

        "total": count(*[
            ${filters.join(" && ")}
        ])
    }
    `);

    const { data } = await sanityFetch({
        query,
        params,
    });

    return {
        products: data.products,
        total: data.total,
        page,
        totalPages: Math.ceil(data.total / limit),
        limit,
    };
}

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