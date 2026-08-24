import { defineType, defineField, defineArrayMember } from 'sanity'
import { StarIcon } from '@sanity/icons'

export const brandCollab = defineType({
  name: 'brandCollab',
  title: 'Brand Collaborations',
  type: 'document',
  icon: StarIcon,
  orderings: [
    {
      title: 'Date, Newest First',
      name: 'dateDesc',
      by: [{ field: 'date', direction: 'desc' }],
    },
  ],
  fields: [
    defineField({
      name: 'brandName',
      title: 'Brand Name',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'brandLogo',
      title: 'Brand Logo',
      type: 'image',
      options: { hotspot: true },
    }),
    defineField({
      name: 'collabType',
      title: 'Collaboration Type',
      type: 'string',
      options: {
        list: [
          { title: 'Sponsored Post', value: 'Sponsored Post' },
          { title: 'Reel', value: 'Reel' },
          { title: 'Blog Feature', value: 'Blog Feature' },
          { title: 'Long-term Partnership', value: 'Long-term Partnership' },
        ],
      },
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'array',
      of: [defineArrayMember({ type: 'block' })],
    }),
    defineField({
      name: 'testimonialQuote',
      title: 'Testimonial Quote',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'testimonialAuthor',
      title: 'Testimonial Author',
      type: 'string',
    }),
    defineField({
      name: 'resultsOrMetrics',
      title: 'Results / Metrics',
      type: 'string',
      description: 'e.g. "45K reach, 8.2% engagement rate"',
    }),
    defineField({
      name: 'projectUrl',
      title: 'Project / Campaign URL',
      type: 'url',
    }),
    defineField({
      name: 'date',
      title: 'Collaboration Date',
      type: 'date',
    }),
  ],
  preview: {
    select: {
      title: 'brandName',
      subtitle: 'collabType',
      media: 'brandLogo',
    },
  },
})
