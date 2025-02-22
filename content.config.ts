import { defineContentConfig, defineCollection } from '@nuxt/content'

export default defineContentConfig({
  collections: {
    home: defineCollection({
      type: 'page',
      source: 'index.md'
    }),
    about: defineCollection({
      type: 'page',
      source: 'about/*.md'
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
