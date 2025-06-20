import { z } from 'zod'

export const machines = z.strictObject({
  machineId: z.string(),
  machineName: z.string(),
  modelId: z.string(),
  cutWidthMax: z.coerce.number().optional(),
  cutHeightMax: z.coerce.number().optional(),
  cutDiameter: z.coerce.number().optional()
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

export const schemas = {
  machines,
  about,
  materials
}
export type Import = {
  machines: z.infer<typeof machines>
  about: z.infer<typeof about>
  materials: z.infer<typeof materials>
}
