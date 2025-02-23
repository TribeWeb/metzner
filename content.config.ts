import { defineContentConfig, defineCollection, z } from '@nuxt/content'

export default defineContentConfig({
  collections: {
    home: defineCollection({
      type: 'page',
      source: 'index.md'
    }),
    about: defineCollection({
      type: 'page',
      source: {
        include: 'about/*',
        prefix: '/'
      },
      schema: z.object({
        column: z.enum(['company', 'website'])
      })
    }),
    latest: defineCollection({
      type: 'page',
      source: 'latest/*.md'
    }),
    machines: defineCollection({
      type: 'page',
      source: 'machines/**'
    })
  }
})
