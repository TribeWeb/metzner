<script setup lang="ts">
import type { MaybeElement } from '@vueuse/core'

const props = defineProps({
  src: String,
  title: String,
  alt: String,
  height: { type: Number, default: 450 },
  width: { type: Number, default: 600 },
  modalHeight: { type: Number, default: 800 },
  modalWidth: { type: Number, default: 1200 }
})

const el = useTemplateRef<MaybeElement>('el')
const { width: surroundWidth, height: surroundHeight } = useElementSize(el)

const altText = computed(() => props.alt || `Photo of ${props.title}`)
</script>

<template>
  <div class="relative">
    <NuxtImg
      ref="el"
      :src="src"
      :alt="altText"
      :height="height"
      :width="width"
      class="rounded-lg shadow-lg ring ring-default"
      format="webp"
      fit="cover"
    />
    <UModal fullscreen :title="title">
      <UButton
        icon="i-heroicons-camera-20-solid"
        size="xs"
        variant="solid"
        color="neutral"
        class="absolute"
        :style="`top: ${surroundHeight-30}px; left: ${surroundWidth-30}px;`"
      />
      <template #body>
        <div class="flex justify-center">
          <NuxtImg
            :src="src"
            :alt="altText"
            :height="modalHeight"
            :width="modalWidth"
            class=""
            format="webp"
            fit="cover"
          />
        </div>
      </template>
    </UModal>
  </div>
</template>
