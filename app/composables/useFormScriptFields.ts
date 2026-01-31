import * as cheerio from 'cheerio'

export function extractFormFields($: cheerio.CheerioAPI) {
  const labels = [] as Record<string, string>[]

  $('label').each((_, element) => {
    const attrs: Record<string, string> = {}
    for (const [name, value] of Object.entries(element.attribs || {})) {
      attrs[name] = value
    }
    attrs['data-label'] = $(element).text().trim().replace(/\s*\*$/, '') // Remove trailing asterisks for required fields
    labels.push(attrs)
  })

  const allFields = [] as Record<string, string>[]

  $(':input').each((_, element) => {
    const attrs: Record<string, string> = {}
    for (const [name, value] of Object.entries(element.attribs || {})) {
      attrs[name] = value
    }
    attrs['label'] = labels.find(label => label['for'] === attrs['id'])?.['data-label'] || ''
    attrs['element'] = element.tagName
    allFields.push(attrs)
  })

  return allFields
}

export async function useFormScriptFields(formId: string, prospectFormOrgId: string) {
  const { data } = await useFetch<string>(`https://userresources.prospect365.com/forms/${prospectFormOrgId}/${formId}/form.js`)

  const htmlString = computed(() => data.value?.toString().split('a.innerHTML=')?.[1]?.split(';a.className')[0])
  const html = computed(() => htmlString.value?.substring(1, htmlString.value.length - 1).replace(/\\"/g, '"').replace(/\\n/g, '').replace(/\\t/g, ' '))

  const formFields = computed(() => {
    const $ = cheerio.load(html.value || '')
    return extractFormFields($)
  })
  return formFields
}
