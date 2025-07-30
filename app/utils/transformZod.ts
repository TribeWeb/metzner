import { z } from 'zod'

function createTitleFromManufacturerNameAndProductCode(
  manufacturerName: string,
  productCode: string
): string {
  return `${manufacturerName} ${productCode}`
}

// function slugify(raw: string): string {
//   return raw
//   .replaceAll('.', '-')
//   .replace(/[^\w\s-]/g, '')
//   .replace(/[\s_-]+/g, '-')
//   .replace(/^-+|-+$/g, '');
// }

export const googleSheetsApiReturnSchema = z.object({
  majorDimension: z.string(),
  range: z.string(),
  values: z.array(z.array(z.string()))
})
// Generate zod schama that can be used in content.config.ts
// Get the output type of this schema using https://zod.dev/?id=zodtype-with-zodeffects
// Use https://transform.tools/typescript-to-zod to automatically generate zod schema from the type

const vInNomValues = [12, 24, 36, 48, 60, 72, 96, 110, 220]
const vOutNomValues = [3.3, 5, 12, 13.2, 15, 24, 28, 36, 48, 60, 85, 110]

export const productSchema = z.object({
  manufacturerSlug: z.string().trim().toLowerCase().transform(val => val.replaceAll('.', '-').replace(/[^\w\s-]/g, '').replace(/[\s_-]+/g, '-').replace(/^-+|-+$/g, '')),
  manufacturerName: z.string().trim(),
  modelRange: z.string().trim(),
  modelSeries: z.string().trim(),
  modelCode: z.string().trim(),
  supercedesModelCodes: z.string().trim().transform(str => str.split(',').map((val: string) => val.trim())).pipe(z.array(z.string())),
  alsoReferredModelCodes: z.string().trim().transform(str => str.split(',').map((val: string) => val.trim())).pipe(z.array(z.string())),
  GTIN: z.string().trim(),
  productCode: z.string().trim(),
  productSlug: z.string().trim().toLowerCase().transform(val => val.replaceAll('.', '-').replace(/[^\w\s-]/g, '').replace(/[\s_-]+/g, '-').replace(/^-+|-+$/g, '')),
  spCanonicalUrl: z.union([z.literal(''), z.string().trim().url()]),
  cpCanonicalUrl: z.union([z.literal(''), z.string().trim().url()]),
  kpCanonicalUrl: z.union([z.literal(''), z.string().trim().url()]),
  vInNom: z.string().trim().transform(str => str.split(',').map((val: string) => z.coerce.number().parse(val.trim()))).pipe(z.union([z.array(z.literal(0)), z.custom<number[]>(arr => arr.every((val: number) => vInNomValues.includes(val)), 'vInNom contains an invalid value')])),
  vInMin: z.coerce.number(),
  vInMax: z.coerce.number(),
  vSupplyMin: z.coerce.number(),
  vSupplyMax: z.coerce.number(),
  supplyPhase: z.string().trim(),
  vOutNom: z.string().trim().transform(str => str.split(',').map((val: string) => z.coerce.number().parse(val))).pipe(z.union([z.array(z.literal(0)), z.custom<number[]>(arr => arr.every((val: number) => vOutNomValues.includes(val)), 'vOutNom contains an invalid value')])),
  vOutMin: z.coerce.number(),
  vOutMax: z.coerce.number(),
  iOutMin: z.coerce.number(),
  iOutMax: z.coerce.number(),
  pOutMax: z.coerce.number(),
  mountingStyles: z.string().trim().toLowerCase().transform(str => str.split(',').map((val: string) => val.trim())).pipe(z.array(z.string())),
  width: z.coerce.number(),
  height: z.coerce.number(),
  depth: z.coerce.number(),
  weight: z.coerce.number(),
  rackHeight: z.string().trim(),
  HSCode: z.string().trim(),
  accreditations: z.string().trim().toLowerCase().transform(str => str.split(',').map((val: string) => val.trim())).pipe(z.array(z.string())),
  listPrice: z.coerce.number(),
  handlingId: z.string().trim().optional().default(''),
  features: z.string().trim().toLowerCase().transform(str => str.split(',').map((val: string) => val.trim())).pipe(z.array(z.string()))
})

export const productsSchema = z.array(productSchema)

// export const machineSchema = z.object({
//   machineId: z.string(),
//   machineName: z.string(),
//   modelId: z.string(),
//   cutWidth: z.coerce.number().optional(),
//   cutHeight: z.coerce.number().optional(),
//   cutDiameter: z.coerce.number().optional()
// })

// export const machinesSchema = z.array(machineSchema)

// export const productSchema = z.object({
//   manufacturerSlug: z.string().trim().toLowerCase().transform(val => val.replaceAll('.', '-').replace(/[^\w\s-]/g, '').replace(/[\s_-]+/g, '-').replace(/^-+|-+$/g, '')),
//   manufacturerName: z.string().trim(),
//   modelRange: z.string().trim(),
//   modelSeries: z.string().trim(),
//   modelCode: z.string().trim(),
//   supercedesModelCodes: z.string().trim().transform(str => str.split(',').map((val: string) => val.trim())).pipe(z.array(z.string())),
//   alsoReferredModelCodes: z.string().trim().transform(str => str.split(',').map((val: string) => val.trim())).pipe(z.array(z.string())),
//   GTIN: z.string().trim(),
//   productCode: z.string().trim(),
//   productSlug: z.string().trim().toLowerCase().transform(val => val.replaceAll('.', '-').replace(/[^\w\s-]/g, '').replace(/[\s_-]+/g, '-').replace(/^-+|-+$/g, '')),
//   spCanonicalUrl: z.union([z.literal(''),z.string().trim().url()]),
//   cpCanonicalUrl: z.union([z.literal(''),z.string().trim().url()]),
//   kpCanonicalUrl: z.union([z.literal(''),z.string().trim().url()]),
//   //vInNom: z.string().trim().transform(str => str.split(',').map((val: string) => z.coerce.number().parse(val))).pipe(z.union([z.array(z.literal(0)),z.custom<number[]>(arr => arr.every((val: number) => vInNomValues.includes(val)),"vInNom contains an invalid value")])),
//   vInNom: z.string().trim().transform(str => str.split(',')).,
//   vInMin: z.coerce.number(),
//   vInMax: z.coerce.number(),
//   vSupplyMin: z.coerce.number(),
//   vSupplyMax: z.coerce.number(),
//   supplyPhase: z.string().trim(),
//   vOutNom: z.string().trim().transform(str => str.split(',').map((val: string) => z.coerce.number().parse(val))).pipe(z.union([z.array(z.literal(0)),z.custom<number[]>(arr => arr.every((val: number) => vOutNomValues.includes(val)),"vOutNom contains an invalid value")])),
//   vOutMin: z.coerce.number(),
//   vOutMax: z.coerce.number(),
//   iOutMin: z.coerce.number(),
//   iOutMax: z.coerce.number(),
//   pOutMax: z.coerce.number(),
//   mountingStyles: z.string().trim().toLowerCase().transform(str => str.split(',').map((val: string) => val.trim())).pipe(z.array(z.string())),
//   width: z.coerce.number(),
//   height: z.coerce.number(),
//   depth: z.coerce.number(),
//   weight: z.coerce.number(),
//   rackHeight: z.string().trim(),
//   HSCode: z.string().trim(),
//   accreditations: z.string().trim().toLowerCase().transform(str => str.split(',').map((val: string) => val.trim())).pipe(z.array(z.string())),
//   listPrice: z.coerce.number(),
//   features: z.string().trim().toLowerCase().transform(str => str.split(',').map((val: string) => val.trim())).pipe(z.array(z.string())),
// })

// export const collections = {
//   content: defineCollection({
//     type: 'page',
//     source: '**/*.md'
//   }),
//   admin: defineCollection({
//     type: 'page',
//     source: 'admin/**/*.md',
//     schema:z.object({
//       title: z.string().trim(),
//       sheets: z.string().array().optional()
//     })
//   }),
//   dcDcConverters: defineCollection({
//     source: 'dc-dc-converters/**/*.md',
//     type: 'page',
//     schema: z.object({
//       manufacturerSlug: z.string().trim().toLowerCase(),
//       manufacturerName: z.string().trim(),
//       modelRange: z.string().trim().optional(),
//       modelSeries: z.string().trim().optional(),
//       modelCode: z.string().trim(),
//       supercedesModelCodes: z.string().trim().array().optional(),
//       alsoReferredModelCodes: z.string().trim().array().optional(),
//       GTIN: z.string().trim().optional(),
//       productCode: z.string().trim(),
//       productSlug: z.string().trim().toLowerCase(),
//       spCanonicalUrl: z.string().trim().url().optional(),
//       cpCannonicalUrl: z.string().trim().url().optional(),
//       kpCannonicalUrl: z.string().trim().url().optional(),
//       vInNom: z.union([z.literal(12),z.literal(24),z.literal(36),z.literal(48),z.literal(60),z.literal(72),z.literal(96),z.literal(110),z.literal(220)]).array().optional(),
//       vInMin: z.number().optional(),
//       vInMax: z.number().optional(),
//       vSupplyMin: z.number().optional(),
//       vSupplyMax: z.number().optional(),
//       supplyPhase: z.string().trim().optional(),
//       vOutNom: z.union([z.literal(3.3),z.literal(5),z.literal(12),z.literal(13.2),z.literal(15),z.literal(24),z.literal(28),z.literal(36),z.literal(48),z.literal(60),z.literal(85),z.literal(110)]).array().optional(),
//       vOutMin: z.number().optional(),
//       vOutMax: z.number().optional(),
//       iOutMin: z.number().optional(),
//       iOutMax: z.number().optional(),
//       pOutMax: z.number().optional(),
//       mountingStyles: z.string(),
//       width: z.number(),
//       height: z.number(),
//       depth: z.number(),
//       weight: z.number(),
//       rackHeight: z.string().trim().optional(),
//       HSCode: z.string().trim().optional(),
//       accreditations: z.string().toLowerCase().array().optional(),
//       listPrice: z.number().optional(),
//       features: z.string().toLowerCase().array().optional(),
//     })
//   }),
//   manufacturers: defineCollection({
//     source: 'manufacturers/*.md',
//     type: 'page',
//     schema: z.object({
//       manufacturerSlug: z.string().toLowerCase(),
//       manufacturerName: z.string(),
//       alternateNames: z.string().array().optional(),
//       description: z.string().optional(),
//       disambiguatingDescription: z.string().optional(),
//       sameAsUrls: z.string().url().array().optional(),
//       discountBreakpoints: z.number().array().optional(),
//       discountPercentages: z.number().array().optional(),
//       spCanonicalUrl: z.string().url().optional(),
//       cpCanonicalUrl: z.string().url().optional(),
//       kpCanonicalUrl: z.string().url().optional()
//     })
//   }),
//   handlingTimes: defineCollection({
//     source: 'data/handling-times/*.json',
//     type: 'data',
//     schema: z.object({
//       id: z.string().toLowerCase(),
//       minWorkingDaysUntilOrderProcessed: z.number(),
//       maxWorkingDaysUntilOrderProcessed: z.number(),
//       minActualDaysUntilOrderProcessed: z.number(),
//       maxActualDaysUntilOrderProcessed: z.number(),
//       orderCutOffDay: z.string(),
//       orderCutOffTime: z.string().time({ precision: 0 }), // HH:MM:SS - Add the :SS in the import?
//       transitTime: z.number(), // Needs clarification
//       description: z.string(),
//       longDescription: z.string(),
//       notes: z.string()
//     })
//   })
// }
