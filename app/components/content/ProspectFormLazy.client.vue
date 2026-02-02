<script setup lang="ts">
// const ProspectFormLazy = defineLazyHydrationComponent(
//   'visible',
//   () => import('../ProspectForm.client.vue')
// )

defineProps({
  formId: {
    type: String,
    required: true
  }
})
</script>

<template>
  <div>
    <LazyProspectForm :form-id="formId" hydrate-never />
  </div>
</template>
