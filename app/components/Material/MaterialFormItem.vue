<script setup lang="ts">
import type { MaterialsLandingCollectionItem } from '@nuxt/content'
import type { FieldGroupItem, Schema } from '#imports'
import type { RadioGroupItem } from '@nuxt/ui'
import type { MatcherFilterField, MaterialMatcherContext } from '~/composables/useCompatibleMachines'

const props = withDefaults(defineProps<{
  fieldObject?: FieldGroupItem
  colSpan?: number
  colStart?: number
}>(), {
  colSpan: 1
})

const stateProp = defineModel<string | number | undefined>()

const state = inject<Partial<Schema>>('state')!
const materialMatcher = inject<MaterialMatcherContext | null>('materialMatcher', null)

const allItems = useItems.value
const matcherFields: MatcherFilterField[] = ['shape', 'core', 'reinforced', 'stiffness']

const filteredItems = computed<RadioGroupItem[]>(() => {
  const fieldId = props.fieldObject?.id
  const items = allItems.filter(item => item.fieldId === fieldId) as RadioGroupItem[]

  if (!fieldId || !materialMatcher || !matcherFields.includes(fieldId as MatcherFilterField)) {
    return items
  }

  return items.map((item) => {
    if (!item || typeof item !== 'object') {
      return item
    }

    const itemValue = 'value' in item ? item.value : undefined
    if (itemValue === undefined) {
      return item
    }

    const isSelected = stateProp.value === itemValue
    const isCompatible = materialMatcher.hasMatchesFor(fieldId as MatcherFilterField, String(itemValue))

    return {
      ...item,
      disabled: isSelected ? false : !isCompatible
    }
  })
})

const { data: copy } = useNuxtData('materialsCopy')

const fieldGroupObject = computed(() => {
  return copy.value?.fieldGroup.find((fieldGroup: MaterialsLandingCollectionItem['fieldGroup'][number]) =>
    fieldGroup.id === props.fieldObject?.fieldGroupId)
})

const question = computed(() => {
  return copy.value?.questions.find((question: MaterialsLandingCollectionItem['questions'][number]) =>
    question.fieldId === props.fieldObject?.id)?.question
})

function formIconString(currentValue: unknown): string {
  const iconValue = ['string', 'number', 'bigint'].includes(typeof currentValue)
    ? String(currentValue)
    : 'none'

  const iconStrings = {
    shape: `c-${iconValue}-hollow-none`,
    core: `c-${state.shape || 'complex'}-${iconValue || 'hollow'}-none`,
    reinforced: `c-${state.shape || 'round'}-${state.core || 'hollow'}-${iconValue || 'none'}`,
    stiffness: `c-${iconValue}`
  }
  return iconStrings[props.fieldObject?.id as keyof typeof iconStrings] || `c-${iconValue}-hollow-none`
}
</script>

<template>
  <UCard
    variant="soft"
    :class="{ 'col-span-1': colSpan === 1,
              'col-span-2': colSpan === 2,
              'lg:col-start-2': colStart === 2 }"
    :ui="{ body: 'h-full' }"
  >
    <UFormField
      :name="fieldObject?.id"
      :description="question"
      :ui="{ label: 'w-full flex justify-between',
             description: 'pt-1 pb-3',
             root: 'h-full flex flex-col justify-between'
      }"
    >
      <template #label>
        <h3> {{ fieldObject?.label }} </h3>
        <UBadge size="md" variant="soft" :label="fieldGroupObject?.legend" class="block" />
      </template>
      <slot>
        <URadioGroup
          v-model="stateProp"
          :name="fieldObject?.id"
          :items="filteredItems"
          variant="table"
          size="md"
          :ui="{ label: 'relative' }"
        >
          <template #label="{ item: { label, value } }">
            <span>{{ label }}</span>
            <UIcon
              :name="formIconString(value)"
              class="absolute -top-2 right-0 size-9 text-muted"
              :class="{ 'bg-primary text-primary': stateProp === value }"
            />
          </template>
          <slot name="label" v-bind="{ items: filteredItems }" />
          <template #description="{ item: { description } }">
            <span class="italic">{{ description }}</span>
          </template>
        </URadioGroup>
      </slot>
    </UFormField>
  </UCard>
</template>
