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
