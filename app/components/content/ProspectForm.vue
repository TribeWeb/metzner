<script setup lang="ts">
import z from 'zod'
import type { FormSubmitEvent } from '@nuxt/ui'

const props = defineProps<{
  formId: string
}>()

const runtimeConfig = useRuntimeConfig()
const prospectFormOrgId = runtimeConfig.public.prospectFormOrgId
const googleRecaptchaSiteKey = runtimeConfig.public.scripts.googleRecaptcha.siteKey

const { proxy } = useScriptGoogleRecaptcha({
  siteKey: googleRecaptchaSiteKey
})

const status = ref<'idle' | 'loading' | 'success' | 'error'>('idle')

const formFields = await useFormScriptFields(props.formId, prospectFormOrgId)

const schema = z.object({
  'text-1660649455927-0': z.string(),
  'text-1660649456958-0': z.string(),
  'text-1660649458928-0': z.string(),
  'text-1660649457896-0': z.email('Invalid email'),
  'textarea-1740493755578-0': z.string().optional(),
  [`prospect-form-${props.formId}-url`]: z.url().optional(),
  [`prospect-form-${props.formId}-token`]: z.string().optional(),
  'redirect': z.string().optional()
})

type Schema = z.output<typeof schema>

const state = reactive<Schema>({
  'text-1660649455927-0': undefined,
  'text-1660649456958-0': undefined,
  'text-1660649458928-0': undefined,
  'text-1660649457896-0': undefined,
  'textarea-1740493755578-0': undefined,
  [`prospect-form-${props.formId}-url`]: undefined,
  [`prospect-form-${props.formId}-token`]: undefined,
  'redirect': undefined
})

const toast = useToast()

async function onSubmit(event: FormSubmitEvent<Schema>) {
  status.value = 'loading'
  event.data[`prospect-form-${props.formId}-url`] = location.hostname.toString()
  event.data['redirect'] = 'false'

  proxy.grecaptcha.ready(async () => {
    const token = await proxy.grecaptcha.execute(googleRecaptchaSiteKey, { action: 'prospect_form' })
    event.data[`prospect-form-${props.formId}-token`] = token as unknown as string
    const result = await $fetch(`https://userresources.prospect365.com/forms/${prospectFormOrgId}/${props.formId}/submit`, {
      method: 'POST',
      body: new URLSearchParams(event.data as Record<string, string>)
    }).catch((error) => {
      toast.add({
        'title': 'Error',
        'description': `Error: ${error.data['error-codes'].join(', ')}. Please give us a call or try again.`,
        'color': 'error',
        'onUpdate:open': (open) => {
          if (!open) {
            status.value = 'idle'
          }
        }
      })
    })
    if ((result as string)?.includes('form-received')) {
      status.value = 'success'
      toast.add({
        title: 'Success',
        description: 'Thanks for getting in touch. We\'ll get back to you as soon as possible',
        color: 'success'
      })
    }
  })
}
</script>

<template>
  <div>
    <!-- <pre>{{ formFields }}</pre> -->
    <UForm
      :id="`prospect-form-${props.formId}-embed`"
      :schema="schema"
      :state="state"
      class="space-y-4"
      @submit.prevent="onSubmit"
    >
      <template v-for="(field, key) in formFields" :key="key">
        <UFormField v-if="field.id" :label="field.label" :name="field.name" :description="field.title">
          <UInput
            v-if="field.element === 'input'"
            :id="field.id"
            v-model="state[field.id]"
            :type="field.type"
            :placeholder="field.placeholder"
          />
          <UTextarea
            v-else-if="field.element === 'textarea'"
            :id="field.id"
            v-model="state[field.id]"
            :placeholder="field.placeholder"
          />
        </UFormField>
      </template>
      <UButton
        type="submit"
        :loading="status === 'loading'"
        :disabled="status === 'loading'"
        loading-icon="i-lucide-loader"
      >
        Submit
      </UButton>
    </UForm>
  </div>
  <div>
    <p class="mt-6 text-xs text-muted">
      This site is protected by reCAPTCHA and the Google
      <a href="https://policies.google.com/privacy">Privacy Policy</a> and
      <a href="https://policies.google.com/terms">Terms of Service</a> apply.
    </p>
  </div>
</template>

<style>
.grecaptcha-badge { visibility: hidden; }
</style>
