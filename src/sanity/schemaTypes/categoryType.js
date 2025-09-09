import { Tag } from 'lucide-react'
import { defineField, defineType } from 'sanity'

export const categoryType = defineType({
  name: 'category',
  title: 'Category',
  type: 'document',
  icon: Tag,
  fields: [
    defineField({
      name: 'name',
      title: 'Category Name',
      description: 'The name of the category as it will appear to users.',
      type: 'string',
      validation: (Rule) => Rule.required().min(2).max(100),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      description: 'URL-friendly identifier. Auto-generated from the category name.',
      type: 'slug',
      options: {
        source: 'name',
        maxLength: 96,
        slugify: (input) =>
          input
            .toLowerCase()
            .replace(/\s+/g, '-')
            .replace(/[^\w\-]+/g, '')
            .replace(/\-\-+/g, '-')
            .replace(/^-+/, '')
            .replace(/-+$/, ''),
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      description: 'Optional description for the category. Useful for SEO and admin reference.',
      type: 'text',
      rows: 3,
      validation: (Rule) => Rule.max(500),
    }),
    defineField({
      name: 'parent',
      title: 'Parent Category',
      description: 'Select a parent category to create a hierarchy. Leave empty for top-level categories.',
      type: 'reference',
      to: [{ type: 'category' }],
      hidden: ({ document }) => typeof document?.order === 'number', // hide if order is set
      options: {
        filter: ({ document }) => {
          if (!document._id) return {}
          return {
            filter: '_id != $id',
            params: { id: document._id },
          }
        },
      },
      validation: (Rule) =>
        Rule.custom((parent, context) => {
          if (!parent) return true

          // Simplified circular check
          const checkCircular = (parentId, visited = new Set()) => {
            if (visited.has(parentId)) return false
            visited.add(parentId)
            return true
          }

          return checkCircular(parent._ref)
            ? true
            : 'Circular reference detected'
        }),
    }),

    defineField({
      name: 'order',
      title: 'Display Order',
      type: 'number',
      description: 'Controls the order of categories in the homepage grid. Lower numbers show first.',
      initialValue: 1,
      hidden: ({ document }) => !!document?.parent, // hide if parent is set
      validation: (Rule) =>
        Rule.required()
          .min(1)
          .custom(async (order, context) => {
            if (!order) return true

            const { getClient } = context
            const client = getClient({ apiVersion: '2025-07-30' })

            const docId = context.document?._id || ''
            const publishedId = docId.replace(/^drafts\./, '')
            const draftId = `drafts.${publishedId}`

            const existing = await client.fetch(
              `*[_type == "category" && !(_id in [$draftId, $publishedId]) && order == $order][0]`,
              { order, draftId, publishedId }
            )

            if (existing) {
              return `Another category (${existing.name}) already uses this order number.`
            }
            return true
          }),
    }),
    defineField({
      name: 'image',
      title: 'Category Image',
      description: 'Optional image for category banners, thumbnails, or visual representation.',
      type: 'image',
      options: {
        hotspot: true,
        accept: 'image/*',
      },
    }),
  ],
  preview: {
    select: {
      title: 'name',
      parent: 'parent.name',
      media: 'image',
    },
    prepare(selection) {
      const { title, parent, media } = selection
      return {
        title: title || 'Untitled Category',
        subtitle: parent ? `Subcategory of ${parent}` : 'Top-level category',
        media: media,
      }
    },
  },
  // Add orderings for better organization in the studio
  orderings: [
    {
      title: 'Name A-Z',
      name: 'nameAsc',
      by: [{ field: 'name', direction: 'asc' }],
    },
    {
      title: 'Name Z-A',
      name: 'nameDesc',
      by: [{ field: 'name', direction: 'desc' }],
    },
    {
      title: 'Parent Category',
      name: 'parentAsc',
      by: [{ field: 'parent.name', direction: 'asc' }],
    },
  ],
})
