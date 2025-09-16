import { defineType, defineField } from "sanity";
import { Truck } from "lucide-react";

export const shippingRuleType = defineType({
    name: "shippingRule",
    title: "Shipping Rule",
    type: "document",
    icon: Truck,
    fields: [
        defineField({
            name: "name",
            title: "Rule Name",
            description: "Internal name for this rule (e.g., 'US Standard Shipping').",
            type: "string",
            validation: (Rule) => Rule.required().min(3).max(100),
        }),
        defineField({
            name: "region",
            title: "Region / Country",
            description: "Region or country this rule applies to (e.g., US, EU, Worldwide).",
            type: "string",
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: "shippingCost",
            title: "Shipping Cost",
            description: "Base shipping cost in USD (applied if free shipping threshold is not met).",
            type: "number",
            validation: (Rule) =>
                Rule.min(0).precision(2).error("Shipping cost must be 0 or greater."),
        }),
        defineField({
            name: "freeOver",
            title: "Free Shipping Over",
            description: "Cart subtotal threshold for free shipping. Leave empty if not applicable.",
            type: "number",
            validation: (Rule) => Rule.min(0),
        }),
        defineField({
            name: "deliveryTime",
            title: "Estimated Delivery Time",
            description: "Shown to customers (e.g., '3–5 business days').",
            type: "string",
            validation: (Rule) => Rule.required().min(2).max(50),
        }),
        defineField({
            name: "minOrderValue",
            title: "Minimum Order Value",
            description: "Optional minimum subtotal required before this shipping option appears.",
            type: "number",
            validation: (Rule) => Rule.min(0),
        }),
        defineField({
            name: "maxOrderWeight",
            title: "Maximum Order Weight",
            description: "Optional weight limit for this shipping method (use product weight field).",
            type: "number",
            validation: (Rule) => Rule.min(0),
        }),
        defineField({
            name: "active",
            title: "Active",
            description: "Uncheck to disable this rule without deleting it.",
            type: "boolean",
            initialValue: true,
        }),
    ],
    preview: {
        select: {
            title: "name",
            subtitle: "region",
            active: "active",
        },
        prepare({ title, subtitle, active }) {
            return {
                title: title || "Untitled Rule",
                subtitle: active ? subtitle : `${subtitle} (inactive)`,
            };
        },
    },
});
