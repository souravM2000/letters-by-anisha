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
            }),
            defineField({
              name: 'degree',
              title: 'Degree / Programme',
              type: 'string',
            }),
            defineField({
              name: 'year',
              title: 'Duration / Period',
              type: 'string',
              description: 'Display label, e.g. "2022–2024" or "Class of 2024"',
            }),
            defineField({
              name: 'passingYear',
              title: 'Passing Year',
              type: 'number',
              description: 'The year you graduated / passed out. Used for sorting.',
              options: {
                list: Array.from({ length: 31 }, (_, i) => {
                  const y = 2000 + i;
                  return { title: String(y), value: y };
                }),
              },
            }),
            defineField({
              name: 'scoreLabel',
              title: 'Score',
              type: 'string',
              description: 'e.g. "CGPA 7.331" or "85.6%"',
            }),
          ],
          preview: {
            select: { title: 'degree', subtitle: 'institution', passingYear: 'passingYear' },
            prepare({ title, subtitle, passingYear }: { title?: string; subtitle?: string; passingYear?: number }) {
              return {
                title,
                subtitle: [subtitle, passingYear].filter(Boolean).join(' · '),
              };
            },
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
