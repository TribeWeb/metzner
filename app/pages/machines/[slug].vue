<script setup lang="ts">
import type { ContentNavigationItem } from '@nuxt/content'
import { findPageHeadline } from '@nuxt/content/utils'

definePageMeta({
  layout: 'docs'
})

const route = useRoute()
const { toc, seo } = useAppConfig()
const navigation = inject<Ref<ContentNavigationItem[]>>('machines') || ref<ContentNavigationItem[]>([])

const { data: page } = await useAsyncData(route.path, () => {
  return queryCollection('machines').path(route.path).first()
})

if (!page.value) {
  throw createError({ statusCode: 404, statusMessage: 'Page not found', fatal: true })
}

const { data: surround } = await useAsyncData(`${route.path}-surround`, () => {
  return queryCollectionItemSurroundings('machines', route.path)
})

useSeoMeta({
  title: page.value.seo?.title,
  ogTitle: `${page.value.seo?.title} - ${seo?.siteName}`,
  description: page.value.seo?.description,
  ogDescription: page.value.seo?.description
})

defineOgImageComponent('Docs')

const headline = computed(() => findPageHeadline(navigation?.value, route.path))

const features = computed(() => [
  {
    title: 'Feature 1',
    description: page.value?.featurePrimary || 'Description of feature 1',
    icon: 'i-lucide-star'
  },
  {
    title: 'Feature 2',
    description: page.value?.featureSecondary || 'Description of feature 2',
    icon: 'i-lucide-star'
  }
])
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
      <!-- <UPageHero>
        <img
          :src="`/machines/${page.path.split('/').pop()}.webp`"
          alt="App screenshot"
          class="rounded-lg shadow-2xl ring ring-[var(--ui-border)]"
        >
      </UPageHero> -->

      <UPageSection
        title=""
        description=""
        :features="features"
      />

      <USeparator v-if="surround?.length" />

      <UContentSurround :surround="surround" />
    </UPageBody>

    <template
      v-if="page?.body?.toc?.links?.length"
      #right
    >
      <UContentToc
        :title="toc?.title"
        :links="page.body?.toc?.links"
      >
        <template
          v-if="toc?.bottom"
          #bottom
        >
          <div
            class="hidden lg:block space-y-6"
            :class="{ '!mt-6': page.body?.toc?.links?.length }"
          >
            <USeparator
              v-if="page.body?.toc?.links?.length"
              type="dashed"
            />
          </div>
        </template>
      </UContentToc>
    </template>
  </UPage>
</template>
