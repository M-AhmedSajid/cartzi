import { Star } from "lucide-react";
import { defineType, defineField } from "sanity";

export const reviewType = defineType({
    name: "review",
    title: "Review",
    type: "document",
    icon: Star,
    fields: [
        defineField({
            name: "title",
            title: "Review Title",
            description: "A short headline for the review (e.g., 'Exceptional quality and comfort').",
            type: "string",
            validation: (Rule) => Rule.required().min(3).max(100),
        }),

        defineField({
            name: "rating",
            title: "Rating",
            description: "Star rating given by the customer (1 = poor, 5 = excellent).",
            type: "number",
            validation: (Rule) => Rule.required().min(1).max(5),
        }),

        defineField({
            name: "comment",
            title: "Review Text",
            description: "The full customer review text.",
            type: "text",
            rows: 4,
            validation: (Rule) => Rule.required().min(10).max(2000),
        }),

        defineField({
            name: "product",
            title: "Reviewed Product",
            description: "The product this review belongs to.",
            type: "reference",
            to: [{ type: "product" }],
            validation: (Rule) => Rule.required(),
        }),

        defineField({
            name: "variantDetails",
            title: "Variant Details",
            description: "Optional product variant details like size and color (e.g., Size: M, Color: Red).",
            type: "object",
            fields: [
                defineField({
                    name: "size",
                    title: "Size",
                    type: "string",
                }),
                defineField({
                    name: "color",
                    title: "Color",
                    type: "string",
                }),
            ],
        }),

        defineField({
            name: "authorName",
            title: "Reviewer Name",
            description: "The name shown for this review (e.g., 'John Doe').",
            type: "string",
            validation: (Rule) => Rule.required().min(2).max(60),
        }),

        defineField({
            name: "verifiedBuyer",
            title: "Verified Buyer",
            description: "Check this if the reviewer purchased the product.",
            type: "boolean",
            initialValue: false,
        }),
        defineField({
            name: "clerkUserId",
            title: "Clerk User ID",
            type: "string",
            description: "The Clerk user ID of the reviewer (enforces unique review per product).",
            readOnly: true,
        }),
        defineField({
            name: "date",
            title: "Review Date",
            description: "The date when this review was submitted.",
            type: "datetime",
            initialValue: () => new Date().toISOString(),
        }),

        defineField({
            name: "helpfulCount",
            title: "Helpful Votes",
            description: "Number of times customers marked this review as helpful.",
            type: "number",
            initialValue: 0,
            validation: (Rule) => Rule.min(0),
        }),
        defineField({
            name: "helpfulUsers",
            title: "Helpful Voters",
            description: "IDs of users who marked this review as helpful (prevents duplicate votes).",
            type: "array",
            of: [{ type: "string" }],
            hidden: true,
        }),
    ],

    preview: {
        select: {
            title: "title",
            subtitle: "authorName",
            rating: "rating",
            product: "product.name",
        },
        prepare({ title, subtitle, rating, product }) {
            return {
                title: `${title} (${rating}★)`,
                subtitle: `${subtitle} - ${product || "No product"}`,
            };
        },
    },
});
