<script setup lang="ts">
import type { Collections } from '@nuxt/content'

const props = defineProps<{
  collection: keyof Collections
  slug: string
  description: string
}>()

const { data: product } = await useAsyncData<{ title?: string, description?: string } | null>(props.slug, () => {
  return queryCollection(props.collection).select('title', 'description').path(`/${props.collection}/${props.slug}`).first() as Promise<{ title?: string, description?: string } | null>
})
</script>

<template>
  <UPageCard
    orientation="horizontal"
    reverse
    :title="product?.title"
    :description="product?.description || description"
    variant="soft"
    :to="`/${collection}/${slug}`"
    :ui="{ container: 'flex-row  lg:flex lg:flex-row', wrapper: 'order-last' }"
  >
    <template #default>
      <NuxtImg
        :src="`/${collection}/${slug}.webp`"
        :alt="`thumbnail of ${product?.title}`"
        fit="cover"
        width="120"
        height="80"
      />
    </template>
  </UPageCard>
</template>
