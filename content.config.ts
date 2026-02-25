import { defineContentConfig, defineCollection, property } from '@nuxt/content'
import { z } from 'zod'
import { schemas } from './app/utils/schemas'
import { asSitemapCollection } from '@nuxtjs/sitemap/content'

const sitemapSchemaFields = {
  sitemap: property(z.object({})).editor({ hidden: true }),
  seo: property(z.object({})).editor({ hidden: true })
}

const withSitemapCollection = ((collection, options) => {
  const schema = (collection as { schema?: unknown }).schema
  const collectionWithSitemapSchema = {
    ...collection,
    schema: schema instanceof z.ZodObject
      ? schema.extend(sitemapSchemaFields)
      : z.object(sitemapSchemaFields)
  }

  return asSitemapCollection(collectionWithSitemapSchema as never, options)
}) as typeof asSitemapCollection

export default defineContentConfig({
  collections: {
    home: defineCollection(
      withSitemapCollection({
        type: 'page',
        source: 'index.md'
      })
    ),
    about: defineCollection(
      withSitemapCollection({
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
      withSitemapCollection({
        type: 'page',
        source: 'machines.md'
      })
    ),
    machines: defineCollection(
      withSitemapCollection({
        type: 'page',
        source: 'machines/*',
        schema: schemas.machines
      })
    ),
    sparesLanding: defineCollection(
      withSitemapCollection({
        type: 'page',
        source: 'spares.md'
      })
    ),
    peripheralsLanding: defineCollection(
      withSitemapCollection({
        type: 'page',
        source: 'peripherals.md'
      })
    ),
    materialsLanding: defineCollection(
      withSitemapCollection({
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
      withSitemapCollection({
        type: 'page',
        source: 'peripherals/*'
      })
    ),
    latest: defineCollection(
      withSitemapCollection({
        type: 'page',
        source: 'latest.md'
      })
    ),
    posts: defineCollection(
      withSitemapCollection({
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
