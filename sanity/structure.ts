import type { StructureResolver } from 'sanity/structure'

// Singleton document types that only ever have one document
const SINGLETONS = ['siteSettings', 'about'] as const

// https://www.sanity.io/docs/structure-builder-cheat-sheet
export const structure: StructureResolver = (S) =>
  S.list()
    .title('Content')
    .items([
      // ── Singletons ───────────────────────────────────────────────────────
      S.listItem()
        .title('Site Settings')
        .id('siteSettings')
        .child(
          S.document()
            .schemaType('siteSettings')
            .documentId('siteSettings')
            .title('Site Settings'),
        ),
      S.listItem()
        .title('About')
        .id('about')
        .child(
          S.document()
            .schemaType('about')
            .documentId('about')
            .title('About'),
        ),

      S.divider(),

      // ── Document types ────────────────────────────────────────────────────
      ...S.documentTypeListItems().filter(
        (item) => !SINGLETONS.includes(item.getId() as (typeof SINGLETONS)[number]),
      ),
    ])
