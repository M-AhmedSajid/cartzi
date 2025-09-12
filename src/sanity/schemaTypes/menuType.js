import { defineType, defineField } from "sanity";
import { Menu } from "lucide-react";

export const menuType = defineType({
    name: "menu",
    title: "Menu",
    type: "document",
    icon: Menu,
    fields: [
        defineField({
            name: "title",
            title: "Menu Title",
            type: "string",
            description:
                "For Header/Mobile menus: used only internally in Sanity. For Footer menus: this will be shown as the section heading above the links.",
            validation: (Rule) =>
                Rule.required()
                    .min(3)
                    .max(50)
                    .error("Menu title must be between 3 and 50 characters."),
        }),
        defineField({
            name: "location",
            title: "Menu Location",
            type: "string",
            description: "Choose where this menu should appear on the site.",
            options: {
                list: [
                    { title: "Header (Main Navigation)", value: "header" },
                    { title: "Footer - Group 1", value: "footer-1" },
                    { title: "Footer - Group 2", value: "footer-2" },
                    { title: "Mobile Sidebar", value: "mobile-sidebar" },
                ],
                layout: "radio",
            },
            validation: (Rule) =>
                Rule.required().error("You must select a location for this menu."),
        }),
        defineField({
            name: "items",
            title: "Menu Items",
            type: "array",
            description:
                "Top-level items for this menu. Drag to reorder. Each item can link to a category or a static page.",
            of: [
                defineType({
                    name: "menuEntry",
                    title: "Menu Entry",
                    type: "object",
                    fields: [
                        defineField({
                            name: "title",
                            title: "Custom Label",
                            type: "string",
                            description:
                                "Optional. If left empty, the category name or page title will be used.",
                            validation: (Rule) => Rule.min(2).max(50),
                        }),
                        defineField({
                            name: "linkType",
                            title: "Link Type",
                            type: "string",
                            description: "Choose whether this entry links to a category or a static page.",
                            options: {
                                list: [
                                    { title: "Category", value: "category" },
                                    { title: "Page", value: "page" },
                                ],
                                layout: "radio",
                            },
                            validation: (Rule) => Rule.required(),
                        }),
                        defineField({
                            name: "category",
                            title: "Category",
                            type: "reference",
                            to: [{ type: "category" }],
                            hidden: ({ parent }) => parent?.linkType !== "category",
                            validation: (Rule) =>
                                Rule.custom((field, context) => {
                                    if (context.parent?.linkType === "category" && !field) {
                                        return "Category is required when Link Type is Category.";
                                    }
                                    return true;
                                }),
                        }),
                        defineField({
                            name: "page",
                            title: "Page",
                            type: "string",
                            description: "Select one of the predefined static pages.",
                            options: {
                                list: [
                                    { title: "Home", value: "/" },
                                    { title: "About Us", value: "/about" },
                                    { title: "Contact Us", value: "/contact" },
                                    { title: "Terms & Conditions", value: "/terms-and-conditions" },
                                    { title: "Privacy Policy", value: "/privacy-policy" },
                                    { title: "Shipping & Returns", value: "/shipping-returns" },
                                    { title: "FAQs", value: "/faqs" },
                                ],
                                layout: "dropdown",
                            },
                            hidden: ({ parent }) => parent?.linkType !== "page",
                            validation: (Rule) =>
                                Rule.custom((field, context) => {
                                    if (context.parent?.linkType === "page" && !field) {
                                        return "Page is required when Link Type is Page.";
                                    }
                                    return true;
                                }),
                        }),
                    ],
                    preview: {
                        select: {
                            title: "title",
                            linkType: "linkType",
                            category: "category.name",
                            page: "page",
                        },
                        prepare({ title, linkType, category, page }) {
                            const label = title || category || page || "Untitled";
                            return {
                                title: label,
                                subtitle: linkType === "category" ? "Category Link" : "Page Link",
                            };
                        },
                    },
                }),
            ],
            validation: (Rule) =>
                Rule.required()
                    .min(1)
                    .max(7)
                    .error("Menu must have between 1 and 7 items."),
        }),
    ],
    preview: {
        select: {
            title: "title",
            location: "location",
            items: "items"
        },
        prepare({ title, location, items }) {
            return {
                title,
                subtitle: `${location || "Unassigned"} • ${items ? items.length : 0} items`,
            };
        },
    }
});
