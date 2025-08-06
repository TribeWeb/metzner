<script setup lang="ts">
import type { ContentNavigationItem } from '@nuxt/content'

const { footer } = useAppConfig()
const columnHeaders = footer.columnHeaders || []

const listAbout = inject<Ref<ContentNavigationItem[]>>('about') || ref<ContentNavigationItem[]>([])
const columns = computed(() => {
  return columnHeaders.map((header) => {
    return {
      ...header,
      children: listAbout.value.filter(item => item.column === header.id)
    }
  })
})
</script>

<template>
  <UContainer>
    <UPage>
      <template #left>
        <UPageAside>
          <UContentNavigation
            highlight
            :navigation="columns"
            :collapsible="false"
          />
        </UPageAside>
      </template>

      <slot />
    </UPage>
  </UContainer>
</template>
