import { TrolleyIcon } from '@sanity/icons'
import { defineField, defineType } from 'sanity'
import React from 'react'
import DiscountedPriceInput from '../lib/DiscountInput'

export const productType = defineType({
  name: 'product',
  title: 'Product',
  type: 'document',
  icon: TrolleyIcon,
  fields: [
    defineField({
      name: 'name',
      title: "Product Name",
      type: 'string',
      validation: (Rule) => Rule.required()
    }),
    defineField({
      name: 'slug',
      type: 'slug',
      options: {
        source: 'name',
        maxLength: 96
      },
      validation: (Rule) => Rule.required()
    }),
    defineField({
      name: 'description',
      type: 'text',
    }),
    defineField({
      name: 'intro',
      type: 'text',
    }),
    defineField({
      name: "images",
      title: "Product Images",
      type: "array",
      of: [{
        type: "image", options: {
          hotspot: true
        }
      }]
    }),
    defineField({
      name: 'price',
      title: 'Product Price',
      type: 'number',
      validation: (Rule) => Rule.required()
    }),
    defineField({
      name: 'discount',
      title: 'Discount Percentage',
      type: 'number',
      validation: (Rule) => Rule.required()
    }),
    defineField({
      name: 'discountedPrice',
      title: 'Discounted Price',
      type: 'number',
      description: 'Calculated price after applying discount (Automated)',
      components: { input: DiscountedPriceInput }
    }),
    defineField({
      name: "categories",
      title: "Categories",
      type: "array",
      of: [{
        type: "reference", to: {
          type: "category"
        }
      }]
    }),
    defineField({
      name: 'stock',
      type: 'number',
      validation: (Rule) => Rule.min(0)
    }),
    defineField({
      name: "status",
      title: "Product Status",
      type: "string",
      options: {
        list: [{ title: "New", value: "new" }, { title: "Hot", value: "hot" }, { title: "Sale", value: "sale" },]
      }
    }),
    defineField({
      name: "variant",
      title: "Product Type",
      type: "string",
      options: {
        list: [{ title: "Tshirt", value: "tshirt" }, { title: "Jacket", value: "jacket" }, { title: "Pants", value: "pants" }, { title: "Hoodie", value: "hoodie" }, { title: "Short", value: "short" }, { title: "Others", value: "others" },]
      }
    })
  ],
  preview: {
    select: {
      title: "name",
      subtitle: "price",
      media: "images"
    },
    prepare(selection) {
      const { title, subtitle, media } = selection
      const image = media && media[0]
      return {
        title: title,
        subtitle: `$${subtitle}`,
        media: image
      }
    }
  }
})
