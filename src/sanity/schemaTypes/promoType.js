import { Megaphone } from "lucide-react";
import { defineField, defineType } from "sanity";

export const promoType = defineType({
  name: "promo",
  title: "Promo",
  type: "document",
  icon: Megaphone,
  fields: [
    // Internal title (not shown on frontend)
    defineField({
      name: "internalTitle",
      title: "Internal Title",
      description:
        "For admin use only. Helps identify this promo in the studio.",
      type: "string",
      validation: (Rule) => Rule.required().max(120),
    }),

    // Headline shown on site
    defineField({
      name: "title",
      title: "Promo Title",
      description:
        'Short headline for the promotion (e.g. "Back-to-School Sale").',
      type: "string",
      validation: (Rule) => Rule.required().max(60),
    }),

    // Supporting text
    defineField({
      name: "subtitle",
      title: "Subtitle",
      description: "Optional supporting line under the title.",
      type: "string",
      validation: (Rule) => Rule.required().max(120),
    }),

    // Banner image
    defineField({
      name: "image",
      title: "Banner Image",
      description: "Required image or graphic for the promo.",
      type: "image",
      options: { hotspot: true },
      fields: [
        defineField({
          name: "alt",
          title: "Alt Text",
          type: "string",
          validation: (Rule) => Rule.required().max(150),
        }),
      ],
      validation: (Rule) => Rule.required().error("Promo image is required"),
    }),

    // CTA Button
    defineField({
      name: "ctaText",
      title: "CTA Text",
      description: 'Call-to-action button text (e.g. "Shop the Sale").',
      type: "string",
      initialValue: "Shop Now",
      validation: (Rule) => Rule.required().max(40),
    }),
    defineField({
      name: "ctaLink",
      title: "CTA Link",
      description:
        "Where should the button link? Can be a relative path (/shop) or a full URL.",
      type: "string",
      validation: (Rule) =>
        Rule.required().custom((link) => {
          if (!link) return "CTA link is required";
          const isRelative = link.startsWith("/");
          const isAbsolute = /^https?:\/\//.test(link);
          return isRelative || isAbsolute
            ? true
            : 'Must start with "/" for internal links or "http(s)://" for external links';
        }),
    }),

    // Priority
    defineField({
      name: "priority",
      title: "Priority",
      description: "Lowest number shows first. Example: 1 = highest priority.",
      type: "number",
      initialValue: 1,
      validation: (Rule) => Rule.required().min(1).max(10),
    }),

    // Scheduling
    defineField({
      name: "startDate",
      title: "Start Date",
      type: "datetime",
      description: "Optional. If not set, promo starts immediately.",
      validation: (Rule) =>
        Rule.custom((date) => {
          if (!date) return true; // allow empty (immediate start)
          const now = new Date();
          if (new Date(date) < now) return "Start date cannot be in the past";
          return true;
        }),
    }),
    defineField({
      name: "endDate",
      title: "End Date",
      type: "datetime",
      description: "When should this promo stop appearing?",
      validation: (Rule) =>
        Rule.custom((endDate, context) => {
          if (!endDate) return true; // Optional
          const startDate = context.document?.startDate;
          if (startDate && new Date(endDate) <= new Date(startDate)) {
            return "End date must be after start date";
          }
          return true;
        }),
    }),

    // Visibility toggle
    defineField({
      name: "isActive",
      title: "Active",
      description: "Quick toggle to enable/disable the promo.",
      type: "boolean",
      initialValue: true,
    }),
  ],

  preview: {
    select: {
      title: "internalTitle",
      subtitle: "title",
      media: "image",
      isActive: "isActive",
    },
    prepare({ title, subtitle, media, isActive }) {
      return {
        title: title || "Untitled Promo",
        subtitle: `${isActive ? "🟢 Active" : "🔴 Inactive"} - ${subtitle || ""}`,
        media,
      };
    },
  },
});
