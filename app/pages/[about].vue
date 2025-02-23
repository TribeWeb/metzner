<script setup lang="ts">
import type { ContentNavigationItem } from '@nuxt/content'
import { findPageHeadline } from '#ui-pro/utils/content'

definePageMeta({
  layout: 'about'
})

const route = useRoute()

const { toc, seo } = useAppConfig()
const aboutLinks = inject<Ref<ContentNavigationItem[]>>('aboutLinks') || ref<ContentNavigationItem[]>([])

const { data } = await useAsyncData(route.path, () => Promise.all([
  queryCollection('about').path(route.path).first(),
  queryCollectionItemSurroundings('about', route.path, {
    fields: ['title', 'description']
  })
]), {
  transform: ([page, surround]) => ({ page, surround })
})
if (!data.value || !data.value.page) {
  throw createError({ statusCode: 404, statusMessage: 'Page not found', fatal: true })
}

const page = computed(() => data.value?.page)
const surround = computed(() => data.value?.surround)

useSeoMeta({
  title: page.value?.seo.title,
  ogTitle: `${page.value?.seo.title} - ${seo?.siteName}`,
  description: page.value?.seo.description,
  ogDescription: page.value?.seo.description
})

defineOgImageComponent('Docs')

const headline = computed(() => findPageHeadline(aboutLinks.value, page.value))
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
      <UContentToc
        highlight
        :title="toc?.title"
        :links="page.body?.toc?.links"
      />
    </template>
  </UPage>
</template>
