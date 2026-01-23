<script setup lang="ts">
const props = defineProps<{
  formId: string
}>()

useScript({
  src: `https://userresources.prospect365.com/forms/QXZhbiBNZWR2ZWRldkFudvUt0fa+nPox7g%252Fhhu4C+wDua6PEgA==/${props.formId}/form.js`
})

const route = useRoute()
const toast = useToast()

if (route.query.message === 'form-received') {
  toast.add({
    title: 'Thank you',
    description: 'We received your message and will be in touch shortly.',
    color: 'success',
    duration: 5000
  })
}
</script>

<template>
  <div :id="`prospect-form-${formId}`">
    <div
      class="prospect-form-loading"
      style="width:50px;height:50px;margin:0 auto;background:url(https://userresources.prospect365.com/forms/spinner.svg)
      center
      center
      no-repeat;background-size:contain"
    />
  </div>
</template>
