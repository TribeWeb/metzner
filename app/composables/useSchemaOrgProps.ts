import type { MachinesCollectionItem } from '@nuxt/content'

export type SchemaOrgPropOptions = {
  schemaType?: 'hasMeasurement' | 'additionalProperty'
}

export function useSchemaOrgProps(machine: MachinesCollectionItem, options: SchemaOrgPropOptions) {
  const {
    schemaType = 'hasMeasurement'
  } = options
  const productNodes = useAppConfig().schemaOrg.product || {}
  const schemaObjects = productNodes[schemaType] || []

  return schemaObjects.map((field) => {
    const value = machine[field.value as keyof MachinesCollectionItem]
    if (value === undefined || value === null || value === '') {
      return null
    }

    return {
      '@type': field['@type'] || undefined,
      'name': field.name || undefined,
      'description': field?.description || undefined,
      'value': `${value}${field.unitText}`,
      'unitText': schemaType === 'hasMeasurement' ? field.unitText || undefined : undefined,
      'unitCode': schemaType === 'hasMeasurement' ? field.unitCode || undefined : undefined
    }
  }).filter(item => item !== null)
}

export function useSpecification(machine: MachinesCollectionItem) {
  const specification = useAppConfig().pageConfig.product.specification || []
  const hasMeasurement = useSchemaOrgProps(machine, { schemaType: 'hasMeasurement' }).map(({ name, value, description }) => ({ name, value, description }))
  const additionalProperty = useSchemaOrgProps(machine, { schemaType: 'additionalProperty' }).map(({ name, value, description }) => ({ name, value, description }))

  const tableTop = specification.map((field) => {
    const value = machine[field.id as keyof MachinesCollectionItem]
    if (value === undefined || value === null || value === '') {
      return null
    }

    return {
      name: field.name,
      value: value,
      description: ''
    }
  })

  return [...tableTop, ...additionalProperty, ...hasMeasurement].filter(item => item !== null)
}
