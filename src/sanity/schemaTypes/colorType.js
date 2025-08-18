// /schemas/colorType.js
import { ColorWheelIcon } from '@sanity/icons'
import { defineType, defineField } from 'sanity'

export const colorType = defineType({
    name: 'color',
    title: 'Color',
    type: 'document',
    icon: ColorWheelIcon,
    fields: [
        defineField({
            name: 'name',
            title: 'Color Name',
            type: 'string',
            validation: (Rule) => Rule.required().min(2).max(50)
        }),
        defineField({
            name: 'hex',
            title: 'Hex Code',
            type: 'string',
            validation: (Rule) =>
                Rule.required().regex(/^#([0-9A-Fa-f]{6})$/, {
                    name: 'hex color',
                    invert: false
                })
        })
    ],
    preview: {
        select: {
            title: 'name',
            hex: 'hex'
        },
        prepare({ title, hex }) {
            return {
                title: title,
                subtitle: hex,
                media: <div style={{ backgroundColor: hex || '#ccc', width: '100%', height: '100%', border: '1px solid #555c75' }} />
            }
        }
    }
})