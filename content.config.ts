import { defineContentConfig, defineCollection } from '@nuxt/content'
// import { z } from 'zod'
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
          include: 'about/*.md',
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
        source: 'machines/*.md',
        schema: schemas.machines
      })
    ),
    spares: defineCollection(
      asSitemapCollection({
        type: 'page',
        source: {
          include: 'spares/*.md'
        }
        // schema: schemas.spares
      })
    ),
    materials: defineCollection({
      type: 'data',
      source: 'data/materials/**',
      schema: schemas.materials
    })
  }
})
