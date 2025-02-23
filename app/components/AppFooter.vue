<script setup lang="ts">
import type { ContentNavigationItem } from '@nuxt/content'
import { mapContentNavigation } from '@nuxt/ui-pro/runtime/utils/content.js'

const { footer } = useAppConfig()
const columnHeaders = footer.columnHeaders || []

const aboutLinks = inject<Ref<ContentNavigationItem[]>>('aboutLinks') || ref<ContentNavigationItem[]>([])
const columns = computed(() => {
  return columnHeaders.map((header) => {
    return {
      ...header,
      children: mapContentNavigation(aboutLinks.value.filter(item => item.column === header.id))
    }
  })
})
// const labels = computed(() => mapContentNavigation(aboutLinks.value).map(({ stem, ...link }) => link))
// const columns = computed(() => labels.value.map((item) => {
//   return {
//     ...item,
//     children: mapContentNavigation(item.children as ContentNavigationItem[]).map(({ stem, ...link }) => link)
//   }
// }
// )) as ComputedRef<FooterColumnLink[]>
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
