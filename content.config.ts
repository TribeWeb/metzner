// import { defineContentConfig, defineCollection, property } from '@nuxt/content'
// import { z } from 'zod'
// // import { asSitemapCollection } from '@nuxtjs/sitemap/content'
// import { schemas } from './app/utils/schemas'

// export default defineContentConfig({
//   collections: {
//     home: defineCollection({
//       type: 'page',
//       source: 'index.md'
//     }),
//     about: defineCollection({
//       type: 'page',
//       source: [{
//         include: 'about/*.md',
//         prefix: '/'
//       },
//       { include: '1.about.md' }],
//       schema: schemas.about
//     }),
//     machinesLanding: defineCollection({
//       type: 'page',
//       source: 'machines.md'
//     }),
//     machines: defineCollection({
//       type: 'page',
//       source: 'machines/*',
//       schema: schemas.machines
//     }),
//     sparesLanding: defineCollection({
//       type: 'page',
//       source: 'spares.md'
//     }),
//     peripheralsLanding: defineCollection({
//       type: 'page',
//       source: 'peripherals.md'
//     }),
//     peripherals: defineCollection({
//       type: 'page',
//       source: 'peripherals/*'
//     }),
//     latest: defineCollection({
//       type: 'page',
//       source: 'latest.md'
//     }),
//     posts: defineCollection({
//       source: 'latest/**/*',
//       type: 'page',
//       schema: z.object({
//         image: z.object({ src: property(z.string()).editor({ input: 'media' }) }),
//         authors: z.array(
//           z.object({
//             name: z.string().nonempty(),
//             to: z.string().nonempty(),
//             avatar: z.object({ src: property(z.string()).editor({ input: 'media' }) })
//           })
//         ),
//         date: z.date(),
//         badge: z.object({ label: z.string().nonempty() })
//       })
//     }),
//     materials: defineCollection({
//       type: 'data',
//       source: 'data/materials/**',
//       schema: schemas.materials
//     })
//   }
// })

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
    materialsLanding: defineCollection({
      type: 'page',
      source: 'materials.md',
      schema: z.object({
        categories: z.array(
          z.object({
            id: z.string().nonempty(),
            title: z.string().nonempty(),
            collection: z.string().optional(),
            order: z.number()
          })
        ),
        attributes: z.array(
          z.object({
            id: z.string().nonempty(),
            categoryId: z.string().nonempty(),
            legend: z.string().nonempty(),
            description: z.string().optional(),
            unit: z.string().optional()
          })
        ),
        attributeValues: z.array(
          z.object({
            id: z.string().nonempty(),
            attributeId: z.string().nonempty(),
            label: z.string().nonempty()
          })
        )
      })
    }),
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
