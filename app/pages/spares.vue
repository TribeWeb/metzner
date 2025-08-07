<script setup lang="ts">
const { toc, seo } = useAppConfig()

const route = useRoute()
const { data: page } = await useAsyncData('spares', () => queryCollection('sparesLanding').path(route.path).first())
if (!page.value) {
  throw createError({ statusCode: 404, statusMessage: 'Page not found', fatal: true })
}

useSeoMeta({
  title: page.value.seo.title,
  ogTitle: `${page.value.seo.title} - ${seo?.siteName}`,
  description: page.value.seo.description,
  ogDescription: page.value.seo.description
})
</script>

<template>
  <UContainer>
    <UPage>
      <UPageHeader
        :title="page?.title"
        :description="page?.description"
      />
      <UPageBody>
        <ContentRenderer
          v-if="page"
          :value="page"
          :prose="true"
        />
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
  </UContainer>
</template>
