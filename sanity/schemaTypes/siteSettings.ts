import { defineType, defineField, defineArrayMember } from 'sanity'
import { CogIcon } from '@sanity/icons'

export const siteSettings = defineType({
  name: 'siteSettings',
  title: 'Site Settings',
  type: 'document',
  icon: CogIcon,
  fields: [
    defineField({
      name: 'name',
      title: 'Site / Creator Name',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'tagline',
      title: 'Tagline',
      type: 'string',
      validation: (Rule) =>
        Rule.required().max(100).error('Tagline must be 100 characters or fewer'),
    }),
    defineField({
      name: 'bio',
      title: 'Bio',
      type: 'array',
      of: [defineArrayMember({ type: 'block' })],
    }),
    defineField({
      name: 'profileImage',
      title: 'Profile Image',
      type: 'image',
      options: { hotspot: true },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'socialHandles',
      title: 'Social Handles',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'socialLink',
          title: 'Social Link',
          fields: [
            defineField({
              name: 'platform',
              title: 'Platform',
              type: 'string',
              options: {
                list: [
                  { title: 'Instagram', value: 'Instagram' },
                  { title: 'WordPress', value: 'WordPress' },
                  { title: 'LinkedIn', value: 'LinkedIn' },
                  { title: 'YouTube', value: 'YouTube' },
                  { title: 'TikTok', value: 'TikTok' },
                  { title: 'Email', value: 'Email' },
                ],
              },
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'url',
              title: 'URL',
              type: 'url',
              validation: (Rule) =>
                Rule.uri({ scheme: ['http', 'https', 'mailto'] }),
            }),
            defineField({
              name: 'handle',
              title: 'Handle / Username',
              type: 'string',
            }),
          ],
          preview: {
            select: { title: 'platform', subtitle: 'handle' },
          },
        }),
      ],
    }),
    defineField({
      name: 'metrics',
      title: 'Metrics',
      type: 'object',
      fields: [
        defineField({ name: 'followers', title: 'Followers', type: 'number' }),
        defineField({
          name: 'avgEngagementRate',
          title: 'Avg Engagement Rate (%)',
          type: 'number',
        }),
        defineField({ name: 'avgReach', title: 'Avg Reach per Post', type: 'number' }),
        defineField({ name: 'monthlyViews', title: 'Monthly Views', type: 'number' }),
        defineField({
          name: 'lastUpdated',
          title: 'Last Updated',
          type: 'datetime',
        }),
      ],
    }),
    defineField({
      name: 'resumeFile',
      title: 'Resume / Media Kit (PDF)',
      type: 'file',
    }),
    defineField({
      name: 'seo',
      title: 'SEO',
      type: 'object',
      fields: [
        defineField({
          name: 'metaTitle',
          title: 'Meta Title',
          type: 'string',
        }),
        defineField({
          name: 'metaDescription',
          title: 'Meta Description',
          type: 'text',
          rows: 3,
          validation: (Rule) =>
            Rule.max(160).warning('Meta description should be 160 characters or fewer'),
        }),
        defineField({
          name: 'ogImage',
          title: 'OG Image',
          type: 'image',
          options: { hotspot: true },
        }),
      ],
    }),
  ],
  preview: {
    select: { title: 'name', subtitle: 'tagline', media: 'profileImage' },
  },
})
