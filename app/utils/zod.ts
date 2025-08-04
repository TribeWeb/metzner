import type { z } from 'zod'
import type { MaterialsCollectionItem } from '@nuxt/content'

export function capitaliseFirstLetter(val: string) {
  return String(val).charAt(0).toUpperCase() + String(val).slice(1)
}

export function flatten(obj: MaterialsCollectionItem, prefix = '') {
  return Object.entries(obj).reduce((acc: Record<string, unknown>, [key, value]) => {
    const newKey = prefix ? `${prefix}${capitaliseFirstLetter(key)}` : key
    if (typeof value === 'object' && !Array.isArray(value)) { // flatten objects but not arrays
      Object.entries(flatten(value, newKey)).forEach(([subkey, subval]) => {
        acc[subkey] = subval
      })
    } else {
      acc[newKey] = value
    }
    return acc
  }, {})
}

export function isZodObject(schema: z.ZodTypeAny): schema is z.AnyZodObject {
  if (schema._def.typeName === 'ZodObject') return true

  return false
}

export function isZodArray(schema: z.ZodTypeAny): schema is z.AnyZodObject {
  if (schema._def.typeName === 'ZodArray') return true

  return false
}

export function zodWrapType(schema: z.ZodTypeAny): string {
  if ('innerType' in schema._def) return schema._def.typeName

  return ''
}

export function pickArray(schema: z.ZodTypeAny): z.ZodTypeAny {
  if (!isZodArray(schema)) throw Error('Not a Zod Array')

  const newSchema = (schema as unknown as z.ZodArray<z.ZodTypeAny>).element
  if (!newSchema) throw Error('No element on Zod Array')

  return newSchema
}

export function pickObject(schema: z.ZodTypeAny, path: string): z.ZodTypeAny {
  if (!isZodObject(schema) && !('innerType' in schema._def && isZodObject(schema._def.innerType))) throw Error('Not a zod object')

  const shape = (schema as z.AnyZodObject).shape || (schema._def.innerType as z.AnyZodObject).shape
  const newSchema = shape?.[path]

  if (!newSchema) throw Error(`${path} does not exist on schema with keys: ${Object.keys((schema as z.AnyZodObject).shape || (schema._def.innerType as z.AnyZodObject).shape)}`)

  return newSchema
}

export function pickObject1(schema: z.ZodTypeAny, path: string): z.ZodTypeAny {
  if (!isZodObject(schema)) throw Error('Not a zod object')

  const newSchema = schema.shape?.[path]
  if (!newSchema) throw Error(`${path} does not exist on schema with keys: ${Object.keys(schema.shape)}`)

  return newSchema
}

export function zodDeepPick(schema: z.ZodTypeAny, propertyPath: string): z.ZodTypeAny {
  if (propertyPath === '') return schema

  const numberRegex = new RegExp('[[0-9]+]')

  const arrayIndex = propertyPath.search(numberRegex)
  const objectIndex = propertyPath.indexOf('.')

  const matchedArray = arrayIndex !== -1
  const matchedObject = objectIndex !== -1

  if ((matchedArray && matchedObject && arrayIndex < objectIndex) || (matchedArray && !matchedObject)) {
    const arraySplit = propertyPath.split(numberRegex)
    const restArray = arraySplit.slice(1, arraySplit.length).join('[0]')

    if (arrayIndex !== 0) {
      return zodDeepPick(pickObject(schema, arraySplit[0] || ''), `[0]${restArray}`)
    }

    return zodDeepPick(
      pickArray(schema),
      restArray.charAt(0) === '.' ? restArray.slice(1, restArray.length) : restArray
    )
  }

  if (matchedObject) {
    const objectSplit = propertyPath.split('.')
    const restObject = objectSplit.slice(1, objectSplit.length).join('.')

    return zodDeepPick(pickObject(schema, objectSplit[0] || ''), restObject)
  }

  return pickObject(schema, propertyPath)
}
