import { defineContentConfig, defineCollection } from '@nuxt/content'

export default defineContentConfig({
  collections: {
    landing: defineCollection({
      type: 'page',
      source: 'index.md'
    }),
    about: defineCollection({
      type: 'page',
      source: 'about-us/*.md'
    }),
    latest: defineCollection({
      type: 'page',
      source: 'latest/*.md'
    }),
    products: defineCollection({
      type: 'page',
      source: 'products/*.md'
    })
  }
})
