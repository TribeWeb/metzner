<script setup lang="ts">
import type { MaterialsCollectionItem } from '@nuxt/content'
import { z } from 'zod'
import type { FormSubmitEvent } from '@nuxt/ui'
import { materials, machines } from '#imports'

const { headerCopy, formItemsCopy } = defineProps({
  headerCopy: {
    type: Object
  },
  formItemsCopy: {
    type: Object
  }
})

const mergedCollectionItem = z.object({ ...materials.shape, ...machines.shape })
export type MergedCollectionItem = z.output<typeof mergedCollectionItem>

const machineSchema = machines.pick({ cutDiameter: true, cutWidthMax: true, cutHeightMax: true })
const materialSchema = materials.pick({ stiffness: true, shape: true, reinforced: true, core: true })

const schema = z.object({ ...machineSchema.shape, ...materialSchema.shape })

export type Schema = z.output<typeof schema>

const state = reactive<Partial<Schema>>({})

const coreSchema = z.array(z.union([z.literal('hollow'), z.literal('solid')])).optional()
const querySchema = schema.omit({ core: true })
  .extend({ core: z.preprocess((val) => {
    return typeof val === 'string' ? [val] : val
  }, coreSchema) })

const route = useRoute()

onMounted(() => {
  const parsedRoute = querySchema.parse(route.query) as Partial<Schema>
  Object.assign(state, parsedRoute)
})

const router = useRouter()
watchEffect(() => {
  router.replace({ query: state })
})

const itemKeys: (keyof MaterialsCollectionItem)[] = ['shape', 'core', 'reinforced', 'stiffness']
const allKeys: (keyof MaterialsCollectionItem)[] = [...itemKeys, 'slug', 'type', 'material', 'config', 'modelId', 'modelName']

const toast = useToast()
async function onSubmit(event: FormSubmitEvent<Schema>) {
  toast.add({ title: 'Success', description: 'The form has been submitted.', color: 'success' })
  console.log(event.data)
}

const { data } = await useAsyncData(route.path, () => Promise.all([
  queryCollection('materials')
    .select(...allKeys)
    .all(),
  queryCollection('machines')
    .select('modelId', 'machineName', 'machineId', 'cutDiameter', 'cutWidthMax', 'cutHeightMax')
    .all()
]), {
  transform: ([allMaterials, allMachines]) => ({ allMaterials, allMachines })
})

const allMaterials = computed(() => data.value?.allMaterials)
const allMachines = computed(() => data.value?.allMachines)

// TODO merge materials and allMachines into a single collection where the key on which to join is `modelId`.
// The merge should behave as if it was an outer join so if a machine has several matching materials,
// it should should crate a new entry where the new key is a concatenation of machineId and slug.

const mergedCollection = computed<MergedCollectionItem[]>(() => {
  if (!allMaterials.value || !allMachines.value) return []

  return allMachines.value.flatMap((machine) => {
    const matchingMaterials = allMaterials.value.filter(
      material => material.modelId === machine.modelId
    )

    // If no matching materials, include machine with basic info

    // TODO return error instead - it shouldn't happen that a machine has no matching materials
    if (matchingMaterials.length === 0) {
      return [{
        ...machine,
        id: `${machine.machineId}-none`
      }]
    }

    // Create merged entries for each matching material
    return matchingMaterials.map(material => ({
      ...material,
      ...machine,
      id: `${machine.machineId}-${material.slug}`
    }))
  })
})

// TODO: create a method which filters the list of `materials` based on the provided current `state`, a `state` property and an associated value.
// It should return the count of unique modelIds and an array of values that are still present in the filtered list.
// It should adjust the filter based on the type of the `state` property (e.g. use `some` for arrays, `===` for strings, if undefined then skip etc.)
// If provided, the `state` property and value should be added to the filter even if the `state` property is not present in the `schema`.

function filter(
  mergedCollection: MergedCollectionItem[] = [],
  filterState: Partial<Schema>
): MergedCollectionItem[] {
  return mergedCollection?.filter((m) => {
    return Object.entries(filterState).every(([key, filterValue]) => {
      if (filterValue === undefined) return true
      if (Array.isArray(filterValue) && filterValue.length === 0) return true
      // console.log(m)
      const itemValue = m[key as keyof MergedCollectionItem]

      // Handle array values (like 'core')
      if (Array.isArray(itemValue)) {
        if (state.shape === 'round' && (state.core ?? []).length === 1 && !(state.core ?? []).includes(itemValue[0] as 'hollow' | 'solid')) {
          return false
        }
        return Array.isArray(filterValue)
          ? (itemValue as string[]).some(v => (filterValue as string[]).includes(v))
          : (itemValue as string[]).includes(String(filterValue))
      }

      // Handle special case for wildcard
      if (itemValue === '*') return true

      // console.log('key', key, 'itemValue', itemValue, 'filterValue', filterValue)
      // Handle number values (like 'cutDiameter')
      if (typeof itemValue === 'number' && typeof filterValue === 'number') {
        return itemValue >= filterValue
      }

      // Handle simple value comparison
      return itemValue === filterValue
    })
  }) || []
}

function getMaterialsResults(
  mergedCollection: MergedCollectionItem[] = [],
  currentState: Partial<Schema> = {},
  property?: keyof MergedCollectionItem,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  value?: any
) {
  const filterState = { ...currentState }

  if (property && value !== undefined) {
    filterState[property as keyof Schema] = value
  }

  const filtered = filter(mergedCollection, filterState)

  // Get unique model IDs from filtered results
  const uniqueModelIds = Array.from(new Set(filtered.map(item => item.modelId)))

  // Get all possible values for the specified property in filtered results
  const remainingValues = property
    ? Array.from(new Set(filtered.map((item) => {
        const val = item[property]
        return Array.isArray(val) ? val : [val]
      }).flat()))
    : []

  return {
    count: uniqueModelIds.length,
    modelIds: uniqueModelIds,
    remainingValues,
    filtered
  }
}

const normalizedItems = computed(() => {
  const map = itemKeys.map((key: keyof MaterialsCollectionItem) => {
    return {
      [key]: {
        items: getAllPossibleValues(allMaterials.value as MaterialsCollectionItem[], key).map((val) => {
          if (val === '*') return
          const filtered = getMaterialsResults(mergedCollection.value, state, key, val)
          return {
            label: String(val).charAt(0).toUpperCase() + String(val).slice(1),
            value: val,
            description: `(${filtered.count} of ${getMaterialsResults(mergedCollection.value, { [key]: val }).count} machines)`,
            disabled: filtered.count < 1 ? true : false
          }
        }).filter(Boolean)
      }
    }
  })
  return Object.assign({}, ...map)
})

const filtered = computed(() => {
  return getMaterialsResults(mergedCollection.value, state)
})

function getAllPossibleValues(allValues: MaterialsCollectionItem[], key: keyof MaterialsCollectionItem): string[] {
  const values = allValues?.map((item) => {
    const val = item[key]
    if (val === null || val === undefined) {
      return []
    }
    if (Array.isArray(val)) {
      return val
    } else {
      return [String(val)]
    }
  }).flat()
  return Array.from(new Set(values))
}
</script>

<template>
  <UContainer>
    <UForm
      :state="state"
      :schema="schema"
      class="space-y-4 mb-6"
      @submit="onSubmit"
    >
      <ProseH2>
        {{ headerCopy?.title }}
      </ProseH2>
      <ProseP>
        {{ headerCopy?.description }}
      </ProseP>
      <ProseH3>
        {{ formItemsCopy?.shape?.category }}
      </ProseH3>
      <div class="flex flex-row gap-8 flex-wrap">
        <UFormField name="shape" :label="formItemsCopy?.shape?.legend" :description="formItemsCopy?.shape?.description" :ui="{ root: 'sm:w-96', description: 'pt-1 pb-3' }">
          <URadioGroup
            v-model="state.shape"
            name="shape"
            :items="normalizedItems.shape.items"
            variant="table"
            :ui="{ label: 'relative' }"
          >
            <template #label="{ item }">
              <span class="italic">{{ typeof item === 'object' && 'label' in item ? item.label : item }}</span>
              <UIcon
                :name="`c-${typeof item === 'object' && 'value' in item ? item.value : item}-hollow-none`"
                class="absolute -top-1 right-3 size-12 text-muted"
                :class="{
                  'bg-primary':
                    state.shape === (typeof item === 'object' && 'value' in item ? item.value : item)
                }"
              />
            </template>
            <template #description="{ item }">
              <span class="italic">{{ typeof item === 'object' && 'description' in item ? item.description : item }}</span>
            </template>
          </URadioGroup>
        </UFormField>
        <UFormField
          name="core"
          :label="formItemsCopy?.core?.legend"
          :description="formItemsCopy?.core?.description"
          :ui="{ root: 'sm:w-96', description: 'pt-1 pb-3' }"
        >
          <UCheckboxGroup
            v-model="state.core"
            name="core"
            orientation="vertical"
            variant="table"
            :items="normalizedItems.core.items"
          >
            <template #label="{ item }">
              <span>{{ typeof item === 'object' && 'label' in item ? item.label : item }} </span>
              <UIcon
                :name="`c-${state.shape || 'round'}-${typeof item === 'object' && 'value' in item ? item.value : item}-none`"
                class="absolute top-2 right-6 size-12 text-muted"
                :class="{ 'bg-primary': state.core?.includes((typeof item === 'object' && 'value' in item && item.value !== undefined ? item.value : item) as 'hollow' | 'solid') }"
              />
            </template>
            <template #description="{ item }">
              <span class="italic">{{ typeof item === 'object' && 'description' in item ? item.description : item }}</span>
            </template>
          </UCheckboxGroup>
        </UFormField>
        <UFormField
          name="reinforced"
          :label="formItemsCopy?.reinforced?.legend"
          :description="formItemsCopy?.reinforced?.description"
          :ui="{ root: 'sm:w-96', description: 'pt-1 pb-3' }"
        >
          <URadioGroup
            v-model="state.reinforced"
            name="reinforced"
            :items="normalizedItems.reinforced.items"
            variant="table"
            :ui="{ label: 'relative' }"
          >
            <template #label="{ item }">
              <span>{{ typeof item === 'object' && 'label' in item ? item.label : item }}</span>
              <UIcon
                :name="`c-${state.shape || 'round'}-${state.core?.sort().join('-') || 'hollow'}-${typeof item === 'object' && 'value' in item ? item.value : item || 'none'}`"
                class="absolute -top-1 right-3 size-12 text-muted"
                :class="{ 'bg-primary': state.reinforced === (typeof item === 'object' && 'value' in item ? item.value : item) }"
              />
            </template>
            <template #description="{ item }">
              <span class="italic">{{ typeof item === 'object' && 'description' in item ? item.description : item }}</span>
            </template>
          </URadioGroup>
        </UFormField>
      </div>
      <ProseH3>{{ formItemsCopy?.stiffness?.category }}</ProseH3>
      <UFormField
        name="stiffness"
        :label="formItemsCopy?.stiffness?.legend"
        :description="formItemsCopy?.stiffness?.description"
        :ui="{ root: 'sm:w-96', description: 'pt-1 pb-3' }"
      >
        <URadioGroup
          v-model="state.stiffness"
          name="stiffness"
          :items="normalizedItems.stiffness.items"
          variant="table"
          :ui="{ label: 'relative' }"
        >
          <template #label="{ item }">
            <span class="italic">{{ typeof item === 'object' && 'label' in item ? item.label : item }}</span>
            <UIcon
              :name="`c-${typeof item === 'object' && 'value' in item ? item.value : item}`"
              class="absolute -top-3 right-0 h-16 w-32 text-muted"
              :class="{ 'bg-primary': state.stiffness === (typeof item === 'object' && 'value' in item ? item.value : item) }"
            />
          </template>
          <template #description="{ item }">
            <span class="italic">{{ typeof item === 'object' && 'description' in item ? item.description : item }}</span>
          </template>
        </URadioGroup>
      </UFormField>
      <ProseH3>{{ formItemsCopy?.cutDiameter?.category }}</ProseH3>
      <UFormField
        name="cutDiameter"
        :label="formItemsCopy?.cutDiameter?.legend"
        :description="formItemsCopy?.cutDiameter?.description"
        :ui="{ root: 'sm:w-96', description: 'pt-1 pb-3' }"
      >
        <MaterialDiameter
          v-model="state.cutDiameter"
          :machines="allMachines"
        />
      </UFormField>
    </UForm>

    <pre>{{ filtered.count }}</pre>
    <!-- <pre style="color: blue">{{ filtered.modelIds }}</pre> -->
    <!-- <pre>{{ filtered.remainingValues }}</pre>
    <pre>{{ filtered.filtered }}</pre> -->
    <!-- <pre>{{ filtered?.length }}</pre>
    <pre>{{ filtered?.map((m) => m.modelId) }}</pre> -->
  </UContainer>
</template>

<style scoped>
</style>
