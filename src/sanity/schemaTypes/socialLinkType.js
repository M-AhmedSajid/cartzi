import { defineField, defineType } from 'sanity'
import { Globe } from 'lucide-react'

export const socialLinkType = defineType({
  name: 'socialLink',
  title: 'Social Link',
  type: 'document',
  icon: Globe,
  fields: [
    defineField({
      name: 'platform',
      title: 'Platform',
      description: 'Choose the social media platform for this link.',
      type: 'string',
      options: {
        list: [
          { title: 'Facebook', value: 'Facebook' },
          { title: 'Instagram', value: 'Instagram' },
          { title: 'YouTube', value: 'YouTube' },
          { title: 'Twitter/X', value: 'Twitter/X' },
          { title: 'LinkedIn', value: 'LinkedIn' },
          { title: 'GitHub', value: 'GitHub' },
        ],
        layout: 'dropdown',
      },
      validation: (Rule) => Rule.required().error('A platform is required.'),
    }),
    defineField({
      name: 'url',
      title: 'Profile URL',
      description: 'Enter the full URL of your social profile (e.g. https://instagram.com/yourbrand).',
      type: 'url',
      validation: (Rule) =>
        Rule.required()
          .uri({
            scheme: ['http', 'https'],
          })
          .error('Please enter a valid URL with http or https.'),
    }),
    defineField({
      name: 'order',
      title: 'Order',
      description: 'Controls the display order of social links. Lower numbers appear first.',
      type: 'number',
      validation: (Rule) =>
        Rule.min(1)
          .max(6)
          .error('Order must be between 1 and 6.'),
    }),
  ],
  preview: {
    select: {
      title: 'platform',
      subtitle: 'url',
    },
  },
})
