import { z } from 'zod'

type FieldId = 'stiffness' | 'shape' | 'core' | 'reinforced' | 'material' | 'width' | 'height' | 'diameter'
type FieldGroupId = 'crossSection' | 'longSection' | 'material' | 'widthHeight' | 'diameter'

type StepId = 'length' | 'profile' | 'dimensions'

type ValueMeta = Record<string, unknown> & {
  label: string
  fieldId: FieldId
  fieldGroupId: FieldGroupId
}

type MaterialMeta = ValueMeta & {
  stepId: StepId
}

const literalValue = <T extends string>(value: T, meta: ValueMeta) => z.literal(value).meta(meta)

const numericValue = (meta: ValueMeta) => z.coerce.number().meta({ ...meta, unit: 'mm' })

export const fieldValues = z.object({
  flexible: literalValue('flexible', { label: 'Flexible', fieldId: 'stiffness', fieldGroupId: 'crossSection' }),
  rigid: literalValue('rigid', { label: 'Rigid', fieldId: 'stiffness', fieldGroupId: 'crossSection' }),
  star: literalValue('*', { label: 'Any', fieldId: 'stiffness', fieldGroupId: 'crossSection' }),
  round: literalValue('round', { label: 'Round', fieldId: 'shape', fieldGroupId: 'crossSection' }),
  complex: literalValue('complex', { label: 'Complex', fieldId: 'shape', fieldGroupId: 'crossSection' }),
  square: literalValue('square', { label: 'Square', fieldId: 'shape', fieldGroupId: 'crossSection' }),
  hollow: literalValue('hollow', { label: 'Hollow', fieldId: 'core', fieldGroupId: 'crossSection' }),
  solid: literalValue('solid', { label: 'Solid', fieldId: 'core', fieldGroupId: 'crossSection' }),
  mixed: literalValue('mixed', { label: 'Mixed', fieldId: 'core', fieldGroupId: 'crossSection' }),
  steel: literalValue('steel', { label: 'Steel', fieldId: 'reinforced', fieldGroupId: 'longSection' }),
  none: literalValue('none', { label: 'None', fieldId: 'reinforced', fieldGroupId: 'longSection' }),
  rubber: literalValue('rubber', { label: 'Rubber', fieldId: 'material', fieldGroupId: 'material' }),
  plastic: literalValue('plastic', { label: 'Plastic', fieldId: 'material', fieldGroupId: 'material' }),
  epdm: literalValue('epdm', { label: 'EPDM', fieldId: 'material', fieldGroupId: 'material' }),
  pvc: literalValue('pvc', { label: 'PVC', fieldId: 'material', fieldGroupId: 'material' }),
  silicone: literalValue('silicone', { label: 'Silicone', fieldId: 'material', fieldGroupId: 'material' }),
  sponge: literalValue('sponge', { label: 'Sponge', fieldId: 'material', fieldGroupId: 'material' }),
  width: numericValue({ label: 'Width', fieldId: 'width', fieldGroupId: 'widthHeight' }),
  height: numericValue({ label: 'Height', fieldId: 'height', fieldGroupId: 'widthHeight' }),
  diameter: numericValue({ label: 'Diameter', fieldId: 'diameter', fieldGroupId: 'diameter' })
})

export const materials = z.strictObject({
  slug: z.string(),
  modelId: z.string(),
  modelName: z.string(),
  type: z.enum(['hose', 'profile', 'cord', 'gasket', 'tape']),
  stiffness: z.xor([
    fieldValues.shape.flexible.optional(),
    fieldValues.shape.rigid.optional(),
    fieldValues.shape.star.optional()
  ]).meta({ label: 'Stiffness', fieldId: 'stiffness', fieldGroupId: 'longSection', stepId: 'length' } satisfies MaterialMeta),
  shape: z.xor([
    fieldValues.shape.round.optional(),
    fieldValues.shape.complex.optional(),
    fieldValues.shape.square.optional()
  ]).meta({ label: 'Shape', fieldId: 'shape', fieldGroupId: 'crossSection', stepId: 'profile' } satisfies MaterialMeta),
  core: z.xor([
    fieldValues.shape.hollow.optional(),
    fieldValues.shape.solid.optional(),
    fieldValues.shape.mixed.optional()
  ]).meta({ label: 'Core', fieldId: 'core', fieldGroupId: 'crossSection', stepId: 'profile' } satisfies MaterialMeta),
  reinforced: z.xor([
    fieldValues.shape.none.optional(),
    fieldValues.shape.steel.optional()
  ]).meta({ label: 'Reinforced', fieldId: 'reinforced', fieldGroupId: 'crossSection', stepId: 'profile' } satisfies MaterialMeta),
  diameter: fieldValues.shape.diameter.optional().meta({ label: 'Diameter', fieldId: 'diameter', fieldGroupId: 'diameter', stepId: 'dimensions' } satisfies MaterialMeta),
  width: fieldValues.shape.width.optional().meta({ label: 'Width', fieldId: 'width', fieldGroupId: 'widthHeight', stepId: 'dimensions' } satisfies MaterialMeta),
  height: fieldValues.shape.height.optional().meta({ label: 'Height', fieldId: 'height', fieldGroupId: 'widthHeight', stepId: 'dimensions' } satisfies MaterialMeta),
  material: z.array(z.union([
    fieldValues.shape.rubber,
    fieldValues.shape.plastic,
    fieldValues.shape.epdm,
    fieldValues.shape.pvc,
    fieldValues.shape.silicone,
    fieldValues.shape.sponge
  ])).meta({ label: 'Material', fieldGroupId: 'material' }),
  config: z.enum(['standard', 'optional'])
})

export const machines = z.strictObject({
  // title: z.string().optional(),
  // description: z.string().optional(),
  pageOrder: z.coerce.number().optional(),
  // navigation: z.object({
  //   title: z.string().optional(),
  //   description: z.string().optional(),
  //   icon: z.string().optional()
  // }),
  machineId: z.string(),
  machineName: z.string(),
  modelId: z.string(),
  cutWidth: z.coerce.number().optional(),
  cutHeight: z.coerce.number().optional(),
  cutDiameter: z.coerce.number().optional(),
  cutRate: z.coerce.number().optional(),
  cutAccuracy: z.string().optional(),
  feedSpeed: z.coerce.number().optional(),
  dimensions: z.string().optional(),
  electricalInput: z.string().optional(),
  compressedAirInput: z.string().optional(),
  weight: z.coerce.number().optional(),
  sameAs: z.array(z.string()).optional(),
  idleNoise: z.coerce.number().optional(),
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
  })).optional()
  // seo: z.object({
  //   title: z.string().optional(),
  //   description: z.string().optional()
  // }).optional()
})

export const about = z.strictObject({
  column: z.enum(['company', 'website'])
  // sheets: z.array(z.string()).optional(),
  // contentFolderPath: z.string().optional(),
  // googleSheets: z.array(
  //   z.object({
  //     label: z.string(),
  //     id: z.string().length(44)
  //   })
  // ).optional(),
  // googleSheets1: z.array(
  //   z.object({
  //     source: z.object({
  //       label: z.string(),
  //       id: z.string().length(44),
  //       sheetTitle: z.string(),
  //       range: z.string()
  //     }),
  //     destination: z.object({
  //       path: z.string(),
  //       folder: z.string(),
  //       slug: z.string(),
  //       type: z.enum(['frontmatter', 'json', 'yaml'])
  //     })
  //   })
  // )
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
