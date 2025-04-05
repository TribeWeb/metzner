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

watchEffect(() => {
  router.replace({ query: state })
})
</script>

<template>
  <ClientOnly>
    <UContainer>
      <UForm
        :state="state"
        :schema="schema"
        class="space-y-4 mb-6"
        @submit="onSubmit"
      >
        <ProseH3 id="bob">
          {{ formItemsCopy?.shape?.category }}
        </ProseH3>
        <Teleport defer to="div#shape > fieldset > div:has(div):has([value*='complex'])">
          <MaterialSvgProfile
            :color="'var(--ui-primary)'"
            class="w-32 transition-opacity duration-300 ease-in-out"
            :class="{ 'opacity-100': state.shape === 'complex',
                      'opacity-20': state.shape === 'round' }"
          />
        </Teleport>
        <Teleport defer to="div#shape > fieldset > div:has(div):has([value*='round'])">
          <MaterialSvgRound
            :color="'var(--ui-secondary)'"
            class="w-32 transition-opacity duration-300 ease-in-out"
            :class="{ 'opacity-100': state.shape === 'round',
                      'opacity-20': state.shape === 'complex' }"
          />
        </Teleport>
        <UFormField name="shape" :label="formItemsCopy?.shape?.legend" :description="formItemsCopy?.shape?.description">
          <UButtonGroup>
            <URadioGroup
              id="shape"
              v-model="state.shape"
              name="shape"
              orientation="horizontal"
              :items="normalizedItems.shape.items"
              :ui="{ root: 'grow',
                     item: 'inline-flex items-center gap-1 rounded-[calc(var(--ui-radius)*1.5)] ring ring-inset ring-(--ui-primary)/50 py-2 px-4',
                     wrapper: 'min-w-18' }"
            />
            <UButton
              v-if="state.shape"
              class="ml-2"
              color="neutral"
              variant="link"
              size="md"
              icon="i-lucide-circle-x"
              aria-label="Clear input"
              @click="delete state.shape"
            />
          </UButtonGroup>
        </UFormField>
        <UFormField name="core" :label="formItemsCopy?.core?.legend" :description="formItemsCopy?.core?.description">
          <CheckboxGroupRoot v-model="state.core">
            <UButtonGroup>
              <UBadge v-for="item in normalizedItems.core.items" :key="item.value" variant="outline" :ui="{ base: 'py-2 px-4 gap-2 rounded-[calc(var(--ui-radius)*1.5)]' }">
                <UCheckbox
                  name="core"
                  :ui="{ root: 'grow', wrapper: 'min-w-22' }"
                  :model-value="state.core?.includes(item.value)"
                  :value="item.value"
                  :label="item.label"
                  :disabled="item.disabled"
                  :description="item.description"
                />
                <MaterialSvgProfile
                  v-if="item.value==='complex'"
                  :color="'var(--ui-primary)'"
                  class="w-32 transition-opacity duration-300 ease-in-out"
                  :class="{ 'opacity-100': state.shape === 'complex',
                            'opacity-20': state.shape === 'round' }"
                />
                <MaterialSvgRound
                  v-else
                  :color="'var(--ui-secondary)'"
                  class="w-32 transition-opacity duration-300 ease-in-out"
                  :class="{ 'opacity-100': state.shape === 'round',
                            'opacity-20': state.shape === 'complex' }"
                />
              </UBadge>
              <UButton
                v-if="state.core && state.core.length > 0"
                class="ml-2"
                color="neutral"
                variant="link"
                size="md"
                icon="i-lucide-circle-x"
                aria-label="Clear input"
                @click="delete state.core"
              />
            </UButtonGroup>
          </CheckboxGroupRoot>
        </UFormField>
        <Teleport
          v-for="item in normalizedItems.reinforced.items"
          :key="item.value"
          defer
          :to="`div#reinforced > fieldset > div:has(div):has([value*='${item.value}'])`"
        >
          <MaterialSvgProfile
            v-if="state.shape==='complex'"
            :reinforced="item.value==='steel'"
            :color="'var(--ui-primary)'"
            class="w-32 transition-opacity duration-300 ease-in-out"
            :class="{ 'opacity-100': !state.reinforced || state.reinforced === item.value,
                      'opacity-20': state.reinforced !== item.value }"
          />
          <MaterialSvgRound
            v-else
            :reinforced="item.value==='steel'"
            :color="'var(--ui-secondary)'"
            class="w-32 transition-opacity duration-300 ease-in-out"
            :class="{ 'opacity-100': !state.reinforced || state.reinforced === item.value,
                      'opacity-20': state.reinforced !== item.value }"
          />
        </Teleport>
        <UFormField name="reinforced" :label="formItemsCopy?.reinforced?.legend" :description="formItemsCopy?.reinforced?.description">
          <UButtonGroup>
            <URadioGroup
              id="reinforced"
              v-model="state.reinforced"
              name="reinforced"
              orientation="horizontal"
              :items="normalizedItems.reinforced.items"
              :ui="{ root: 'grow',
                     item: 'inline-flex items-center gap-1 rounded-[calc(var(--ui-radius)*1.5)] ring ring-inset ring-(--ui-primary)/50 py-2 px-4',
                     wrapper: 'min-w-18' }"
            />
            <UButton
              v-if="state.reinforced"
              class="ml-2"
              color="neutral"
              variant="link"
              size="md"
              icon="i-lucide-circle-x"
              aria-label="Clear input"
              @click="delete state.reinforced"
            />
          </UButtonGroup>
        </UFormField>

        <ProseH3>{{ formItemsCopy?.stiffness?.category }}</ProseH3>
        <Teleport
          v-for="item in normalizedItems.stiffness.items"
          :key="item.value"
          defer
          :to="`div#stiffness > fieldset > div:has(div):has([value*='${item.value}'])`"
        >
          <MaterialSvgReel
            v-if="item.value==='flexible'"
            :color="state.shape==='round' ? 'var(--ui-secondary)' : 'var(--ui-primary)'"
            class="w-32 transition-opacity duration-300 ease-in-out"
            :class="{ 'opacity-100': state.stiffness === 'flexible',
                      'opacity-20': state.stiffness === 'rigid' }"
          />
          <MaterialSvgRollers
            v-else
            :color="state.shape==='round' ? 'var(--ui-secondary)' : 'var(--ui-primary)'"
            class="w-32 transition-opacity duration-300 ease-in-out"
            :class="{ 'opacity-100': state.stiffness === 'rigid',
                      'opacity-20': state.stiffness === 'flexible' }"
          />
        </Teleport>
        <UFormField name="stiffness" :label="formItemsCopy?.stiffness?.legend" :description="formItemsCopy?.stiffness?.description">
          <UButtonGroup>
            <URadioGroup
              id="stiffness"
              v-model="state.stiffness"
              name="stiffness"
              orientation="horizontal"
              :items="normalizedItems.stiffness.items"
              :ui="{ root: 'grow',
                     item: 'inline-flex items-center gap-1 rounded-[calc(var(--ui-radius)*1.5)] ring ring-inset ring-(--ui-primary)/50 py-2 px-4',
                     wrapper: 'min-w-18' }"
            />
            <UButton
              v-if="state.stiffness"
              class="ml-2"
              color="neutral"
              variant="link"
              size="md"
              icon="i-lucide-circle-x"
              aria-label="Clear input"
              @click="delete state.stiffness"
            />
          </UButtonGroup>
        </UFormField>
      </UForm>

      <UButton label="go" @click="go()" />
      <pre>{{ filtered?.length }}</pre>
      <pre>{{ filtered?.map((m) => m.modelId) }}</pre>
    </UContainer>
  </ClientOnly>
</template>

<style scoped>
</style>
