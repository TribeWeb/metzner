<script setup lang="ts">
import type { MaterialMapCollectionItem } from '@nuxt/content'
import { z } from 'zod'
import type { FormSubmitEvent } from '@nuxt/ui'
import { materialMap } from '#imports'

const { headerCopy, formItemsCopy } = defineProps({
  headerCopy: {
    type: Object
  },
  formItemsCopy: {
    type: Object
  }
})

const schema = materialMap.pick({ stiffness: true, shape: true, reinforced: true, core: true })
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

const itemKeys: (keyof MaterialMapCollectionItem)[] = ['shape', 'core', 'reinforced', 'stiffness']
const allKeys: (keyof MaterialMapCollectionItem)[] = [...itemKeys, 'slug', 'type', 'material', 'config', 'modelId', 'modelName']

const toast = useToast()
async function onSubmit(event: FormSubmitEvent<Schema>) {
  toast.add({ title: 'Success', description: 'The form has been submitted.', color: 'success' })
  console.log(event.data)
}

const { data: materials } = await useAsyncData('materials', () => {
  return queryCollection('materialMap')
    .select(...allKeys)
    .all()
})

// TODO: create a method which filters the list of `materials` based on the provided current `state`, a `state` property and an associated value.
// It should return the count of unique modelIds and an array of values that are still present in the filtered list.
// It should adjust the filter based on the type of the `state` property (e.g. use `some` for arrays, `===` for strings, if undefined then skip etc.)
// If provided, the `state` property and value should be added to the filter even if the `state` property is not present in the `schema`.

function filter(
  materials: MaterialMapCollectionItem[] = [],
  filterState: Partial<Schema>
): MaterialMapCollectionItem[] {
  return materials?.filter((m) => {
    return Object.entries(filterState).every(([key, filterValue]) => {
      if (filterValue === undefined) return true
      if (Array.isArray(filterValue) && filterValue.length === 0) return true

      const itemValue = m[key as keyof MaterialMapCollectionItem]

      // Handle array values (like 'core')
      if (Array.isArray(itemValue)) {
        if (state.shape === 'round' && (state.core ?? []).length === 1 && !(state.core ?? []).includes(itemValue[0] as 'hollow' | 'solid')) {
          return false
        }
        return Array.isArray(filterValue)
          ? (itemValue as string[]).some(v => (filterValue as string[]).includes(v))
          : (itemValue as string[]).includes(filterValue)
      }

      // Handle special case for wildcard
      if (itemValue === '*') return true

      // Handle simple value comparison
      return itemValue === filterValue
    })
  }) || []
}

function getMaterialsResults(
  materials: MaterialMapCollectionItem[] = [],
  currentState: Partial<Schema> = {},
  property?: keyof MaterialMapCollectionItem,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  value?: any
) {
  const filterState = { ...currentState }

  if (property && value !== undefined) {
    filterState[property as keyof Schema] = value
  }

  const filtered = filter(materials, filterState)

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
  const map = itemKeys.map((key: keyof MaterialMapCollectionItem) => {
    return {
      [key]: {
        items: getAllPossibleValues(materials.value as MaterialMapCollectionItem[], key).map((val) => {
          if (val === '*') return
          const filtered = getMaterialsResults(materials.value, state, key, val)
          return {
            label: String(val).charAt(0).toUpperCase() + String(val).slice(1),
            value: val,
            description: `(${filtered.count} of ${getMaterialsResults(materials.value, { [key]: val }).count} machines)`,
            disabled: filtered.count < 1 ? true : false
          }
        }).filter(Boolean)
      }
    }
  })
  return Object.assign({}, ...map)
})

const filtered = computed(() => {
  return getMaterialsResults(materials.value, state)
})

function getAllPossibleValues(allValues: MaterialMapCollectionItem[], key: keyof MaterialMapCollectionItem): string[] {
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
            :items="normalizedItems.core.items"
            :ui="{
              // eslint-disable-next-line @stylistic/max-len
              item: 'p-3.5 border border-muted first-of-type:rounded-t-lg last-of-type:rounded-b-lg has-data-[state=checked]:bg-primary/10 has-data-[state=checked]:border-primary/50 has-data-[state=checked]:z-[1]',
              fieldset: 'gap-y-0 -space-y-px'
            }"
          >
            <template #label="{ item }">
              <span>{{ typeof item === 'object' && 'label' in item ? item.label : item }} </span>
              <UIcon
                :name="`c-${state.shape || 'round'}-${typeof item === 'object' && 'value' in item ? item.value : item}-none`"
                class="absolute top-2 right-6 size-12 text-muted"
                :class="{
                  'bg-primary':
                    state.core?.includes(
                      (typeof item === 'object' && 'value' in item && item.value !== undefined
                        ? item.value
                        : item) as 'hollow' | 'solid'
                    )
                }"
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
    </UForm>

    <pre>{{ filtered.count }}</pre>
    <pre>{{ filtered.modelIds }}</pre>
    <pre>{{ filtered.remainingValues }}</pre>
    <pre>{{ filtered.filtered }}</pre>
    <!-- <pre>{{ filtered?.length }}</pre>
    <pre>{{ filtered?.map((m) => m.modelId) }}</pre> -->
  </UContainer>
</template>

<style scoped>
</style>
