import { type SchemaTypeDefinition } from 'sanity'
import { siteSettings } from './siteSettings'
import { about } from './about'
import { bookReview } from './bookReview'
import { post } from './post'
import { brandCollab } from './brandCollab'
import { writingPiece } from './writingPiece'
import { shelfPick } from './shelfPick'

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [
    // Singletons first
    siteSettings,
    about,
    // Document types
    bookReview,
    post,
    brandCollab,
    writingPiece,
    shelfPick,
  ],
}

