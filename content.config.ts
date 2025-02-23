import { defineContentConfig, defineCollection, z } from '@nuxt/content'
import { asSitemapCollection } from '@nuxtjs/sitemap/content'

export default defineContentConfig({
  collections: {
    home: defineCollection(
      asSitemapCollection({
        type: 'page',
        source: 'index.md'
      })
    ),
    about: defineCollection(
      asSitemapCollection({
        type: 'page',
        source: {
          include: 'about/*',
          prefix: '/'
        },
        schema: z.object({
          column: z.enum(['company', 'website'])
        })
      })
    ),
    latest: defineCollection(
      asSitemapCollection({
        type: 'page',
        source: 'latest/*.md'
      })
    ),
    machines: defineCollection(
      asSitemapCollection({
        type: 'page',
        source: 'machines/**'
      })
    )
    // content: defineCollection(
    //   // adds the robots frontmatter key to the collection
    //   asSitemapCollection({
    //     type: 'page',
    //     source: '**/*.md'
    //   })
    // )
  }
})
