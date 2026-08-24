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
      name: 'introFont',
      title: 'Intro Text Font',
      type: 'string',
      description: 'Choose the font used to render the introduction paragraph on the site.',
      options: {
        list: [
          { title: 'Sans-serif — Plus Jakarta Sans', value: 'sans' },
          { title: 'Serif — Playfair Display', value: 'serif' },
          { title: 'Handwritten — Caveat', value: 'handwritten' },
          { title: 'Cormorant Garamond (elegant serif)', value: 'cormorant' },
          { title: 'Lora (literary serif)', value: 'lora' },
          { title: 'DM Serif Display (editorial)', value: 'dm-serif' },
          { title: 'Montserrat (modern sans)', value: 'montserrat' },
          { title: 'EB Garamond (classic serif)', value: 'eb-garamond' },
        ],
        layout: 'radio',
      },
      initialValue: 'sans',
    }),
    defineField({
      name: 'introFontSize',
      title: 'Intro Text Size',
      type: 'string',
      description: 'Controls how large the intro paragraph text appears.',
      options: {
        list: [
          { title: 'XS — Extra Small', value: 'xs' },
          { title: 'SM — Small', value: 'sm' },
          { title: 'Base — Normal (default)', value: 'base' },
          { title: 'LG — Large', value: 'lg' },
          { title: 'XL — Extra Large', value: 'xl' },
          { title: '2XL — Double Extra Large', value: '2xl' },
        ],
        layout: 'radio',
      },
      initialValue: 'base',
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
