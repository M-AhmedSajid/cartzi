import { TicketPercent } from "lucide-react";
import { defineType, defineField } from "sanity";

export const discountCodeType = defineType({
    name: "discountCode",
    title: "Discount Code",
    type: "document",
    icon: TicketPercent,
    fields: [
        defineField({
            name: "code",
            title: "Discount Code",
            description: "The code customers will enter at checkout (e.g., WELCOME10).",
            type: "string",
            validation: (Rule) =>
                Rule.required()
                    .min(3)
                    .max(20)
                    .regex(/^[A-Z0-9_-]+$/, {
                        name: "uppercase letters, numbers, hyphens, underscores",
                    })
                    .error("Use only A-Z, 0-9, - or _ (e.g., SAVE10)."),
        }),
        defineField({
            name: "description",
            title: "Description",
            description: "Internal note about this code's purpose (not shown to customers).",
            type: "string",
            validation: (Rule) => Rule.max(200),
        }),
        defineField({
            name: "discountType",
            title: "Discount Type",
            description: "Choose how this discount is applied.",
            type: "string",
            options: {
                list: [
                    { title: "Percentage (%)", value: "percentage" },
                    { title: "Fixed Amount ($)", value: "fixed" },
                    { title: "Free Shipping", value: "shipping" },
                ],
                layout: "radio",
            },
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: "value",
            title: "Discount Value",
            description:
                "If Percentage: enter 5-100. If Fixed: enter a dollar amount. Leave empty for Free Shipping.",
            type: "number",
            hidden: ({ parent }) => parent?.discountType === "shipping", // hide if free shipping
            validation: (Rule) =>
                Rule.custom((val, context) => {
                    const type = context.document?.discountType;
                    if (type === "percentage") {
                        if (val === undefined || val < 1 || val > 100) {
                            return "Percentage must be between 1 and 100";
                        }
                    }
                    if (type === "fixed") {
                        if (val === undefined || val <= 0) {
                            return "Fixed discount must be greater than 0";
                        }
                    }
                    return true;
                }),
        }),

        defineField({
            name: "appliesToShipping",
            title: "Applies To Shipping Rules",
            description:
                "Select which shipping methods this discount applies to. Leave empty to apply to all shipping methods.",
            type: "array",
            of: [{ type: "reference", to: [{ type: "shippingRule" }] }],
            hidden: ({ parent }) => parent?.discountType !== "shipping",
        }),

        defineField({
            name: "minCartValue",
            title: "Minimum Cart Value",
            description: "Minimum subtotal required before this code can be applied.",
            type: "number",
            validation: (Rule) => Rule.min(0),
        }),
        defineField({
            name: "maxRedemptions",
            title: "Maximum Redemptions",
            description: "Optional limit for how many times this code can be used across all customers.",
            type: "number",
            validation: (Rule) => Rule.min(1),
        }),
        defineField({
            name: "expiresAt",
            title: "Expiry Date",
            description: "Date and time when this code will no longer be valid.",
            type: "datetime",
        }),
        defineField({
            name: "active",
            title: "Active",
            description: "Uncheck to deactivate this code without deleting it.",
            type: "boolean",
            initialValue: true,
        }),
    ],
    preview: {
        select: {
            title: "code",
            subtitle: "discountType",
            active: "active",
        },
        prepare({ title, subtitle, active }) {
            return {
                title: title || "Untitled Code",
                subtitle: active ? subtitle : `${subtitle} (inactive)`,
            };
        },
    },
});
