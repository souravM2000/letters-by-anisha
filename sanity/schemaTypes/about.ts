import { defineType, defineField, defineArrayMember } from 'sanity'
import { UserIcon } from '@sanity/icons'

export const about = defineType({
  name: 'about',
  title: 'About',
  type: 'document',
  icon: UserIcon,
  fields: [
    defineField({
      name: 'intro',
      title: 'Introduction',
      type: 'array',
      of: [defineArrayMember({ type: 'block' })],
    }),
    defineField({
      name: 'education',
      title: 'Education',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'educationItem',
          title: 'Education Item',
          fields: [
            defineField({
              name: 'institution',
              title: 'Institution',
              type: 'string',
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'degree',
              title: 'Degree / Programme',
              type: 'string',
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'year',
              title: 'Year / Duration',
              type: 'string',
              description: 'e.g. "2022–2024" or "2024"',
            }),
            defineField({
              name: 'scoreLabel',
              title: 'Score',
              type: 'string',
              description: 'e.g. "CGPA 7.331" or "85.6%"',
            }),
          ],
          preview: {
            select: { title: 'degree', subtitle: 'institution' },
          },
        }),
      ],
    }),
    defineField({
      name: 'skills',
      title: 'Skills',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'skillCategory',
          title: 'Skill Category',
          fields: [
            defineField({
              name: 'category',
              title: 'Category',
              type: 'string',
              options: {
                list: [
                  { title: 'Writing', value: 'Writing' },
                  { title: 'Research', value: 'Research' },
                  { title: 'Digital', value: 'Digital' },
                  { title: 'Communication', value: 'Communication' },
                ],
              },
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'items',
              title: 'Skills',
              type: 'array',
              of: [defineArrayMember({ type: 'string' })],
              description: 'Individual skills within this category',
            }),
          ],
          preview: {
            select: { title: 'category' },
          },
        }),
      ],
    }),
  ],
  preview: {
    prepare() {
      return { title: 'About Page' }
    },
  },
})
