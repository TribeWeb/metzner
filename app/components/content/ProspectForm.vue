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

const hiddenFields = {
  [`prospect-form-${props.formId}-url`]: z.url().optional(),
  [`prospect-form-${props.formId}-token`]: z.string().optional(),
  redirect: z.string().optional()
}

const fieldMap = [
  {
    prospectId: 'Email',
    zodDef: z.email('Please enter a valid email')
  },
  {
    prospectId: 'Forename',
    zodDef: z.string('Please enter your first name')
  },
  {
    prospectId: 'Surname',
    zodDef: z.string('Please enter your last name')
  },
  {
    prospectId: 'CompanyName',
    zodDef: z.string('Please enter your company name')
  }
]

const formSchema = computed(() => {
  const prospectFields: Record<string, z.ZodEmail | z.ZodString | z.ZodOptional<z.ZodString>> = {}
  formFields.value.forEach((field) => {
    const fallBack = field.required === 'required' ? z.string() : z.string().optional()
    if (field.id) {
      prospectFields[field.id] = fieldMap.find(map => map.prospectId === field['field-mapping'])?.zodDef || fallBack
    }
  })
  return { ...prospectFields, ...hiddenFields }
})

const formState = computed(() => {
  const state: Record<string, string | undefined> = {}
  Object.entries(formSchema.value).forEach(([key]) => {
    state[key] = undefined
  })
  return state
})

const schema = z.object(
  formSchema.value
)

type Schema = z.output<typeof schema>

const state = reactive<Schema>(
  formState.value
)

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
    <pre>{{ formFields }}</pre>
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
