<script setup lang="ts">
import * as z from 'zod'
import type { FormSubmitEvent } from '@nuxt/ui'

const grecaptcha = useScript({
  // src: 'https://userresources.prospect365.com/forms/QXZhbiBNZWR2ZWRldkFudvUt0fa+nPox7g%252Fhhu4C+wDua6PEgA==/2/form.js'
  src: 'https://www.google.com/recaptcha/api.js?render=6Le8OnwrAAAAADJpzAKQUb_b6lOjp5vKejYe0N2x'
})
// const bob = useScript({
//   src: 'https://userresources.prospect365.com/forms/QXZhbiBNZWR2ZWRldkFudvUt0fa+nPox7g%252Fhhu4C+wDua6PEgA==/2/form.js'
//   // src: 'https://www.google.com/recaptcha/api.js?render=6LePT-IqAAAAAMlFW4QvwRgoORJmmWlLzk4MMAlU'
// })

const { data } = await useFetch<string>('https://userresources.prospect365.com/forms/QXZhbiBNZWR2ZWRldkFudvUt0fa+nPox7g%252Fhhu4C+wDua6PEgA==/2/form.js')

// const bob = JSON.parse(JSON.stringify((data.value as string).toString()))

// src: 'https://www.gstatic.com/recaptcha/releases/rW64dpMGAGrjU7JJQr9xxPl8/recaptcha__en.js',
// crossorigin: 'anonymous',
// integrity: 'sha384-stI8i0l4UnrupDOI6In0RQyfmG7x4RHoRSlzjf/yDu+T9clp2es/I4WNYpU4isM0'
console.log('grecaptcha', grecaptcha)
const fields = {
  'text-1660649455927-0': {
    'label': 'First Name',
    'formField': 'UInput',
    'type': 'text',
    'name': 'text-1660649455927-0',
    'field-mapping': 'Forename',
    'value': ''
  },
  'text-1660649456958-0': {
    'label': 'Last Name',
    'formField': 'UInput',
    'type': 'text',
    'name': 'text-1660649456958-0',
    'field-mapping': 'Surname',
    'value': ''
  },
  'text-1660649457896-0': {
    'label': 'Email',
    'formField': 'UInput',
    'type': 'email',
    'name': 'text-1660649457896-0',
    'field-mapping': 'Email',
    'value': ''
  },
  'text-1660649458928-0': {
    'label': 'Company Name',
    'formField': 'UInput',
    'type': 'text',
    'name': 'text-1660649458928-0',
    'field-mapping': 'CompanyName',
    'value': ''
  },
  'textarea-1740493755578-0': {
    'label': 'Message',
    'formField': 'UTextarea',
    'type': '',
    'name': 'textarea-1740493755578-0',
    'field-mapping': 'Custom',
    'value': ''
  },
  'prospect-form-3-url': {
    'label': '',
    'formField': 'UInput',
    'type': 'hidden',
    'name': 'prospect-form-3-url',
    'field-mapping': '',
    'value': 'https://metzner.nuxt.dev/contact'
  }
}

// const schema1 = z.object({
//   email: z.string().email('Invalid email'),
//   password: z.string().min(8, 'Must be at least 8 characters'),
//   message: z.string().optional()
// })

// type Schema1 = z.output<typeof schema1>

// const state1 = reactive<Partial<Schema1>>({
//   email: undefined,
//   password: undefined,
//   message: undefined
// })

const schema = z.object({
  'text-1660649455927-0': z.string(),
  'text-1660649456958-0': z.string(),
  'text-1660649458928-0': z.string(),
  'text-1660649457896-0': z.email('Invalid email'),
  'textarea-1740493755578-0': z.string().optional(),
  'prospect-form-3-url': z.string()
})

type Schema = z.output<typeof schema>

const state = reactive<Partial<Schema>>({
  'text-1660649455927-0': undefined,
  'text-1660649456958-0': undefined,
  'text-1660649458928-0': undefined,
  'text-1660649457896-0': undefined,
  'textarea-1740493755578-0': undefined,
  'prospect-form-3-url': fields['prospect-form-3-url'].value
})

const toast = useToast()
async function onSubmit(event: FormSubmitEvent<Schema>) {
  console.log('event', event)
  grecaptcha.enterprise.ready(async () => {
    const token = await grecaptcha.enterprise.execute('6Le8OnwrAAAAADJpzAKQUb_b6lOjp5vKejYe0N2x', { action: 'prospect_form' })
    console.log('token', token)
    // IMPORTANT: The 'token' that results from execute is an encrypted response sent by
    // reCAPTCHA to the end user's browser.
    // This token must be validated by creating an assessment.
    // See https://cloud.google.com/recaptcha/docs/create-assessment
  })
  toast.add({ title: 'Success', description: 'The form has been submitted.', color: 'success' })
  // console.log(event.data)
}

// (function () {
//   const e = window.location.toString()
//   const t = /https:\/\/metzner\.nuxt\.dev\/contact/
//   let r = false
//   if (document.currentScript?.src) {
//     const o = new URL(document.currentScript.src)
//     const a = new URLSearchParams(o.search)
//     r = a.get('preview') === 'true'
//   }
//   const n = new URL(e)
//   if (!r && n.host === 'builder.crmlandingpage.com') {
//     r = n.searchParams.get('previewMode') === 'true'
//   }
//   if (!r && !t.exec(e)) {
//     console.warn('[Prospect Forms : 3] Location is not allowed.')
//     return
//   }
//   const c = document.getElementById('prospect-form-3')
//   if (!c) {
//     console.warn('[Prospect Forms : 3] Unable to locate host element.')
//     return
//   }
//   if ('' && !('attachShadow' in c)) {
//     console.warn('[Prospect Forms : 3] Shadow DOM is not supported by the browser.')
//     return
//   }
//   function i() {
//     let e = false
//     let t = false
//     c.setAttribute('style', 'all: initial')
//     let o
//     const a = document.createElement('form')
//     a.innerHTML
//             = '<h2 id="control-3297415">Contact Us</h2><label for="text-1660649455927-0" class="prospect-form-text-label">First Name<span class="prospect-form-required">*</span></label><input type="text" class="form-control" name="text-1660649455927-0" field-mapping="Forename" column="span 1" id="text-1660649455927-0" required="required" aria-required="true" style="grid-column-end: span 1;"><label for="text-1660649456958-0" class="prospect-form-text-label">Last Name<span class="prospect-form-required">*</span></label><input type="text" class="form-control" name="text-1660649456958-0" field-mapping="Surname" column="span 1" id="text-1660649456958-0" required="required" aria-required="true" style="grid-column-end: span 1;"><label for="text-1660649457896-0" class="prospect-form-text-label">Email<span class="prospect-form-required">*</span></label><input type="email" class="form-control" name="text-1660649457896-0" field-mapping="Email" column="span 1" id="text-1660649457896-0" required="required" aria-required="true" style="grid-column-end: span 1;"><label for="text-1660649458928-0" class="prospect-form-text-label">Company Name<span class="prospect-form-required">*</span></label><input type="text" class="form-control" name="text-1660649458928-0" field-mapping="CompanyName" column="span 1" id="text-1660649458928-0" required="required" aria-required="true" style="grid-column-end: span 1;"><label for="textarea-1740493755578-0" class="prospect-form-textarea-label">Message</label><textarea class="form-control" name="textarea-1740493755578-0" field-mapping="Custom" column="span 1" id="textarea-1740493755578-0" style="grid-column-end: span 1;"></textarea><button class="prospect-form-submit" type="submit">Submit</button>'
//     a.className = 'prospect-form'
//     a.setAttribute('action', 'https://userresources.prospect365.com/forms/QXZhbiBNZWR2ZWRldkFudvUt0fa%2BnPox7g%252Fhhu4C%2BwDua6PEgA%3D%3D/3/submit')
//     a.setAttribute('method', 'POST')
//     a.id = 'prospect-form-3-embed'
//     a.onsubmit = function (r) {
//       r.preventDefault()
//       if (t) {
//         return
//       }
//       if (a.checkValidity() && !e) {
//         e = true
//         const n = a.querySelector('.prospect-form-submit')
//         t = true
//         a.classList.add('prospect-form-loading')
//         n.setAttribute('disabled', 'disabled')
//         n.setAttribute('style', 'background:url(https://userresources.prospect365.com/forms/spinner.svg) center center no-repeat;background-size:contain;color:transparent')
//         n.classList.add('prospect-btn-loading')
//         grecaptcha
//           .execute('6LePT-IqAAAAAMlFW4QvwRgoORJmmWlLzk4MMAlU', { action: 'prospect_form' })
//           .then(function (e) {
//             const t = document.createElement('input')
//             t.name = 'prospect-form-3-token'
//             t.type = 'hidden'
//             t.value = e
//             a.append(t)
//             const r = new URLSearchParams(new FormData(a))
//             r.append('redirect', 'false')
//             return fetch(a.getAttribute('action'), { method: 'post', body: r })
//           })
//           .then(function (e) {
//             if (e.status === 200) {
//               return e.json()
//             } else {
//               return Promise.reject(e.status + ' ' + e.statusText)
//             }
//           })
//           .then(function (e) {
//             window.location = e
//           })
//           .catch(function () {
//             e = false
//             t = false
//             n.removeAttribute('disabled')
//             n.removeAttribute('style')
//             n.classList.remove('prospect-btn-loading')
//             a.classList.remove('prospect-form-loading')
//             if (!o) {
//               o = document.createElement('p')
//               o.className = 'prospect-form-error'
//               o.textContent = 'An error occurred submitting the form. Please try again later.'
//               a.append(o)
//             }
//           })
//       }
//     }
//     const n = new URLSearchParams(window.location.search)
//     for (const i of ['medium', 'source', 'campaign', 'term', 'content']) {
//       const s = n.get('utm_' + i)
//       if (s) {
//         const d = document.createElement('input')
//         d.name = 'prospect-form-utm-' + i
//         d.type = 'hidden'
//         d.value = s
//         a.append(d)
//       }
//     }
//     const p = document.createElement('input')
//     p.name = 'prospect-form-3-url'
//     p.type = 'hidden'
//     p.value = window.location.toString()
//     a.append(p)
//     a.style = 'grid-template-columns: auto 1fr;'
//     const l = c.querySelector('.prospect-form-loading')
//     if (l) {
//       l.remove()
//     }
//     if (r) {
//       for (const u of a.querySelectorAll('button[type="submit"]')) {
//         u.disabled = true
//       }
//     }
//     if ('') {
//       const m = document.createElement('style')
//       m.textContent = ''
//       const f = c.attachShadow({ mode: 'open' })
//       f.append(m)
//       f.append(a)
//     } else {
//       c.append(a)
//     }
//   }
//   if (!r && typeof grecaptcha === 'undefined') {
//     const s = document.createElement('script')
//     s.src = 'https://www.google.com/recaptcha/api.js?render=6LePT-IqAAAAAMlFW4QvwRgoORJmmWlLzk4MMAlU'
//     s.onload = i
//     document.head.appendChild(s)
//   } else {
//     i()
//   }
// })()
</script>

<template>
  <UForm
    id="prospect-form-3-embed"
    :schema="schema"
    :state="state"
    class="space-y-4"
    action="https://userresources.prospect365.com/forms/QXZhbiBNZWR2ZWRldkFudvUt0fa%2BnPox7g%252Fhhu4C%2BwDua6PEgA%3D%3D/3/submit"
    method="POST"
    @submit="onSubmit"
  >
    <template v-for="(field, key) in fields" :key="key">
      <UFormField :label="field.label" :name="field.name">
        <UInput v-if="field.formField === 'UInput'" :id="key" v-model="state[key]" :type="field.type" :field-mapping="field['field-mapping']" />
        <UTextarea v-else-if="field.formField === 'UTextarea'" :id="key" v-model="state[key]" :field-mapping="field['field-mapping']" />
      </UFormField>
    </template>
    <!-- <UFormField v-for="(field, key) in state" :key="fields[key].id" :label="fields[key].label" :name="fields[key].name">
      <UInput v-if="fields[key].formField === 'UInput'" :id="fields[key].id" v-model="state[key]" :type="fields[key].type" />
      <UTextarea v-else-if="fields[key].formField === 'UTextarea'" :id="fields[key].id" v-model="state[key]" />
    </UFormField> -->
    <!-- <UFormField label="Email" name="email">
      <UInput v-model="state1.email" />
    </UFormField>

    <UFormField label="Password" name="password">
      <UInput v-model="state1.password" type="password" />
    </UFormField>

    <UFormField label="Message" name="message">
      <UTextarea v-model="state1.message" />
    </UFormField> -->

    <UButton type="submit">
      Submit
    </UButton>
  </UForm>
  <div id="prospect-form-2">
    <div class="prospect-form-loading" />
  </div>
  <!-- <script defer src="https://userresources.prospect365.com/forms/QXZhbiBNZWR2ZWRldkFudvUt0fa+nPox7g%252Fhhu4C+wDua6PEgA==/3/form.js" /> -->
  <!-- <div id="prospect-form-3" data-v-3c7a57e6="" style="all: initial">
    <form id="prospect-form-3-embed" class="prospect-form" action="https://userresources.prospect365.com/forms/QXZhbiBNZWR2ZWRldkFudvUt0fa%2BnPox7g%252Fhhu4C%2BwDua6PEgA%3D%3D/3/submit" method="POST" style="grid-template-columns: auto 1fr;">
      <h2 id="control-3297415">
        Contact Us
      </h2><label for="text-1660649455927-0" class="prospect-form-text-label">First Name<span class="prospect-form-required">*</span></label><input
        id="text-1660649455927-0"
        type="text"
        class="form-control"
        name="text-1660649455927-0"
        field-mapping="Forename"
        column="span 1"
        required="required"
        aria-required="true"
        style="grid-column-end: span 1;"
      ><label for="text-1660649456958-0" class="prospect-form-text-label">Last Name<span class="prospect-form-required">*</span></label><input
        id="text-1660649456958-0"
        type="text"
        class="form-control"
        name="text-1660649456958-0"
        field-mapping="Surname"
        column="span 1"
        required="required"
        aria-required="true"
        style="grid-column-end: span 1;"
      ><label for="text-1660649457896-0" class="prospect-form-text-label">Email<span class="prospect-form-required">*</span></label><input
        id="text-1660649457896-0"
        type="email"
        class="form-control"
        name="text-1660649457896-0"
        field-mapping="Email"
        column="span 1"
        required="required"
        aria-required="true"
        style="grid-column-end: span 1;"
      ><label for="text-1660649458928-0" class="prospect-form-text-label">Company Name<span class="prospect-form-required">*</span></label><input
        id="text-1660649458928-0"
        type="text"
        class="form-control"
        name="text-1660649458928-0"
        field-mapping="CompanyName"
        column="span 1"
        required="required"
        aria-required="true"
        style="grid-column-end: span 1;"
      ><label for="textarea-1740493755578-0" class="prospect-form-textarea-label">Message</label><textarea
        id="textarea-1740493755578-0"
        class="form-control"
        name="textarea-1740493755578-0"
        field-mapping="Custom"
        column="span 1"
        style="grid-column-end: span 1;"
      /><button class="prospect-form-submit" type="submit">
        Submit
      </button><input name="prospect-form-3-url" type="hidden" value="https://metzner.nuxt.dev/contact">
    </form>
  </div> -->
</template>

<style scoped>
.prospect-form-loading {
    width: "50px";
    height:"50px";
    margin:"0 auto";
    background:"url(https://userresources.prospect365.com/forms/spinner.svg) center center no-repeat";
    background-size:"contain"
  }
</style>
