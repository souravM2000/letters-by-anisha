/**
 * Server-only Sanity client with write permissions.
 *
 * Uses SANITY_API_WRITE_TOKEN for mutations (asset uploads, document patches).
 * Never import this in client components — the token must stay server-side.
 */
import { createClient } from 'next-sanity'

import { apiVersion, dataset, projectId } from '../env'

export const sanityWriteClient = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false,
  token: process.env.SANITY_API_WRITE_TOKEN,
})
