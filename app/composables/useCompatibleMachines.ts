import type { MaterialsCollectionItem, MachinesCollectionItem } from '@nuxt/content'
import type { ComputedRef, Reactive } from 'vue'
import type { Schema } from '#imports'

export type MatcherFilterField = 'stiffness' | 'shape' | 'core' | 'reinforced'

type MaterialMatcherMaterial = Pick<MaterialsCollectionItem, 'slug' | 'modelId' | MatcherFilterField>
type MaterialMatcherMachine = Pick<MachinesCollectionItem, 'modelId' | 'machineName' | 'machineId' | 'cutDiameter' | 'cutWidth' | 'cutHeight'>

export interface CompatibleMachine extends MaterialMatcherMachine {
  matchingMaterials: MaterialMatcherMaterial[]
}

export interface MaterialMatcherContext {
  compatibleMachines: ComputedRef<CompatibleMachine[]>
  compatibleMachineIds: ComputedRef<string[]>
  compatibleModelIds: ComputedRef<string[]>
  hasMatchesFor: (field: MatcherFilterField, value: string) => boolean
  isModelCompatible: (modelId?: string) => boolean
}

const filterableFields: MatcherFilterField[] = ['stiffness', 'shape', 'core', 'reinforced']

function isDimensionCompatible(machine: MaterialMatcherMachine, filterState: Partial<Schema>): boolean {
  if (typeof filterState.diameter === 'number') {
    if (typeof machine.cutDiameter !== 'number' || machine.cutDiameter < filterState.diameter) {
      return false
    }
  }
  if (typeof filterState.width === 'number') {
    if (typeof machine.cutWidth !== 'number' || machine.cutWidth < filterState.width) {
      return false
    }
  }
  if (typeof filterState.height === 'number') {
    if (typeof machine.cutHeight !== 'number' || machine.cutHeight < filterState.height) {
      return false
    }
  }
  return true
}

function isMaterialCompatible(material: MaterialMatcherMaterial, filterState: Partial<Schema>): boolean {
  return filterableFields.every((field) => {
    const selected = filterState[field]
    if (!selected) {
      return true
    }
    const materialValue = material[field]
    return materialValue === '*' || materialValue === selected
  })
}

export function useCompatibleMachines(state: Reactive<Partial<Schema>>): MaterialMatcherContext {
  const { data: machinesData } = useAsyncData('machinesData', () => {
    return queryCollection('machines')
      .select('modelId', 'machineName', 'machineId', 'cutDiameter', 'cutWidth', 'cutHeight')
      .all()
  })

  const { data: materialsData } = useAsyncData('materialsMatcherData', () => {
    return queryCollection('materials')
      .select('slug', 'modelId', 'stiffness', 'shape', 'core', 'reinforced')
      .all()
  })

  function getCompatibleMachines(filterState: Partial<Schema>): CompatibleMachine[] {
    const machines = (machinesData.value || []) as MaterialMatcherMachine[]
    const materials = (materialsData.value || []) as MaterialMatcherMaterial[]

    const matchingMaterials = materials.filter(material => isMaterialCompatible(material, filterState))
    const materialsByModel = new Map<string, MaterialMatcherMaterial[]>()

    for (const material of matchingMaterials) {
      const existing = materialsByModel.get(material.modelId) || []
      existing.push(material)
      materialsByModel.set(material.modelId, existing)
    }

    return machines
      .filter(machine => isDimensionCompatible(machine, filterState))
      .map((machine) => {
        const modelMaterials = materialsByModel.get(machine.modelId) || []
        return {
          ...machine,
          matchingMaterials: modelMaterials
        }
      })
      .filter(machine => machine.matchingMaterials.length > 0)
  }

  const compatibleMachines = computed(() => getCompatibleMachines(state))

  const compatibleMachineIds = computed(() => {
    return Array.from(new Set(
      compatibleMachines.value
        .map(machine => machine.machineId)
        .filter((machineId): machineId is string => Boolean(machineId))
    ))
  })

  const compatibleModelIds = computed(() => {
    return Array.from(new Set(
      compatibleMachines.value
        .map(machine => machine.modelId)
        .filter((modelId): modelId is string => Boolean(modelId))
    ))
  })

  function hasMatchesFor(field: MatcherFilterField, value: string): boolean {
    return getCompatibleMachines({
      ...state,
      [field]: value
    }).length > 0
  }

  function isModelCompatible(modelId?: string): boolean {
    if (!modelId) {
      return false
    }
    return compatibleModelIds.value.includes(modelId)
  }

  return {
    compatibleMachines,
    compatibleMachineIds,
    compatibleModelIds,
    hasMatchesFor,
    isModelCompatible
  }
}
