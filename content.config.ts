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
    ),
    machinemap: defineCollection({
      type: 'data',
      source: 'data/machinemap.json',
      schema: z.object({
        modelId: z.string(),
        modelName: z.string(),
        type: z.enum(['hose', 'profile', 'cord', 'gasket', 'tape']),
        stiffness: z.enum(['flexible', 'rigid']).optional(),
        shape: z.enum(['round', 'complex']),
        core: z.array(z.enum(['hollow', 'solid'])).optional(),
        reinforced: z.boolean().optional(),
        material: z.array(z.enum(['rubber', 'plastic', 'epdm', 'pvc', 'silicone', 'sponge'])),
        config: z.enum(['standard', 'optional'])
      })
    })
  }
})
