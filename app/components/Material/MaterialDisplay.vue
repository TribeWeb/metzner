<script setup lang="ts">
import type { StepperItem } from '@nuxt/ui'
import type { Reactive } from 'vue'
import type { MaterialsLandingCollectionItem } from '@nuxt/content'
import type { FieldGroupItem, Schema, SchemaKey } from '#imports'

const state = inject<Reactive<Partial<Schema>>>('state')!

const router = useRouter()
watchEffect(() => {
  if (state.shape === 'round') {
    state.width = undefined
    state.height = undefined
  }
  else {
    state.diameter = undefined
  }
  router.replace({ query: state })
})

const { data: copy } = await useAsyncData('materialsCopy', () => {
  return queryCollection('materialsLanding').select('fieldGroup', 'questions').first()
})

const { data: machinesData } = useNuxtData('machinesData')

const fieldGroups = useFieldGroups.value
const items = useItems.value

const icons = computed<Record<string, string>>(() => {
  return {
    crossSection: `c-${state.shape ? state.shape : 'round'}-${state.core ? state.core : 'hollow'}-${state.reinforced ? state.reinforced : 'none'}`,
    longSection: `c-${state.stiffness ? state.stiffness : 'flexible'}`,
    dimensions: `${state.shape === 'round' ? 'diameter' : 'widthHeight'}`,
  }
})

const activeSteps = computed<FieldGroupItem[]>(() => {
  const activeKeys = new Set(
    (Object.keys(state) as SchemaKey[])
      .filter(key => state[key] !== undefined),
  )
  const dedupedByGroupId = new Set<string>()
  return fieldGroups.filter((field) => {
    if (!activeKeys.has(field.id) || !field.fieldGroupId) {
      return false
    }
    if (dedupedByGroupId.has(field.fieldGroupId)) {
      return false
    }
    dedupedByGroupId.add(field.fieldGroupId)
    return true
  })
})

interface MaterialStepItem extends StepperItem {
  stepTitle: string
  stepId: string
  fieldGroupLegend: string
  fieldGroupId: string
  slotContent: {
    icon: string
    fields: FieldGroupItem[]
  }
}

const steps: ComputedRef<MaterialStepItem[]> = computed(() => {
  const defaultDimension = state.shape === 'round' ? 'diameter' : 'widthHeight'
  const uniqueSteps = new Set<string>(copy.value?.fieldGroup.map((fieldGroup: MaterialsLandingCollectionItem['fieldGroup'][number]) => fieldGroup.stepId) || [])
  return Array.from(uniqueSteps).map((step) => {
    const defaultFieldGroup = copy.value?.fieldGroup.find((fieldGroup: MaterialsLandingCollectionItem['fieldGroup'][number]) => fieldGroup.stepId === step)?.id
    const fieldGroupId = activeSteps.value.find(activeStep => activeStep.stepId === step)?.fieldGroupId
      || defaultFieldGroup
      || defaultDimension
    const fieldGroup = copy.value?.fieldGroup.find((fieldGroup: MaterialsLandingCollectionItem['fieldGroup'][number]) => fieldGroup.id === fieldGroupId)
    return {
      stepTitle: fieldGroup?.stepTitle || '',
      stepId: fieldGroup?.stepId || '',
      fieldGroupLegend: fieldGroup?.legend || '',
      fieldGroupId: fieldGroup?.id || '',
      slotContent: {
        icon: icons.value[fieldGroup?.id || ''] || 'i-lucide-box',
        fields: fieldGroups.filter(item => item.fieldGroupId === fieldGroup?.id),
      },
    }
  })
})

function getFieldValueLabel(fieldId: SchemaKey): string | number {
  const fieldValue = state[fieldId]
  if (typeof fieldValue === 'number') {
    return fieldValue
  }
  const fieldGroupItem = items.find(item => item.value === fieldValue)
  return fieldGroupItem?.label || ''
}

function getFieldUnit(fieldId: SchemaKey): string {
  const fieldGroupItem = items.find(item => item.id === fieldId)
  return fieldGroupItem?.unit || ''
}

function findFieldById(fields: FieldGroupItem[], id: string): FieldGroupItem | undefined {
  return fields.find(field => field.id === id)
}

function updateStepperModel(index: string | number | undefined): void {
  if (typeof index === 'number') {
    updateDirection(index)
  }
}

const stepper = useTemplateRef<StepperItem>('stepper')
const display = ref(false)

const lastStep = ref(0)
const direction = ref<'forward' | 'backward'>('forward')
function updateDirection(newIndex: number): void {
  const currentIndex = lastStep.value

  if (newIndex > currentIndex) {
    direction.value = 'forward'
  }
  else {
    direction.value = 'backward'
  }

  lastStep.value = newIndex
}
</script>

<template>
  <UStepper
    ref="stepper"
    :items="steps"
    :disabled="!display"
    class="w-full"
    size="xl"
    :ui="{
      title: 'flex flex-col gap-y-2 items-center justify-center text-base text-pretty font-semibold text-highlighted',
      // eslint-disable-next-line @stylistic/max-len
      trigger: 'p-1 rounded-sm border border-muted group-data-[state=completed]:border-primary/50 group-data-[state=active]:border-primary/50 group-data-[state=completed]:bg-primary/10 group-data-[state=active]:bg-primary/10 group-data-[state=completed]:text-primary group-data-[state=active]:text-primary disabled:border-muted disabled:text-muted',
      description: 'flex flex-col items-center justify-center',
      separator: 'group-data-[state=completed]:bg-primary',
    }"
    @update:model-value="updateStepperModel"
  >
    <template #indicator="{ item }">
      <MaterialDiameterCircle v-if="item.fieldGroupId === 'diameter'" />
      <MaterialWidthHeightSquare v-else-if="item.fieldGroupId === 'widthHeight'" />
      <UIcon
        v-else
        :name="icons[item.fieldGroupId as keyof typeof icons]"
        class="size-16"
      />
    </template>
    <template #title="{ item }">
      <UBadge
        size="md"
        variant="soft"
        :label="item.fieldGroupLegend"
      />
      <p> {{ item.stepTitle }} </p>
    </template>
    <template #description="{ item }">
      <p
        v-for="(field, i) in item.slotContent.fields"
        :key="i"
        class="text-sm text-muted"
      >
        {{ field?.label }}:&nbsp;&nbsp;<span class="text-sm text-default">
          {{ getFieldValueLabel(field.id) }}
          {{ getFieldUnit(field.id) }}</span>
      </p>
    </template>

    <template #content="{ item }">
      <MaterialStepperNavigation
        v-model:display="display"
        :stepper="stepper"
        :show-picker="false"
      />
      <Transition
        name="slideX-forward"
        mode="out-in"
      >
        <div v-if="display">
          <UForm
            ref="form"
            :state="state"
            :schema="commonSchema"
            class="relative overflow-hidden"
          >
            <Transition :name="direction === 'forward' ? 'slideX-forward' : 'slideX-backward'">
              <UPageGrid v-if="item?.stepId==='profile'">
                <MaterialFormItem
                  v-model="state.shape"
                  :field-object="findFieldById(item.slotContent.fields, 'shape')"
                />
                <MaterialFormItem
                  v-model="state.core"
                  :field-object="findFieldById(item.slotContent.fields, 'core')"
                />
                <MaterialFormItem
                  v-model="state.reinforced"
                  :field-object="findFieldById(item.slotContent.fields, 'reinforced')"
                />
              </UPageGrid>
              <UPageGrid v-else-if="item?.stepId==='length'">
                <MaterialFormItem
                  v-model="state.stiffness"
                  :field-object="findFieldById(item.slotContent.fields, 'stiffness')"
                  :col-start="2"
                />
              </UPageGrid>
              <UPageGrid v-else-if="item?.stepId==='dimensions'">
                <UForm
                  v-if="state.shape === 'round'"
                  :schema="diameterSchema"
                  nested
                  class="col-start-2 col-span-2"
                >
                  <MaterialFormItem :field-object="findFieldById(item.slotContent.fields, 'diameter')">
                    <MaterialDiameter
                      v-model="state.diameter"
                      :machines="machinesData"
                    />
                  </MaterialFormItem>
                </UForm>
                <UForm
                  v-else
                  :schema="widthHeightSchema"
                  nested
                  class="col-start-2 col-span-2"
                >
                  <MaterialFormItem :field-object="findFieldById(item.slotContent.fields, 'widthHeight')">
                    <MaterialWidthHeight
                      v-model:cut-width="state.width"
                      v-model:cut-height="state.height"
                      :machines="machinesData"
                    />
                  </MaterialFormItem>
                </UForm>
              </UPageGrid>
            </Transition>
          </UForm>
        </div>
      </Transition>
    </template>
  </UStepper>
</template>

<style>
.slideX-forward-enter-active,
.slideX-forward-leave-active {
  transition: transform 0.34s cubic-bezier(0.22, 1, 0.36, 1);
  will-change: transform;
}

.slideX-forward-leave-active,
.slideX-backward-leave-active {
  transition: transform 0.34s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.28s ease-out;
  position: absolute;
  inset: 0;
  width: 100%;
}

.slideX-forward-enter-from {
  transform: translateX(32%);
}

.slideX-forward-leave-to {
  transform: translateX(-32%);
  opacity: 0;
}

.slideX-backward-enter-active,
.slideX-backward-leave-active {
  transition: transform 0.34s cubic-bezier(0.22, 1, 0.36, 1);
  will-change: transform;
}

.slideX-backward-enter-from {
  transform: translateX(-32%);
}

.slideX-backward-leave-to {
  transform: translateX(32%);
  opacity: 0;
}

.fade-enter-active,
.fade-leave-active {
  transition: all 0.2s ease-out;
}

.fade-enter-from {
  opacity: 0;
}

.fade-leave-to {
  opacity: 0;
}
</style>
