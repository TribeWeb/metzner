<script setup lang="ts">
import type { ContentNavigationItem } from '@nuxt/content'
import { findPageHeadline } from '@nuxt/content/utils'

definePageMeta({
  layout: 'about'
})

const route = useRoute()

const { toc, seo } = useAppConfig()
const navigation = inject<Ref<ContentNavigationItem[]>>('about') || ref<ContentNavigationItem[]>([])

const { data: page } = await useAsyncData(route.path, () => {
  return queryCollection('about').path(route.path).first()
})

if (!page.value) {
  throw createError({ statusCode: 404, statusMessage: 'Page not found', fatal: true })
}

const { data: surround } = await useAsyncData(`${route.path}-surround`, () => {
  return queryCollectionItemSurroundings('about', route.path)
})

useSeoMeta({
  title: page.value?.seo.title,
  ogTitle: `${page.value?.seo.title} - ${seo?.siteName}`,
  description: page.value?.seo.description,
  ogDescription: page.value?.seo.description
})

defineOgImageComponent('Docs')

const headline = computed(() => findPageHeadline(navigation.value, route.path))
</script>

<template>
  <UPage v-if="page">
    <UPageHeader
      :title="page.title"
      :description="page.description"
      :headline="headline"
    />

    <UPageBody>
      <ContentRenderer
        v-if="page"
        :value="page"
      />

      <USeparator v-if="surround?.length" />

      <UContentSurround :surround="surround" />
    </UPageBody>

    <template
      v-if="page?.body?.toc?.links?.length"
      #right
    >
      <!-- <UContentToc
        highlight
        :title="toc?.title"
        :links="page.body?.toc?.links"
      /> -->
    </template>
  </UPage>
</template>
