import { TrolleyIcon } from '@sanity/icons'
import { defineField, defineType } from 'sanity'
import DiscountedPriceInput from '../lib/DiscountInput'

export const productType = defineType({
  name: 'product',
  title: 'Product',
  type: 'document',
  icon: TrolleyIcon,
  fields: [
    defineField({
      name: 'name',
      title: 'Product Name',
      description: 'The public-facing name of the product.',
      type: 'string',
      validation: (Rule) => Rule.required().min(2).max(120),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      description: 'URL-friendly identifier. Auto-generated from the product name.',
      type: 'slug',
      options: {
        source: 'name',
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      description: 'Detailed product description for customers.',
      type: 'text',
      rows: 4,
      validation: (Rule) => Rule.min(0).max(2000),
    }),
    defineField({
      name: 'intro',
      title: 'Intro',
      description: 'Short blurb shown in listings and previews.',
      type: 'text',
      rows: 2,
      validation: (Rule) => Rule.min(0).max(250),
    }),
    defineField({
      name: 'images',
      title: 'Product Images',
      description: 'Primary gallery for the product. The first image is used as the main image.',
      type: 'array',
      of: [
        {
          type: 'image',
          options: { hotspot: true },
          fields: [
            defineField({
              name: 'alt',
              title: 'Alt Text',
              type: 'string',
              description: 'Short description for accessibility and SEO.',
              validation: (Rule) => Rule.max(150),
            }),
          ],
        },
      ],
      validation: (Rule) => Rule.min(1).warning('Consider adding at least one image.'),
    }),
    defineField({
      name: 'price',
      title: 'Base Price',
      description: 'Default price before variant overrides and discounts. Must be greater than 0.',
      type: 'number',
      validation: (Rule) => Rule.required().positive().precision(2),
    }),
    defineField({
      name: 'discount',
      title: 'Discount (%)',
      description: 'Percentage discount applied to the base price (0-100).',
      type: 'number',
      initialValue: 0,
      validation: (Rule) => Rule.min(0).max(100),
    }),
    defineField({
      name: 'discountedPrice',
      title: 'Discounted Price',
      description: 'Calculated price after applying discount (read-only).',
      type: 'number',
      readOnly: true,
      components: { input: DiscountedPriceInput },
    }),
    defineField({
      name: 'categories',
      title: 'Categories',
      description: 'Assign one or more categories for filtering and navigation.',
      type: 'array',
      of: [
        {
          type: 'reference',
          to: { type: 'category' },
        },
      ],
      validation: (Rule) => Rule.unique(),
    }),
    defineField({
      name: 'material',
      title: 'Material',
      description: 'Main material or fabric used in this product.',
      type: 'reference',
      to: [{ type: 'material' }],
    }),

    // Variants
    defineField({
      name: 'variants',
      title: 'Variants',
      description:
        'Each variant represents a unique combination of size and color. SKU and stock belong to variants.',
      type: 'array',
      hidden: ({ document }) => Boolean(document?.sku) || Boolean(document?.stock),
      of: [
        defineField({
          name: 'variant',
          type: 'object',
          title: 'Variant',
          fields: [
            defineField({
              name: 'size',
              title: 'Size',
              description: 'Standard apparel size for this variant.',
              type: 'string',
              options: {
                list: [
                  { title: 'XS', value: 'XS' },
                  { title: 'S', value: 'S' },
                  { title: 'M', value: 'M' },
                  { title: 'L', value: 'L' },
                  { title: 'XL', value: 'XL' },
                  { title: 'XXL', value: 'XXL' },
                ],
                layout: 'dropdown',
              },
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'color',
              title: 'Color',
              type: 'reference',
              to: [{ type: 'color' }],
              validation: (Rule) => Rule.required()
            }),
            defineField({
              name: 'sku',
              title: 'SKU',
              description: 'Stock keeping unit for this specific size/color combination.',
              type: 'string',
              validation: (Rule) =>
                Rule.required().min(2).max(64).custom(async (sku, context) => {
                  if (!sku) return true

                  const { getClient } = context
                  const client = getClient({ apiVersion: '2025-07-30' })

                  const docId = context.document?._id || ''
                  const publishedId = docId.replace(/^drafts\./, '')
                  const draftId = `drafts.${publishedId}`

                  const existing = await client.fetch(
                    `*[_type == "product" && !(_id in [$draftId, $publishedId]) && (
                      sku == $sku || $sku in variants[].sku
                    )][0]`,
                    { sku, draftId, publishedId }
                  )

                  if (existing) return 'SKU must be unique across all products and variants'
                  return true
                }),
            }),
            defineField({
              name: 'stock',
              title: 'Stock Count',
              description: 'Available inventory for this variant. Must be 0 or greater.',
              type: 'number',
              validation: (Rule) => Rule.required().min(0),
            }),
            defineField({
              name: 'priceOverride',
              title: 'Price Override',
              description: 'Optional variant-specific price. Leave empty to use the base price.',
              type: 'number',
              validation: (Rule) => Rule.min(0).precision(2),
            }),
            defineField({
              name: 'images',
              title: 'Variant Images',
              description: 'Optional images specific to this variant (e.g., color swatches or try-on).',
              type: 'array',
              of: [
                {
                  type: 'image',
                  options: { hotspot: true },
                  fields: [
                    defineField({
                      name: 'alt',
                      title: 'Alt Text',
                      type: 'string',
                      description: 'Short description for accessibility and SEO.',
                      validation: (Rule) => Rule.max(150),
                    }),
                  ],
                },
              ],
            }),
          ],
          preview: {
            select: {
              size: 'size',
              color: 'color.name',
              sku: 'sku',
              stock: 'stock',
              media: 'images',
            },
            prepare({ size, color, sku, stock, media }) {
              const image = media && media[0]
              return {
                title: `${size || ''} ${color ? `— ${color}` : ''}`.trim(),
                subtitle: `${sku} | Stock: ${stock || 0}`,
                media: image,
              }
            },
          },
        }),
      ],
      validation: (Rule) =>
        Rule.custom((variants, context) => {
          const hasSkuStock = context.document?.sku && context.document?.stock !== undefined

          // If no variants and no SKU+Stock
          if ((!variants || variants.length === 0) && !hasSkuStock) {
            return 'Add at least one variant or provide SKU and Stock'
          }

          // If variants exist, check uniqueness rules
          if (Array.isArray(variants) && variants.length > 0) {
            // Check SKU uniqueness
            const skus = variants
              .map((v) => v?.sku)
              .filter(Boolean)
              .map((s) => s.trim().toLowerCase())

            if (new Set(skus).size !== skus.length) {
              return 'Variant SKUs must be unique'
            }

            // Check size+color uniqueness
            const combos = new Set()
            for (let v of variants) {
              if (!v?.size || !v?.color?._ref) continue
              const key = `${v.size}-${v.color._ref}`
              if (combos.has(key)) {
                return `Duplicate variant found: Size "${v.size}" with the same color`
              }
              combos.add(key)
            }
          }

          return true
        }),
    }),
    defineField({
      name: 'sku',
      title: 'SKU',
      description: 'Stock keeping unit for this specific product.',
      type: 'string',
      hidden: ({ document }) => Array.isArray(document?.variants) && document.variants.length > 0,
      validation: (Rule) =>
        Rule.custom(async (sku, context) => {
          const hasVariants = Array.isArray(context.document?.variants) && context.document.variants.length > 0
          if (!sku && !hasVariants) return 'SKU is required when there are no variants'
          if (!sku) return true

          const { getClient } = context
          const client = getClient({ apiVersion: '2025-07-30' })

          const docId = context.document?._id || ''
          const publishedId = docId.replace(/^drafts\./, '')
          const draftId = `drafts.${publishedId}`

          const existing = await client.fetch(
            `*[_type == "product" && !(_id in [$draftId, $publishedId]) && (
              sku == $sku || $sku in variants[].sku
            )][0]`,
            { sku, draftId, publishedId }
          )

          if (existing) return 'SKU must be unique across all products and variants'
          return true
        }),
    }),
    defineField({
      name: 'stock',
      title: 'Stock',
      description: 'Available inventory for this product. Must be 0 or greater.',
      type: 'number',
      hidden: ({ document }) => Array.isArray(document?.variants) && document.variants.length > 0,
      validation: (Rule) => Rule.custom((stock, context) => {
        if ((stock === undefined || stock === null) && (!context.document?.variants || context.document.variants.length === 0)) {
          return 'Stock is required when there are no variants'
        }
        return true
      }),
    }),
    // Tags for filtering and search
    defineField({
      name: 'tags',
      title: 'Tags',
      description: 'Free-form tags used for filtering and search.',
      type: 'array',
      of: [{ type: 'string' }],
      validation: (Rule) => Rule.unique(),
    }),

    // Shipping attributes
    defineField({
      name: 'weight',
      title: 'Weight',
      description: 'Product weight for shipping calculations.',
      type: 'object',
      options: { collapsible: true, collapsed: true },
      fields: [
        defineField({
          name: 'value',
          title: 'Weight Value',
          type: 'number',
          validation: (Rule) => Rule.min(0),
        }),
        defineField({
          name: 'unit',
          title: 'Weight Unit',
          type: 'string',
          options: {
            list: [
              { title: 'kg', value: 'kg' },
              { title: 'g', value: 'g' },
              { title: 'lb', value: 'lb' },
              { title: 'oz', value: 'oz' },
            ],
            layout: 'dropdown',
          },
        }),
      ],
    }),
    defineField({
      name: 'dimensions',
      title: 'Dimensions',
      description: 'Product dimensions for shipping calculations.',
      type: 'object',
      options: { collapsible: true, collapsed: true },
      fields: [
        defineField({
          name: 'length',
          title: 'Length',
          type: 'number',
          validation: (Rule) => Rule.min(0)
        }),
        defineField({
          name: 'width',
          title: 'Width',
          type: 'number',
          validation: (Rule) => Rule.min(0)
        }),
        defineField({
          name: 'height',
          title: 'Height',
          type: 'number',
          validation: (Rule) => Rule.min(0)
        }),
        defineField({
          name: 'unit',
          title: 'Dimension Unit',
          type: 'string',
          options: {
            list: [
              { title: 'cm', value: 'cm' },
              { title: 'mm', value: 'mm' },
              { title: 'inches', value: 'in' },
            ],
            layout: 'dropdown',
          },
        }),
      ],
    }),
  ],
  preview: {
    select: {
      title: 'name',
      basePrice: 'price',
      media: 'images',
    },
    prepare(selection) {
      const { title, basePrice, media } = selection
      const image = media && media[0]
      return {
        title: title || 'Untitled Product',
        subtitle: typeof basePrice === 'number' ? `$${basePrice.toFixed(2)}` : undefined,
        media: image,
      }
    }
  }
})
