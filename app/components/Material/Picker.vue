<script setup lang="ts">
import type { MaterialMapCollectionItem } from '@nuxt/content'
import type { z } from 'zod'
import type { FormSubmitEvent } from '@nuxt/ui'
import { CheckboxGroupRoot } from 'reka-ui'
import { materialMap } from '#imports'

const { headerCopy, formItemsCopy } = defineProps({
  headerCopy: {
    type: Object
  },
  formItemsCopy: {
    type: Object
  }
})

const schema = materialMap.pick({ type: true, stiffness: true, shape: true, reinforced: true, core: true, material: true })
export type Schema = z.output<typeof schema>

const state = reactive<Partial<Schema>>({})

const router = useRouter()
const route = useRoute()
// this.$router.replace({ ...this.$router.currentRoute, query: this.filters });
function go() {
  router.push({ query: state })
  // router.replace({ ...router.currentRoute, query: state })
}

onMounted(() => {
  const parsedRoute = route.query
  Object.assign(state, parsedRoute)
})

const keys: (keyof MaterialMapCollectionItem)[] = ['slug', 'type', 'stiffness', 'shape', 'core', 'material', 'config', 'reinforced', 'modelId', 'modelName']

const toast = useToast()
async function onSubmit(event: FormSubmitEvent<Schema>) {
  toast.add({ title: 'Success', description: 'The form has been submitted.', color: 'success' })
  console.log(event.data)
}

const { data: materials } = await useAsyncData('materials', () => {
  return queryCollection('materialMap')
    .select(...keys)
    .all()
})

const normalizedItems = computed(() => {
  const map = keys.map((key: keyof MaterialMapCollectionItem) => {
    return {
      [key]: {
        disabled: getAllPossibleValues(key).map((val) => {
          return countValues(filtered.value, key, val) === 0
        }).some(Boolean),
        items: getAllPossibleValues(key).map((val) => {
          if (val === '*') return
          return {
            label: String(val).charAt(0).toUpperCase() + String(val).slice(1),
            value: val,
            description: `(${countValues(filtered.value, key, val)} of ${countValues(materials.value, key, val)})`,
            disabled: filtered.value?.length < 2 ? true : false
          }
        }).filter(Boolean)
      }
    }
  })
  return Object.assign({}, ...map)
})

const filtered = computed(() => {
  return materials.value?.filter((m) => {
    return (state.stiffness ? m.stiffness === state.stiffness || m.stiffness === '*' : true)
      && (state.shape ? m.shape === state.shape : true)
      && (state.type ? m.type === state.type : true)
      && (state.core && state.core.length > 0 ? m.core.some(val => state.core?.includes(val)) : true)
      && (state.reinforced ? m.reinforced === state.reinforced : true)
  }) || []
})

function getAllPossibleValues(key: keyof MaterialMapCollectionItem): string[] {
  const values = materials.value?.map((item) => {
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

function countValues(objArr = {} as MaterialMapCollectionItem[], key: keyof MaterialMapCollectionItem, value: string): number {
  if (!value || !objArr) return 0
  const values = objArr.map((item) => {
    const val = key in item ? item[key] : undefined
    if (Array.isArray(val)) {
      return val.some(v => value?.includes(v))
    } else {
      return val === value
    }
  })
  return values.filter(x => x === true).length
}
</script>

<template>
  <UContainer class="flex flex-row w-full gap-6">
    <UCard variant="outline" class="basis-1/2">
      <template #header>
        <ProseH2>{{ headerCopy?.title }}</ProseH2>
        <ProseP>{{ headerCopy?.description }}</ProseP>
      </template>
      <UForm
        :state="state"
        :schema="schema"
        class="space-y-4 mb-6"
        @submit="onSubmit"
      >
        <ProseH3>{{ formItemsCopy?.shape?.category }}</ProseH3>
        <UFormField name="shape" :label="formItemsCopy?.shape?.legend" :description="formItemsCopy?.shape?.description">
          <!-- <UTabs v-model="state.shape" :items="normalizedItems.shape.items" /> -->

          <UBadge variant="outline" :ui="{ base: 'py-2 px-4 min-w-84' }">
            <template #trailing>
              <UButton
                :disabled="!state.shape"
                color="neutral"
                variant="link"
                size="sm"
                icon="i-lucide-circle-x"
                aria-label="Clear input"
                @click="state.shape = undefined"
              />
            </template>
            <URadioGroup
              v-model="state.shape"
              orientation="horizontal"
              :items="normalizedItems.shape.items"
              :ui="{ root: 'grow', item: 'basis-1/2' }"
              :disabled="normalizedItems.shape.disabled"
            />
          </UBadge>
        </UFormField>
        <UFormField name="core" :label="formItemsCopy?.core?.legend" :description="formItemsCopy?.core?.description">
          <CheckboxGroupRoot
            v-model="state.core"
          >
            <UButtonGroup>
              <UBadge variant="outline" :ui="{ base: 'py-2 px-4 min-w-84' }">
                <template #trailing>
                  <UButton
                    :disabled="!state.core"
                    color="neutral"
                    variant="link"
                    size="sm"
                    icon="i-lucide-circle-x"
                    aria-label="Clear input"
                    @click="state.core = []"
                  />
                </template>
                <UCheckbox
                  v-for="item in normalizedItems.core.items"
                  :key="item.value"
                  name="core"
                  :ui="{ root: 'grow' }"
                  :model-value="state.core?.includes(item.value)"
                  :value="item.value"
                  :label="item.label"
                  :disabled="item.disabled"
                  :description="item.description"
                />
              </UBadge>
            </UButtonGroup>
          </CheckboxGroupRoot>
        </UFormField>
        <UFormField name="reinforced" :label="formItemsCopy?.reinforced?.legend" :description="formItemsCopy?.reinforced?.description">
          <UBadge variant="outline" :ui="{ base: 'py-2 px-4 min-w-84' }">
            <template #trailing>
              <UButton
                :disabled="!state.reinforced"
                color="neutral"
                variant="link"
                size="sm"
                icon="i-lucide-circle-x"
                aria-label="Clear input"
                @click="state.reinforced = undefined"
              />
            </template>
            <URadioGroup
              v-model="state.reinforced"
              name="reinforced"
              orientation="horizontal"
              :items="normalizedItems.reinforced.items"
              :ui="{ root: 'grow', item: 'basis-1/2' }"
            />
          </UBadge>
        </UFormField>
        <ProseH3>{{ formItemsCopy?.stiffness?.category }}</ProseH3>
        <UFormField name="stiffness" :label="formItemsCopy?.stiffness?.legend" :description="formItemsCopy?.stiffness?.description">
          <UBadge variant="outline" :ui="{ base: 'py-2 px-4 min-w-84' }">
            <template #trailing>
              <UButton
                :disabled="!state.stiffness"
                color="neutral"
                variant="link"
                size="sm"
                icon="i-lucide-circle-x"
                aria-label="Clear input"
                @click="state.stiffness = undefined"
              />
            </template>
            <URadioGroup
              v-model="state.stiffness"
              name="stiffness"
              orientation="horizontal"
              :items="normalizedItems.stiffness.items"
              :ui="{ root: 'grow', item: 'basis-1/2' }"
            />
          </UBadge>
        </UFormField>
      </UForm>
      <UButton label="go" @click="go()" />
      <pre>{{ filtered?.length }}</pre>
      <pre>{{ filtered?.map((m) => m.modelId) }}</pre>
    </UCard>
    <UCard variant="subtle" class="basis-1/2">
      <MaterialSvgViewer :shapes="state" />
      <MaterialSvgReel :shape="state.shape || 'complex'" />
      <MaterialSvgRollers :shape="state.shape || 'complex'" />
    </UCard>
  </UContainer>
</template>

<style scoped>
</style>
