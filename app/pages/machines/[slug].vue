<script setup lang="ts">
import type { ContentNavigationItem } from '@nuxt/content'
import { findPageHeadline } from '#ui-pro/utils/content'

definePageMeta({
  layout: 'docs'
})

const route = useRoute()
const { toc, seo } = useAppConfig()
const navigation = inject<Ref<ContentNavigationItem[]>>('navigation')

const { data } = await useAsyncData(route.path, () => Promise.all([
  queryCollection('machines').path(route.path).first(),
  queryCollectionItemSurroundings('machines', route.path, {
    fields: ['title', 'description']
  })
  // queryCollection('machines').path(route.params.landing).all(),
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

const headline = computed(() => findPageHeadline(navigation?.value, page.value))

const links = computed(() => [toc?.bottom?.edit && {
  icon: 'i-lucide-external-link',
  label: 'Edit this page',
  to: `${toc.bottom.edit}/${page?.value?.path}`,
  target: '_blank'
}, ...(toc?.bottom?.links || [])].filter(Boolean))

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
      :links="page.links"
      :headline="headline"
    />

    <UPageBody>
      <!-- <pre>{{ route }}</pre> -->
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

            <UPageLinks
              :title="toc.bottom.title"
              :links="links"
            />
          </div>
        </template>
      </UContentToc>
    </template>
  </UPage>
</template>
