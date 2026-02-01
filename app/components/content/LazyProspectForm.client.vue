<script setup lang="ts">
const LazyProspectForm = defineLazyHydrationComponent(
  'visible',
  () => import('../../components/content/ProspectForm.client.vue')
)

defineProps({
  formId: {
    type: String,
    required: true
  }
})
</script>

<template>
  <div>
    <LazyProspectForm :form-id="formId" />
  </div>
</template>
