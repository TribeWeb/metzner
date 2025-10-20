import { z } from 'zod'

export const machines = z.strictObject({
  title: z.string().optional(),
  description: z.string().optional(),
  pageOrder: z.coerce.number().optional(),
  navigation: z.object({
    title: z.string().optional(),
    description: z.string().optional(),
    icon: z.string().optional()
  }),
  machineId: z.string(),
  machineName: z.string(),
  modelId: z.string(),
  cutWidth: z.coerce.number().optional(),
  cutHeight: z.coerce.number().optional(),
  cutDiameter: z.coerce.number().optional(),
  cutRate: z.coerce.number().optional(),
  cutAccuracy: z.string().optional(),
  feedSpeed: z.string().optional(),
  dimensions: z.string().optional(),
  electricalInput: z.string().optional(),
  compressedAirInput: z.string().optional(),
  idleNoise: z.string().optional(),
  featurePrimary: z.string().optional(),
  featureSecondary: z.string().optional(),
  relativePrice: z.coerce.number().optional(),
  minPrice: z.coerce.number().optional(),
  maxPrice: z.coerce.number().optional(),
  features: z.object({
    title: z.string().optional(),
    description: z.string().optional(),
    icon: z.string().optional()
  }).optional(),
  benefits: z.array(z.object({
    title: z.string().optional(),
    description: z.string().optional(),
    icon: z.string().optional()
  })).optional(),
  seo: z.object({
    title: z.string().optional(),
    description: z.string().optional()
  }).optional()
})

export const about = z.strictObject({
  column: z.enum(['company', 'website']),
  sheets: z.array(z.string()).optional(),
  contentFolderPath: z.string().optional(),
  googleSheets: z.array(
    z.object({
      label: z.string(),
      id: z.string().length(44)
    })
  ).optional(),
  googleSheets1: z.array(
    z.object({
      source: z.object({
        label: z.string(),
        id: z.string().length(44),
        sheetTitle: z.string(),
        range: z.string()
      }),
      destination: z.object({
        path: z.string(),
        folder: z.string(),
        slug: z.string(),
        type: z.enum(['frontmatter', 'json', 'yaml'])
      })
    })
  )
})

export const materials = z.strictObject({
  slug: z.string(),
  modelId: z.string(),
  modelName: z.string(),
  type: z.enum(['hose', 'profile', 'cord', 'gasket', 'tape']),
  stiffness: z.enum(['flexible', 'rigid', '*']).optional(),
  shape: z.enum(['round', 'complex', 'square']).optional(),
  core: z.array(z.union([
    z.literal('hollow'),
    z.literal('solid')
  ])),
  reinforced: z.enum(['steel', 'none']).optional(),
  material: z.array(z.union([
    z.literal('rubber'),
    z.literal('plastic'),
    z.literal('epdm'),
    z.literal('pvc'),
    z.literal('silicone'),
    z.literal('sponge')
  ])),
  config: z.enum(['standard', 'optional'])
})

// export const pageCollectionItemBaseSchema = z.strictObject({
//   path: z.string(),
//   title: z.string(),
//   description: z.string(),
//   seo: z.intersection(
//     z.object({
//       title: z.string().optional(),
//       description: z.string().optional(),
//       meta: z.array(z.record(z.string(), z.any())).optional(),
//       link: z.array(z.record(z.string(), z.any())).optional()
//     }),
//     z.record(z.string(), z.any())
//   ).optional().default({}),
//   navigation: z.union([
//     z.boolean(),
//     z.object({
//       title: z.string().optional(),
//       description: z.string().optional(),
//       icon: z.string().optional()
//     })
//   ]).default(true)
// })

// const mergedMachines = machines.merge(pageCollectionItemBaseSchema)
// const mergedAbout = about.merge(pageCollectionItemBaseSchema)
// const mergedMaterials = materials.merge(pageCollectionItemBaseSchema)

export const schemas = {
  machines,
  about,
  materials
}

export interface Import {
  machines: z.infer<typeof machines>
  about: z.infer<typeof about>
  materials: z.infer<typeof materials>
}
