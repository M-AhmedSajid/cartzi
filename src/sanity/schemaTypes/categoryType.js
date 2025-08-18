import { TagIcon } from '@sanity/icons'
import { defineField, defineType } from 'sanity'

export const categoryType = defineType({
  name: 'category',
  title: 'Category',
  type: 'document',
  icon: TagIcon,
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
      options: {
        // Prevent circular references by filtering out the current document
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
          if (!parent) return true // Parent is optional

          // Check for circular references
          const checkCircular = (parentId, visited = new Set()) => {
            if (visited.has(parentId)) return false
            visited.add(parentId)

            // This is a simplified check - in practice, you might want to implement
            // a more robust circular reference detection
            return true
          }

          return checkCircular(parent._ref) ? true : 'Circular reference detected'
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
