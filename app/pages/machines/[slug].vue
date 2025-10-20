<script setup lang="ts">
import type { ContentNavigationItem } from '@nuxt/content'
import { findPageHeadline } from '@nuxt/content/utils'

import type { TabsItem } from '@nuxt/ui'

const items = [
  {
    label: 'Datasheet',
    icon: 'i-lucide-file-text',
    content: 'Datasheet link goes here.',
    slot: 'datasheet' as const
  },
  {
    label: 'Peripherals',
    icon: 'i-lucide-square-plus',
    content: 'List of compatible peripherals.',
    slot: 'peripherals' as const
  },
  {
    label: 'Specifications',
    icon: 'i-lucide-notebook-tabs',
    content: 'Full list of specs.',
    slot: 'specifications' as const
  }
] satisfies TabsItem[]

definePageMeta({
  layout: 'machines'
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
const schemaOrgProps = computed(() => useSchemaOrgProps(page.value!))

useSchemaOrg([
  defineProduct({
    name: `Metzner ${page.value.title}`,
    description: page.value.description,
    disambiguatingDescription: page.value.features?.description,
    image: `/machines/${page.value.path.split('/').pop()}.webp`, // TODO
    category: 'Universal Cutting Machine',
    sameAs: 'https://www.metzner.com/product-solutions/profiles-tubes/universal-modular-cutting-machines/metzner-variocut/', // Add to Google Sheet
    url: route.fullPath,
    brand: {
      '@type': 'Brand',
      'name': seo?.siteName,
      'url': 'https://metzner.co.uk/about'
    },
    manufacturer: {
      '@type': 'Organization',
      'name': 'Metzner Maschinenbau GmbH',
      'url': 'https://www.metzner.com/'
    },
    mpn: page.value.title,
    countryOfOrigin: 'DE',
    weight: '65 kg', // Add to Google Sheet
    hasMeasurement: schemaOrgProps.value.filter(prop => prop.schema === 'hasMeasurement').map(({ schema, ...rest }) => rest),
    additionalProperty: schemaOrgProps.value.filter(prop => prop.schema === 'additionalProperty').map(({ schema, ...rest }) => rest),
    offers: {
      '@type': 'AggregateOffer',
      'url': route.fullPath,
      'priceCurrency': 'GBP',
      'lowPrice': page.value.minPrice,
      'highPrice': page.value.maxPrice,
      'itemCondition': 'https://schema.org/NewCondition',
      'seller': {
        '@type': 'Organization',
        'name': 'CP Power & Automation',
        'url': 'https://cppowerautomation.com'
      }
    }
  })
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

      <UPageSection
        :title="page.features?.title"
        :description="page.features?.description"
        :features="page.benefits"
      >
        <img
          :src="`/machines/${page.path.split('/').pop()}.webp`"
          alt="App screenshot"
          class="rounded-lg shadow-2xl ring ring-[var(--ui-border)]"
        >
      </UPageSection>
      <UPageCard>
        <UTabs :items="items" :unmount-on-hide="false" variant="link" :ui="{ trigger: 'grow' }" class="gap-4 w-full">
          <template #datasheet>
            <ULink
              as="button"
              :href="`/pdf/${route.params.slug}.pdf`"
              :alt="`open ${page.title} datasheet in a new tab`"
              target="_blank"
              external
              download
              class="text-primary"
            >{{ page.title }} datasheet</ULink> (pdf opens in new tab)
          </template>
          <template #peripherals="{ item }">
            <p class="text-muted mb-4">
              {{ item.content }}
            </p>
          </template>
          <template #specifications>
            <UTable :data="schemaOrgProps.map(({ name, value, description }) => ({ name, value, description }))" class="flex-1" />
          </template>
        </UTabs>
      </UPageCard>

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
