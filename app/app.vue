<script setup lang="ts">
import { defineLocalBusiness } from 'nuxt-schema-org/schema'

const { seo, toaster, schemaOrg } = useAppConfig()
const localBusiness = schemaOrg?.localBusiness

const { data: machines } = await useAsyncData('machinesList', () => queryCollectionNavigation('machines'), {
  // transform: data => data.find(item => item.path === '/machines')?.children || []
})
provide('machines', machines)

const { data: about } = await useAsyncData('aboutList', () => queryCollectionNavigation('about', ['column']))
provide('about', about)

const { data: peripherals } = await useAsyncData('peripheralsList', () => queryCollectionNavigation('peripherals'), {
  // transform: data => data.find(item => item.path === '/spares')?.children || []
})
provide('peripherals', peripherals)

const { data: spares } = await useAsyncData('sparesLanding', () => queryCollectionNavigation('sparesLanding'))
provide('spares', spares)

const { data: materials } = await useAsyncData('materialsLanding', () => queryCollectionNavigation('materialsLanding'))
provide('materials', materials)

const { data: latest } = await useAsyncData('latestList', () => queryCollectionNavigation('latest'))
provide('latest', latest)

const state = reactive<Partial<Schema>>({})
useMountedState(state)
provide('state', state)

// const { data: files } = useLazyAsyncData('search', () => queryCollectionSearchSections('machines'), {
//   server: false
// })

const { data: files } = await useAsyncData('search-sections', () => {
  return queryCollectionSearchSections('machines')
})

// const route = useRoute()
// const activeNav = computed(() => (navigation.value ?? []).map((obj: ContentNavigationItem, i: number) => ({
//   ...obj, active: route.path.includes(obj.path), defaultOpen: route.path.includes(obj.path), key: i
// })))

// https://realfavicongenerator.net/
useHead({
  meta: [
    { name: 'viewport', content: 'width=device-width, initial-scale=1' },
    { name: 'apple-mobile-web-app-title', content: 'Metzner UK' }
  ],
  link: [
    { rel: 'shortcut icon', href: '/favicon.ico' },
    { rel: 'icon', type: 'image/svg+xml', href: '/icons/favicon.svg' },
    { rel: 'manifest', href: '/icons/site.webmanifest' },
    { rel: 'apple-touch-icon', sizes: '180x180', href: '/icons/apple-touch-icon.png' },
    { rel: 'manifest', href: '/icons/site.webmanifest' }
  ],
  htmlAttrs: {
    lang: 'en'
  }
})

useSeoMeta({
  titleTemplate: `%s - ${seo?.siteName}`,
  ogSiteName: seo?.siteName,
  ogImage: 'https://docs-template.nuxt.dev/social-card.png',
  twitterImage: 'https://docs-template.nuxt.dev/social-card.png',
  twitterCard: 'summary_large_image'
})

useSchemaOrg([
  defineLocalBusiness({
    name: 'Metzner UK',
    ...(localBusiness?.topLevel || {}),
    address: localBusiness?.address,
    openingHoursSpecification: localBusiness?.openingHoursSpecification,
    geo: localBusiness?.geo,
    paymentAccepted: localBusiness?.paymentAccepted,
    image: localBusiness?.image,
    sameAs: localBusiness?.sameAs
  })
])
</script>

<template>
  <UApp :toaster-props="toaster">
    <NuxtLoadingIndicator />

    <AppHeader />

    <UMain>
      <NuxtLayout>
        <NuxtPage />
      </NuxtLayout>
    </UMain>

    <AppFooter />

    <ClientOnly>
      <LazyUContentSearch
        :files="files"
        :navigation="machines"
      />
    </ClientOnly>
  </UApp>
</template>
