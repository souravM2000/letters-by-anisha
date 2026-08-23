import { defineType, defineField } from 'sanity'
import { EditIcon } from '@sanity/icons'

export const writingPiece = defineType({
  name: 'writingPiece',
  title: 'Writing Pieces',
  type: 'document',
  icon: EditIcon,
  orderings: [
    {
      title: 'Published Date, Newest First',
      name: 'publishedDateDesc',
      by: [{ field: 'publishedDate', direction: 'desc' }],
    },
    {
      title: 'Published Date, Oldest First',
      name: 'publishedDateAsc',
      by: [{ field: 'publishedDate', direction: 'asc' }],
    },
  ],
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'string',
      options: {
        list: [
          { title: 'Book Review', value: 'Book Review' },
          { title: 'Essay', value: 'Essay' },
          { title: 'Short Story', value: 'Short Story' },
          { title: 'Opinion', value: 'Opinion' },
        ],
        layout: 'radio',
      },
    }),
    defineField({
      name: 'externalUrl',
      title: 'WordPress Post URL',
      type: 'url',
      validation: (Rule) =>
        Rule.uri({ scheme: ['http', 'https'] }),
      description: 'Full URL to the WordPress blog post',
    }),
    defineField({
      name: 'excerpt',
      title: 'Excerpt',
      type: 'text',
      rows: 4,
      validation: (Rule) =>
        Rule.max(300).warning('Excerpt is recommended to be 300 characters or fewer'),
    }),
    defineField({
      name: 'coverImage',
      title: 'Cover Image',
      type: 'image',
      options: { hotspot: true },
    }),
    defineField({
      name: 'publishedDate',
      title: 'Published Date',
      type: 'datetime',
    }),
    defineField({
      name: 'featured',
      title: 'Featured',
      type: 'boolean',
      initialValue: false,
      description: 'Pin this piece to featured writing sections',
    }),
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'category',
      media: 'coverImage',
    },
  },
})
