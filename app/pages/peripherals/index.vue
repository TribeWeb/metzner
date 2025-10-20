<script setup lang="ts">
import { findPageHeadline } from '@nuxt/content/utils'
import type { ContentNavigationItem } from '@nuxt/content'

const { toc } = useAppConfig()
const navigation = inject<Ref<ContentNavigationItem[]>>('peripherals') || ref<ContentNavigationItem[]>([])

const route = useRoute()
const { data: page } = await useAsyncData('spares', () => queryCollection('peripheralsLanding').path(route.path).first())
if (!page.value) {
  throw createError({ statusCode: 404, statusMessage: 'Page not found', fatal: true })
}

const headline = computed(() => findPageHeadline(navigation.value, route.path))

definePageMeta({
  layout: 'peripherals'
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
    <template
      v-if="page?.body?.toc?.links?.length"
      #right
    >
      <UContentToc
        highlight
        :title="toc?.title"
        :links="page.body?.toc?.links"
      />
    </template>
  </UPage>
</template>
