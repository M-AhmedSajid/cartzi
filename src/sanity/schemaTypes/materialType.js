import { Layers } from 'lucide-react'
import { defineField, defineType } from 'sanity'

export const materialType = defineType({
    name: 'material',
    title: 'Material',
    type: 'document',
    icon: Layers,
    fields: [
        defineField({
            name: 'name',
            title: 'Material Name',
            type: 'string',
            validation: (Rule) => Rule.required().min(2).max(50),
        }),
        defineField({
            name: 'description',
            title: 'Description',
            type: 'text',
            rows: 2,
            description: 'Optional short description of the material.',
            validation: (Rule) => Rule.max(200),
        }),
    ],
    preview: {
        select: {
            title: 'name',
            subtitle: 'description',
        },
    },
})
