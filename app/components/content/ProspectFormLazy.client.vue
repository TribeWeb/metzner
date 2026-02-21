<script setup lang="ts">
// const ProspectFormLazy = defineLazyHydrationComponent(
//   'visible',
//   () => import('../ProspectForm.client.vue')
// )

defineProps({
  id: {
    type: Number,
    required: true
  }
})
</script>

<template>
  <div>
    <LazyProspectForm
      :id="id"
      hydrate-never
    />
  </div>
</template>
