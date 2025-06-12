import { defineContentConfig, defineCollection } from '@nuxt/content'
import { asSitemapCollection } from '@nuxtjs/sitemap/content'
import { schemas } from './app/utils/schemas'

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
        schema: schemas.about
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
        source: {
          include: 'machines/1.machines/*.md',
          exclude: ['machines/1.machines/index.md']
        },
        schema: schemas.machines
      })
    ),
    materialMap: defineCollection({
      type: 'data',
      source: 'data/material-map/**',
      schema: schemas.materialMap
    })
  }
})
