<script setup lang="ts">
import type { ContentNavigationItem } from '@nuxt/content'
import PageColumns from '@nuxt/ui-pro/runtime/components/PageColumns.vue'
import { findPageHeadline } from '#ui-pro/utils/content'

definePageMeta({
  layout: 'docs'
})

const route = useRoute()
const { toc, seo } = useAppConfig()
const navigation = inject<Ref<ContentNavigationItem[]>>('navigation')

const { data } = await useAsyncData(route.path, () => Promise.all([
  queryCollection('machines').path(route.path).first(),
  queryCollection('machines').select('path', 'title', 'description', 'extension').all(),
  // queryCollection('machines').path(`/machines/:${route.params.landing}()/:slug()`).all(),
  queryCollectionItemSurroundings('machines', route.path, {
    fields: ['title', 'description']
  })
]), {
  transform: ([page, childPages, surround]) => ({ page, childPages, surround })
})
if (!data.value || !data.value.page) {
  throw createError({ statusCode: 404, statusMessage: 'Page not found', fatal: true })
}

const page = computed(() => data.value?.page)
const surround = computed(() => data.value?.surround)
const childPages = computed(() => data.value?.childPages.filter(item => item.path.includes(`${route.params.landing}/`) && item.extension === 'md'))

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

const machines = computed(() => navigation?.value?.find(item => item.path === route.path)?.children || [])
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
      <ContentRenderer
        v-if="page"
        :value="page"
      />
      <UPageSection
        title="Checkout the rest of the range"
        :description="page.description"
        :features="childPages"
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
