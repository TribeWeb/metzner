import { defineContentConfig, defineCollection, property } from '@nuxt/content'
import { z } from 'zod'
import { asSitemapCollection } from '@nuxtjs/sitemap/content'
import { schemas } from './app/utils/schemas'

export default defineContentConfig({
  collections: {
    home: defineCollection({
        type: 'page',
        source: 'index.md'
      }),
    about: defineCollection({
        type: 'page',
        source: [{
          include: 'about/*.md',
          prefix: '/'
        },
        { include: '1.about.md' }],
        schema: schemas.about
     }),
    machinesLanding: defineCollection({
        type: 'page',
        source: 'machines.md'
      }),
    machines: defineCollection({
        type: 'page',
        source: 'machines/*.md',
        schema: schemas.machines
      }),
    sparesLanding: defineCollection({
        type: 'page',
        source: 'spares.md'
      }),
    peripheralsLanding: defineCollection({
        type: 'page',
        source: 'peripherals.md'
      }),
    peripherals: defineCollection({
        type: 'page',
        source: 'peripherals/*.md'
      }),
    latest: defineCollection({
        type: 'page',
        source: 'latest.md'
      }),
    posts: defineCollection({
      source: 'latest/**/*',
      type: 'page',
      schema: z.object({
        image: z.object({ src: property(z.string()).editor({ input: 'media' }) }),
        authors: z.array(
          z.object({
            name: z.string().nonempty(),
            to: z.string().nonempty(),
            avatar: z.object({ src: property(z.string()).editor({ input: 'media' }) })
          })
        ),
        date: z.date(),
        badge: z.object({ label: z.string().nonempty() })
      })
    }),
    materials: defineCollection({
      type: 'data',
      source: 'data/materials/**',
      schema: schemas.materials
    })
  }
})
