<script setup lang="ts">
import type { MachinesCollectionItem } from '@nuxt/content'

const props = defineProps<{
  page: MachinesCollectionItem
  slug: string
}>()
</script>

<template>
  <ULink
    as="button"
    :href="`/pdf/${props.slug}.pdf`"
    :alt="`download or open ${props.page.title} datasheet in a new tab`"
    target="_blank"
    external
    download
    class="text-primary pl-4"
  >{{ props.page.title }} datasheet</ULink> <br><span class="text-muted text-sm pl-4">(pdf will download or open in a new tab)</span>
  <UTable
    sticky
    :data="useSpecification(props.page)"
    class="flex-1 max-h-96 mt-4"
  />
</template>
