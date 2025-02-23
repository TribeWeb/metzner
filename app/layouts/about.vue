<script setup lang="ts">
import type { ContentNavigationItem } from '@nuxt/content'

const { footer } = useAppConfig()
const columnHeaders = footer.columnHeaders || []

const aboutLinks = inject<Ref<ContentNavigationItem[]>>('aboutLinks') || ref<ContentNavigationItem[]>([])
const columns = computed(() => {
  return columnHeaders.map((header) => {
    return {
      ...header,
      children: aboutLinks.value.filter(item => item.column === header.id)
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
