<script setup lang="ts">
const { seo, toaster } = useAppConfig()

const { data: navigation } = await useAsyncData('navigation', () => queryCollectionNavigation('machines'), {
  // transform: data => data.find(item => item.path === '/machines')?.children || []
})

provide('navigation', navigation)

const { data: aboutLinks } = await useAsyncData('about', () => queryCollectionNavigation('about', ['column']))

provide('aboutLinks', aboutLinks)

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
</script>

<template>
  <UApp :toaster="toaster">
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
        :navigation="navigation"
      />
    </ClientOnly>
  </UApp>
</template>
