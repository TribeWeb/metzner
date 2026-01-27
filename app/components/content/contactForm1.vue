<script setup lang="ts">
import { z } from 'zod'

const { data } = await useFetch<string>('https://userresources.prospect365.com/forms/QXZhbiBNZWR2ZWRldkFudvUt0fa+nPox7g%252Fhhu4C+wDua6PEgA==/2/form.js')

// console.log(data.value)
const htmlString = computed(() => data.value?.toString().split('a.innerHTML=')?.[1]?.split(';a.className')[0])
const html = computed(() => htmlString.value?.substring(1, htmlString.value.length - 1).replace(/\\"/g, '"').replace(/\\n/g, '').replace(/\\t/g, ' '))
const inputs = computed(() => {
  const div = document.createElement('div')
  div.innerHTML = html.value || ''
  return { inputs: getAttributes(div.getElementsByTagName('input')),
    labels: getAttributes(div.getElementsByTagName('label')),
    textareas: getAttributes(div.getElementsByTagName('textarea'))
  }
})
function getAttributes<T extends HTMLElement>(elements: HTMLCollectionOf<T> | null | undefined) {
  const attrs: Record<string, string>[] = []
  if (!elements) {
    return attrs
  }
  for (let i = 0; i < elements.length; i++) {
    const input = elements[i]
    if (!input) continue
    const attrObj: Record<string, string> = {}
    for (let j = 0; j < input.attributes.length; j++) {
      const attr = input.attributes[j]
      if (!attr) continue
      attrObj[attr.name] = attr.value
    }
    attrs.push(attrObj)
  }
  return attrs
}
// const document = computed(() => new DOMParser().parseFromString(html.value || '', '

// const wrapper = useTemplateRef('wrapper')

// onMounted(() => {
//   if (wrapper.value) {
//     wrapper.value.innerHTML = html.value || ''
//   }
// })

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
  <ClientOnly>
    <div v-html="html" />
    <pre>{{ inputs }}</pre>
    <!-- <div>{{ b }}</div> -->
  </ClientOnly>
</template>

<style scoped>

</style>
