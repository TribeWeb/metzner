import { materials, fieldValues } from '#imports'
import { z } from 'zod'

export const commonSchema = materials.pick({ stiffness: true, shape: true, reinforced: true, core: true })
export const diameterSchema = materials.pick({ diameter: true })
export const widthHeightSchema = materials.pick({ width: true, height: true })
export const schema = z.object({ ...commonSchema.shape, ...diameterSchema.shape, ...widthHeightSchema.shape })

export type CommonSchema = z.infer<typeof commonSchema>
export type DiameterSchema = z.infer<typeof diameterSchema>
export type WidthHeightSchema = z.infer<typeof widthHeightSchema>
export type Schema = CommonSchema & DiameterSchema & WidthHeightSchema
export type SchemaKey = Extract<keyof Schema, string>

const fieldValuesNoStar = fieldValues.omit({ star: true })
export type FieldValuesSchema = z.infer<typeof fieldValuesNoStar>
export type FieldValueKey = Extract<keyof FieldValuesSchema, string>

export interface FieldGroupItem {
  value: string
  id: SchemaKey
  disabled: boolean
  fieldGroupId?: string
  title?: string
  description?: string
  deprecated?: boolean
  label?: string
  unit?: string
  stepId?: string
}

export interface FieldValueItem {
  value: FieldValueKey
  id: FieldValueKey
  disabled: boolean
  fieldId?: SchemaKey
  label?: string
  description?: string
  unit?: string
}

export const useFieldGroups = computed<FieldGroupItem[]>(() => {
  const schemaEntries = Object.entries(schema.shape) as Array<[SchemaKey, (typeof schema.shape)[SchemaKey]]>
  return schemaEntries.map(([key, schemaField]) => {
    const meta = (schemaField.meta() || {}) as Partial<FieldGroupItem>
    return {
      value: '',
      id: key,
      disabled: false,
      ...meta
    }
  })
})

export const useItems = computed<FieldValueItem[]>(() => {
  const fieldValueEntries = Object.entries(fieldValuesNoStar.shape) as Array<[FieldValueKey, (typeof fieldValuesNoStar.shape)[FieldValueKey]]>
  return fieldValueEntries.map(([key, valueSchema]) => {
    const meta = (valueSchema.meta() || {}) as Partial<FieldValueItem>
    return {
      value: key,
      id: key,
      disabled: false,
      ...meta
    }
  })
})

export const useMountedState = (state: Partial<Schema>) => {
  const route = useRoute()
  onMounted(() => {
    const parsedRoute = schema.parse(route.query) as Partial<Schema>
    Object.assign(state, parsedRoute)
  })
  return { state }
}

// export const useItems = computed(() => {
//   const fieldGroups = Object.keys(schema.shape).map((key) => {
//     const meta = schema.shape[key as keyof Schema]?.meta() || {}
//     return {
//       value: '',
//       id: key,
//       disabled: false,
//       ...meta
//     }
//   })
//   const items = Object.keys(fieldValuesNoStar.shape).map((key) => {
//     const meta = fieldValuesNoStar.shape[key as keyof FieldValuesSchema]?.meta() || {}
//     return {
//       value: key,
//       id: key,
//       disabled: false,
//       ...meta
//     }
//   })
//   return { fieldGroups, items }
// })

// export const useItems1 = computed(() => {
//   const { data } = useNuxtData('machinesData')
//   const map = itemKeys.map((key: keyof MaterialsCollectionItem) => {
//     return {
//       [key]: getAllPossibleValues(data.value.allMaterials as MaterialsCollectionItem[], key).map((val) => {
//         if (val === '*') return
//         const meta = fieldValues.shape?.[val as keyof FieldValuesSchema].meta()
//         return {
//           label: meta?.label,
//           value: val,
//           description: '',
//           disabled: false
//         }
//       }).filter(Boolean)
//     }
//   })
//   return Object.assign({}, ...map)
// })

// export const useItems = computed(() => {
//   const { data: materials } = useNuxtData('machinesData')
//   const { data: copy } = useNuxtData('materialsCopy')
//   // const obj = { items: {}, groups: [] as Record<string, string | number | undefined>[] }
//   const obj = {}
//   for (const [field, fieldSchema] of Object.entries(schema.shape)) {
//     Object.assign(obj, {
//       [field]: { ...getAllPossibleValues(materials.value.allMaterials as MaterialsCollectionItem[], field as keyof MaterialsCollectionItem)
//         .map((val) => {
//           if (val === '*') return
//           const meta = fieldValues.shape?.[val as keyof FieldValuesSchema]?.meta() || fieldValues.shape[field as keyof FieldValuesSchema]?.meta()
//           const fieldGroupId = fieldSchema.meta()?.fieldGroupId
//           const fieldGroupObj = copy.value?.fieldGroups.find((fg: MaterialsLandingCollectionItem['fieldGroups'][number]) => fg.id === fieldGroupId)
//           const step = copy.value?.steps.find((item: MaterialsLandingCollectionItem['steps'][number]) => item.id === fieldGroupObj?.stepId)
//           return {
//             [val]: {
//               items: {
//                 label: meta?.label,
//                 value: val,
//                 description: '',
//                 disabled: false
//               },
//               stepSummary: {
//                 id: field,
//                 attr: fieldGroupObj?.legend || field,
//                 // value: state[key as keyof typeof state] as string | number | undefined,
//                 label: meta?.label,
//                 unit: meta?.unit,
//                 category: fieldGroupObj?.id || '',
//                 step: step?.id
//               }
//             }
//           }
//         })
//       }
//     })
//   }
//   return obj
// })
