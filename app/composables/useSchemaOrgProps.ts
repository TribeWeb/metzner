import type { MachinesCollectionItem } from '@nuxt/content'

export function useSchemaOrgProps(machine: MachinesCollectionItem) {
  const schemaOrgProps = useAppConfig().schemaOrg1

  return schemaOrgProps.map((prop) => {
    const value = machine[prop.value as keyof MachinesCollectionItem]
    if (value === undefined || value === null || value === '') {
      return null
    }

    return {
      '@type': prop['@type'] || undefined,
      'name': prop.name || undefined,
      'description': prop?.description || undefined,
      'value': `${value}${prop.unitText}`,
      'unitText': prop.unitText || undefined,
      'unitCode': prop.unitCode || undefined,
      'schema': prop.schema || undefined
    }
  }).filter(prop => prop !== null)
}

// export function useSchemaOrgProps1(machine: MachinesCollectionItem) {
//   const schemaOrgProps = useAppConfig().schemaOrg

//   return schemaOrgProps.map((prop) => {
//     const value = machine[prop.value as keyof MachinesCollectionItem]
//     if (value === undefined || value === null || value === '') {
//       return null
//     }

//     return {
//       '@type': prop['@type'] || undefined,
//       'name': prop.name || undefined,
//       'description': prop?.description || undefined,
//       'value': `${value}${prop.unitText}`,
//       'unitText': prop.unitText || undefined,
//       'unitCode': prop.unitCode || undefined,
//       'schema': prop.schema || undefined
//     }
//   }).filter(prop => prop !== null)
// }
