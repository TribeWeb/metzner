<script setup lang="ts">
import type { ContentNavigationItem } from '@nuxt/content'
import { mapContentNavigation } from '@nuxt/ui/utils/content'

const { footer } = useAppConfig()
const columnHeaders = footer.columnHeaders || []

const about = inject<Ref<ContentNavigationItem[]>>('about') || ref<ContentNavigationItem[]>([])
const columns = computed(() => {
  return columnHeaders.map((header) => {
    return {
      ...header,
      children: mapContentNavigation(about.value.filter(item => item.column === header.id))
    }
  })
})
</script>

<template>
  <UFooter>
    <template #top>
      <UContainer>
        <UFooterColumns :columns="columns">
          <template #right>
            <UFormField name="email" label="Subscribe to our newsletter" size="lg">
              <UInput type="email" class="w-full">
                <template #trailing>
                  <UButton type="submit" size="xs" color="neutral" label="Subscribe" />
                </template>
              </UInput>
            </UFormField>
          </template>
        </UFooterColumns>
      </UContainer>
    </template>
    <template #left>
      {{ footer.copyright }}
    </template>

    <template #right>
      <UColorModeButton v-if="footer?.colorMode" />
      <UButton
        color="neutral"
        variant="ghost"
        :to="footer.creditsLink"
        :label="footer.credits"
      />
    </template>
  </UFooter>
</template>
