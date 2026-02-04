<script setup lang="ts">
const props = defineProps<{
  src: string
  title: string
  alt?: string
  height: number
  width: number
  modalHeight: number
  modalWidth: number
}>()

const altText = computed(() => props.alt || `Photo of ${props.title}`)
</script>

<template>
  <div class="relative -p-4" :style="`height: ${height}px; width: ${width}px;`">
    <NuxtImg
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
        class="absolute bottom-2 right-2"
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
