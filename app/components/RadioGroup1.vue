<script lang="ts">
import type { RadioGroupItem } from 'reka-ui'
</script>
<!-- eslint-disable @typescript-eslint/no-explicit-any -->

<script setup lang="ts"  generic="T extends RadioGroupItem">
import { computed, useId } from 'vue'
import type { RadioGroupProps, RadioGroupEmits, RadioGroupSlots, RadioGroupValue } from '@nuxt/ui'
import { RadioGroupRoot, RadioGroupIndicator, Label, useForwardPropsEmits } from 'reka-ui'
import { reactivePick } from '@vueuse/core'
import type { AppConfig } from '@nuxt/schema'
// import type { VariantProps } from 'tailwind-variants'
// import { tv } from 'tailwind-variants'
// import { get } from '../utils'
import theme from '#build/ui/radio-group'

// import { useFormField } from '../composables/useFormField'
import _appConfig from '#build/app.config'

const props = withDefaults(defineProps<RadioGroupProps<T>>(), {
  valueKey: 'value',
  labelKey: 'label',
  descriptionKey: 'description',
  orientation: 'vertical'
})
const emits = defineEmits<RadioGroupEmits>()
const slots = defineSlots<RadioGroupSlots<T>>()

const rootProps = useForwardPropsEmits(reactivePick(props, 'as', 'modelValue', 'defaultValue', 'orientation', 'loop', 'required'), emits)
const { emitFormChange, emitFormInput, color, name, size, id: _id, disabled, ariaAttrs } = useFormField<RadioGroupProps<T>>(props, { bind: false })
const id = _id.value ?? useId()

const appConfigRadioGroup = _appConfig as AppConfig & { ui: { radioGroup: Partial<typeof theme> } }

const radioGroup = tv({ extend: tv(theme), ...(appConfigRadioGroup.ui?.radioGroup || {}) })
// type RadioGroupVariants = VariantProps<typeof radioGroup>
// type SlotProps<T extends RadioGroupItem> = (props: { item: T & { id: string }, modelValue?: RadioGroupValue }) => any

const ui = computed(() => radioGroup({
  size: size.value,
  color: color.value,
  disabled: disabled.value,
  required: props.required,
  orientation: props.orientation,
  variant: props.variant,
  indicator: props.indicator
}))

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function normalizeItem(item: any) {
  if (item === null) {
    return {
      id: `${id}:null`,
      value: undefined,
      label: undefined
    }
  }

  if (typeof item === 'string' || typeof item === 'number') {
    return {
      id: `${id}:${item}`,
      value: String(item),
      label: String(item)
    }
  }

  const value = get(item, props.valueKey as string)
  const label = get(item, props.labelKey as string)
  const description = get(item, props.descriptionKey as string)

  return {
    ...item,
    value,
    label,
    description,
    id: `${id}:${value}`
  }
}

const normalizedItems = computed(() => {
  if (!props.items) {
    return []
  }

  return props.items.map(normalizeItem)
})

function onUpdate(value: any) {
  // @ts-expect-error - 'target' does not exist in type 'EventInit'
  const event = new Event('change', { target: { value } })
  emits('change', event)
  emitFormChange()
  emitFormInput()
}
</script>

<template>
  <RadioGroupRoot
    :id="id"
    v-slot="{ modelValue }"
    v-bind="rootProps"
    :name="name"
    :disabled="disabled"
    :class="ui.root({ class: [props.class, props.ui?.root] })"
    @update:model-value="onUpdate"
  >
    <fieldset :class="ui.fieldset({ class: props.ui?.fieldset })" v-bind="ariaAttrs">
      <legend v-if="legend || !!slots.legend" :class="ui.legend({ class: props.ui?.legend })">
        <slot name="legend">
          {{ legend }}
        </slot>
      </legend>
      <component :is="variant === 'list' ? 'div' : Label" v-for="item in normalizedItems" :key="item.value" :class="ui.item({ class: props.ui?.item })">
        <div :class="ui.container({ class: props.ui?.container })">
          <RadioGroupItem
            :id="item.id"
            :value="item.value"
            :disabled="item.disabled"
            :class="ui.base({ class: props.ui?.base, disabled: item.disabled })"
          >
            <RadioGroupIndicator :class="ui.indicator({ class: props.ui?.indicator })" />
          </RadioGroupItem>
        </div>

        <div :class="ui.wrapper({ class: props.ui?.wrapper })">
          <component :is="variant === 'list' ? Label : 'p'" :class="ui.label({ class: props.ui?.label })" :for="item.id">
            <slot name="label" :item="item" :model-value="(modelValue as RadioGroupValue)">
              {{ item.label }}
            </slot>
          </component>
          <p v-if="item.description || !!slots.description" :class="ui.description({ class: props.ui?.description })">
            <slot name="description" :item="item" :model-value="(modelValue as RadioGroupValue)">
              {{ item.description }}
            </slot>
          </p>
        </div>
      </component>
    </fieldset>
  </RadioGroupRoot>
</template>
