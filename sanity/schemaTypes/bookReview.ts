import { defineType, defineField, defineArrayMember } from 'sanity'
import { BookIcon } from '@sanity/icons'

const GENRE_OPTIONS = [
  'Literary Fiction',
  'Contemporary Fiction',
  'Historical Fiction',
  'Fantasy',
  'Science Fiction',
  'Mystery & Thriller',
  'Romance',
  'Non-Fiction',
  'Memoir & Biography',
  'Poetry',
  'Short Stories',
  'Young Adult',
  'Classic Literature',
  'Graphic Novel',
  'Self-Help',
].map((g) => ({ title: g, value: g }))

export const bookReview = defineType({
  name: 'bookReview',
  title: 'Book Reviews',
  type: 'document',
  icon: BookIcon,
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
    {
      title: 'Rating, Highest First',
      name: 'ratingDesc',
      by: [{ field: 'rating', direction: 'desc' }],
    },
  ],
  fields: [
    defineField({
      name: 'bookTitle',
      title: 'Book Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'author',
      title: 'Author',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'bookTitle', maxLength: 96 },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'coverImage',
      title: 'Cover Image',
      type: 'image',
      options: { hotspot: true },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'rating',
      title: 'Rating (out of 5)',
      type: 'number',
      validation: (Rule) =>
        Rule.required()
          .min(0)
          .max(5)
          .precision(1)
          .error('Rating must be between 0 and 5 in 0.5 increments'),
      options: {
        list: [0, 0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5].map((n) => ({
          title: `${n} ⭐`,
          value: n,
        })),
      },
    }),
    defineField({
      name: 'genre',
      title: 'Genre(s)',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'string',
        }),
      ],
      options: {
        list: GENRE_OPTIONS,
      },
    }),
    defineField({
      name: 'reviewExcerpt',
      title: 'Review Excerpt',
      type: 'text',
      rows: 4,
      validation: (Rule) =>
        Rule.required().max(300).error('Excerpt must be 300 characters or fewer'),
    }),
    defineField({
      name: 'fullReview',
      title: 'Full Review',
      type: 'array',
      of: [defineArrayMember({ type: 'block' })],
    }),
    defineField({
      name: 'affiliateLink',
      title: 'Affiliate / Buy Link',
      type: 'url',
    }),
    defineField({
      name: 'associatedReelUrl',
      title: 'Associated Reel / Video URL',
      type: 'url',
    }),
    defineField({
      name: 'publishedDate',
      title: 'Published Date',
      type: 'datetime',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'featured',
      title: 'Featured',
      type: 'boolean',
      initialValue: false,
      description: 'Pin this review to featured sections',
    }),
  ],
  preview: {
    select: {
      title: 'bookTitle',
      subtitle: 'author',
      media: 'coverImage',
    },
    prepare({ title, subtitle, media }) {
      return { title, subtitle: `by ${subtitle}`, media }
    },
  },
})
