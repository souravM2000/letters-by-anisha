import { createClient } from 'next-sanity'

import { apiVersion, dataset, projectId } from '../env'

export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false, // Tag-based ISR revalidation requires bypassing Sanity's CDN cache to avoid double-caching.
})
