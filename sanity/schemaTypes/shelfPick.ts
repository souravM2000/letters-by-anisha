import { defineType, defineField } from 'sanity'
import { PackageIcon } from '@sanity/icons'

const CATEGORY_OPTIONS = [
  'Book',
  'Stationery',
  'Reading Accessory',
  'Desk & Studio',
  'Tech & Gadgets',
  'Candle & Ambience',
  'Gift Idea',
  'Other',
].map((c) => ({ title: c, value: c }))

export const shelfPick = defineType({
  name: 'shelfPick',
  title: 'Shop My Picks',
  type: 'document',
  icon: PackageIcon,
  orderings: [
    {
      title: 'Newest First',
      name: 'createdAtDesc',
      by: [{ field: '_createdAt', direction: 'desc' }],
    },
    {
      title: 'Name A–Z',
      name: 'nameAsc',
      by: [{ field: 'name', direction: 'asc' }],
    },
  ],
  fields: [
    defineField({
      name: 'name',
      title: 'Product Name',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'string',
      options: { list: CATEGORY_OPTIONS },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'image',
      title: 'Product Image',
      type: 'image',
      options: { hotspot: true },
      description: 'Meta image of url will be used by default if no image uploaded',
    }),
    defineField({
      name: 'description',
      title: 'Short Description',
      type: 'text',
      rows: 3,
      description: 'A brief note on why you love it (recommended ≤200 chars)',
      validation: (Rule) =>
        Rule.max(400).warning('Keep it concise — 200 chars or fewer works best'),
    }),
    defineField({
      name: 'buyLink',
      title: 'Buy Link',
      type: 'url',
    }),
    defineField({
      name: 'relatedVideoUrl',
      title: 'Related Video / Reel URL',
      type: 'url',
      description: 'Optional — Instagram reel, YouTube video, etc. A button appears on the card when set.',
    }),
    defineField({
      name: 'featured',
      title: 'Featured',
      type: 'boolean',
      initialValue: false,
      description: 'Pin to the top of the Shelf page',
    }),
  ],
  preview: {
    select: {
      title: 'name',
      subtitle: 'category',
      media: 'image',
    },
  },
})
