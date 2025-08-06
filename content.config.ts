import { defineContentConfig, defineCollection } from '@nuxt/content'
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
    // landing: defineCollection(
    //   asSitemapCollection({
    //     type: 'page',
    //     source: {
    //       include: '*.md',
    //       exclude: ['index.md']
    //     }
    //   })
    // ),
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
        source: 'machines/*.md',
        schema: schemas.machines
      })
    ),
    sparesLanding: defineCollection(
      asSitemapCollection({
        type: 'page',
        source: 'spares.md'
        // schema: schemas.spares
      })
    ),
    spares: defineCollection(
      asSitemapCollection({
        type: 'page',
        source: 'spares/*.md'
        // schema: schemas.spares
      })
    ),
    latest: defineCollection(
      asSitemapCollection({
        type: 'page',
        source: 'latest.md'
      })
    ),
    posts: defineCollection({
      source: 'latest/**/*',
      type: 'page',
      schema: z.object({
        image: z.object({ src: z.string().nonempty().editor({ input: 'media' }) }),
        authors: z.array(
          z.object({
            name: z.string().nonempty(),
            to: z.string().nonempty(),
            avatar: z.object({ src: z.string().nonempty().editor({ input: 'media' }) })
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
