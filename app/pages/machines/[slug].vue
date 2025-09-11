<script setup lang="ts">
import type { ContentNavigationItem } from '@nuxt/content'
import { findPageHeadline } from '@nuxt/content/utils'

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
    hasMeasurement: [
      {
        '@type': 'QuantitativeValue',
        'name': 'Material Width Max',
        'value': page.value.cutWidth,
        'unitText': 'mm',
        'unitCode': 'MMT',
        'description': 'Maximum width of material that can be processed'
      },
      {
        '@type': 'QuantitativeValue',
        'name': 'Material Height Max',
        'value': page.value.cutHeight,
        'unitText': 'mm',
        'unitCode': 'MMT',
        'description': 'Maximum height of material that can be processed'
      },
      {
        '@type': 'QuantitativeValue',
        'name': 'Material Diameter Max',
        'value': page.value.cutDiameter,
        'unitText': 'mm',
        'unitCode': 'MMT',
        'description': 'Maximum diameter of material that can be processed'
      },

      {
        '@type': 'QuantitativeValue',
        'name': 'Length Interval',
        'value': 0.1, // Add to Google Sheet
        'unitText': 'mm',
        'unitCode': 'MMT',
        'description': 'Minimum length interval for cutting'
      },
      {
        '@type': 'QuantitativeValue',
        'name': 'Feeding Speed Max',
        'value': 90, // Add to Google Sheet
        'unitText': 'm/min',
        'description': 'Maximum feeding speed'
      },
      {
        '@type': 'QuantitativeValue',
        'name': 'Cutting Performance',
        'value': page.value.cutRate,
        'unitText': 'cuts/min',
        'unitCode': 'CPM',
        'description': 'Maximum cutting performance'
      }
    ],
    additionalProperty: [
      {
        '@type': 'PropertyValue',
        'name': 'Available Cutting Technologies',
        'value': 'Die cutting, Shear cutting, Draw cutting', // Add to Google Sheet??
        'description': 'Types of cutting technologies supported'
      },
      {
        '@type': 'PropertyValue',
        'name': 'Cutting Accuracy',
        'value': page.value.accuracy,
        'description': 'Positional and repeatable cutting accuracy'
      },
      {
        '@type': 'PropertyValue',
        'name': 'Dimensions (LxWxH)',
        'value': '765x515x460 mm', // add to Google Sheet
        'description': 'Length x Width x Height'
      },
      {
        '@type': 'PropertyValue',
        'name': 'Electrical Input',
        'value': '230 Vac; 50/60 Hz; 10 A', // Add to Google Sheet
        'description': 'Power supply requirements'
      },
      {
        '@type': 'PropertyValue',
        'name': 'Compressed Air Input',
        'value': '6 bar | 87 PSI', // Add to Google Sheet
        'description': 'Required compressed air connection'
      },
      {
        '@type': 'PropertyValue',
        'name': 'Consumption kVA | bar',
        'value': 'P: 0.4 kVA | approx. 100 l/min.', // Add to Google Sheet
        'description': 'Power and air consumption'
      },
      {
        '@type': 'PropertyValue',
        'name': 'Noise (idle)',
        'value': '< 75dB (A)', // Add to Google Sheet
        'description': 'Noise level during idle operation'
      }
    ],
    offers: {
      '@type': 'AggregateOffer',
      'url': route.fullPath,
      'priceCurrency': 'GBP',
      'lowPrice': '5000', // Add to Google Sheet
      'highPrice': '10000', // Add to Google Sheet
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
