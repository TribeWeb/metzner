<script setup lang="ts">
import type { ContentNavigationItem } from '@nuxt/content'
import { findPageHeadline } from '@nuxt/content/utils'

import type { TabsItem } from '@nuxt/ui'

const items = [
  {
    label: 'Specifications',
    icon: 'i-lucide-notebook-tabs',
    content: 'Full list of specs.',
    slot: 'specifications' as const
  },
  {
    label: 'Materials',
    icon: 'i-fa6-solid-cubes',
    content: 'List of materials this machine can cut.',
    slot: 'materials' as const
  },
  {
    label: 'Peripherals',
    icon: 'i-lucide-square-plus',
    content: 'List of compatible peripherals.',
    slot: 'peripherals' as const
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

const imgHeaderProps = computed(() => ({
  src: `/machines/${route.params.slug}.png`,
  title: `Metzner ${page.value?.title} cutting machine`,
  alt: `Photo of Metzner ${page.value?.title} cutting machine`,
  height: 140,
  width: 180
}))

const imgProps = computed(() => ({
  ...imgHeaderProps.value,
  height: 350,
  width: 600
}))

useSchemaOrg([
  defineProduct({
    name: `Metzner ${page.value.title}`,
    description: page.value.description,
    disambiguatingDescription: page.value.features?.description,
    image: `/machines/${route.params.slug}.png`, // TODO
    category: 'Universal Cutting Machine',
    sameAs: page.value.sameAs || [],
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
    hasMeasurement: useSchemaOrgProps(page.value, { schemaType: 'hasMeasurement' }),
    additionalProperty: useSchemaOrgProps(page.value, { schemaType: 'additionalProperty' }),
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
    <div class="md:flex md:flex-row border-b border-default">
      <UPageHeader
        :title="`Metzner ${page.title}`"
        :description="page.featurePrimary"
        :headline="headline"
        class="md:basis-11/16"
        :ui="{ root: 'border-none' }"
      />
      <div class="relative not-md:hidden grid justify-items-end p-4 basis-5/16">
        <ImageModal v-bind="imgHeaderProps" />
      </div>
    </div>

    <UPageBody>
      <ContentRenderer
        v-if="page"
        :value="page"
      />

      <UPageSection
        :title="page.features?.title"
        :description="page.features?.description"
        :features="page.benefits"
        :ui="{ container: 'flex flex-col lg:grid py-2 sm:py-4 lg:py-6 gap-4 sm:gap-y-6',
               title: 'text-3xl sm:text-4xl text-pretty tracking-tight text-highlighted'
        }"
      />
      <MaterialAlert />
      <UTabs
        :items="items"
        :unmount-on-hide="false"
        variant="pill"
        :ui="{ trigger: 'md:grow',
               root: 'p-4 bg-default ring ring-default rounded-lg mt-6',
               content: 'my-4!'
        }"
        class="gap-4 display-block"
      >
        <template #specifications>
          <ULink
            as="button"
            :href="`/pdf/${route.params.slug}.pdf`"
            :alt="`download or open ${page.title} datasheet in a new tab`"
            target="_blank"
            external
            download
            class="text-primary pl-4"
          >{{ page.title }} datasheet</ULink> <br><span class="text-muted text-sm pl-4">(pdf will download or open in a new tab)</span>
          <UTable sticky :data="useSpecification(page)" class="flex-1 max-h-96 mt-4" />
        </template>
        <template #materials="{ item }">
          <p class="text-muted mb-4">
            {{ item.content }}
          </p>
        </template>
        <template #peripherals="{ item }">
          <p class="text-muted mb-4">
            {{ item.content }}
          </p>
        </template>
        <!-- <template #specifications>
          <UTable sticky :data="useSpecification(page)" class="flex-1 max-h-96" />
        </template> -->
      </UTabs>
      <ImageModal v-bind="imgProps" />

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
            :class="{ 'mt-6!': page.body?.toc?.links?.length }"
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
