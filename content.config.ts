import { defineContentConfig, defineCollection, property } from '@nuxt/content'
import { z } from 'zod'
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
        source: [{
          include: 'about/*.md',
          prefix: '/'
        },
        { include: '1.about.md' }],
        schema: schemas.about
      })
    ),
    machinesLanding: defineCollection(
      asSitemapCollection({
        type: 'page',
        source: 'machines.md'
      })
    ),
    machines: defineCollection(
      asSitemapCollection({
        type: 'page',
        source: 'machines/*',
        schema: schemas.machines
      })
    ),
    sparesLanding: defineCollection(
      asSitemapCollection({
        type: 'page',
        source: 'spares.md'
      })
    ),
    peripheralsLanding: defineCollection(
      asSitemapCollection({
        type: 'page',
        source: 'peripherals.md'
      })
    ),
    materialsLanding: defineCollection(
      asSitemapCollection({
        type: 'page',
        source: 'materials.md',
        schema: z.object({
          fieldGroup: z.array(
            z.object({
              id: z.string().nonempty(),
              legend: z.string().nonempty(),
              stepId: z.string().nonempty(),
              stepTitle: z.string().nonempty(),
              order: z.number()
            })
          ),
          questions: z.array(
            z.object({
              fieldId: z.string().nonempty(),
              question: z.string().nonempty()
            })
          )
        })
      })
    ),
    peripherals: defineCollection(
      asSitemapCollection({
        type: 'page',
        source: 'peripherals/*'
      })
    ),
    latest: defineCollection(
      asSitemapCollection({
        type: 'page',
        source: 'latest.md'
      })
    ),
    posts: defineCollection(
      asSitemapCollection({
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
      })
    ),
    materials: defineCollection({
      type: 'data',
      source: 'data/materials/**',
      schema: schemas.materials
    })
  }
})
