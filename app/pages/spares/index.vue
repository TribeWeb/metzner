<script setup lang="ts">
import { findPageHeadline } from '@nuxt/content/utils'
import type { ContentNavigationItem } from '@nuxt/content'

const navigation = inject<Ref<ContentNavigationItem[]>>('spares') || ref<ContentNavigationItem[]>([])

const route = useRoute()
const { data: page } = await useAsyncData('spares', () => queryCollection('sparesLanding').path(route.path).first())
if (!page.value) {
  throw createError({ statusCode: 404, statusMessage: 'Page not found', fatal: true })
}

const headline = computed(() => findPageHeadline(navigation.value, route.path))

definePageMeta({
  layout: 'spares'
})

useSeoMeta({
  title: page.value.seo?.title,
  ogTitle: page.value.seo?.title,
  description: page.value.seo?.description,
  ogDescription: page.value.seo?.description
})
</script>

<template>
  <UPage>
    <UPageHeader
      :title="page?.title"
      :description="page?.description"
      :headline="headline"
    />
    <UPageBody>
      <ContentRenderer
        v-if="page"
        :value="page"
        :prose="true"
      />
    </UPageBody>
  </UPage>
</template>
