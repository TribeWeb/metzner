import * as cheerio from 'cheerio'
import { parse } from 'acorn'
import { simple } from 'acorn-walk'

// Resolves string-like AST expressions that appear in the vendor script.
// We currently support direct literals, static template literals, and
// identifiers that were previously assigned a string value.
function getStringValue(expression: unknown, constantStrings: Record<string, string>) {
  if (typeof expression !== 'object' || expression === null || !('type' in expression)) {
    return ''
  }

  if (expression.type === 'Literal' && 'value' in expression && typeof expression.value === 'string') {
    return expression.value
  }

  if (
    expression.type === 'TemplateLiteral'
    && 'expressions' in expression
    && Array.isArray(expression.expressions)
    && expression.expressions.length === 0
    && 'quasis' in expression
    && Array.isArray(expression.quasis)
  ) {
    return expression.quasis
      .map((quasi) => {
        if (typeof quasi !== 'object' || quasi === null || !('value' in quasi)) {
          return ''
        }
        const value = quasi.value
        if (typeof value !== 'object' || value === null) {
          return ''
        }
        if ('cooked' in value && typeof value.cooked === 'string') {
          return value.cooked
        }
        if ('raw' in value && typeof value.raw === 'string') {
          return value.raw
        }
        return ''
      })
      .join('')
  }

  if (expression.type === 'Identifier' && 'name' in expression && typeof expression.name === 'string') {
    return constantStrings[expression.name] || ''
  }

  return ''
}

function extractInnerHtml(script: string) {
  if (!script) {
    return ''
  }

  try {
    // Parse the full JS payload safely instead of relying on string slicing.
    const ast = parse(script, {
      ecmaVersion: 'latest',
      sourceType: 'script'
    }) as Parameters<typeof simple>[0]

    // Stores simple `const foo = '...'` style assignments for later lookups.
    const constantStrings: Record<string, string> = {}
    let extractedHtml = ''

    simple(ast, {
      VariableDeclarator(node: unknown) {
        if (typeof node !== 'object' || node === null || !('id' in node)) {
          return
        }
        const id = node.id
        if (typeof id !== 'object' || id === null || !('type' in id) || id.type !== 'Identifier' || !('name' in id) || typeof id.name !== 'string') {
          return
        }
        const init = 'init' in node ? node.init : undefined
        const value = getStringValue(init, constantStrings)
        if (value) {
          constantStrings[id.name] = value
        }
      },
      AssignmentExpression(node: unknown) {
        if (extractedHtml) {
          return
        }

        if (typeof node !== 'object' || node === null || !('left' in node) || !('right' in node)) {
          return
        }

        const left = node.left
        if (typeof left !== 'object' || left === null || !('type' in left) || left.type !== 'MemberExpression') {
          return
        }

        const isComputed = 'computed' in left && left.computed === true
        const property = 'property' in left ? left.property : undefined
        const isIdentifierProperty
          = !isComputed
            && typeof property === 'object'
            && property !== null
            && 'type' in property
            && property.type === 'Identifier'
            && 'name' in property
            && property.name === 'innerHTML'
        const isLiteralProperty
          = isComputed
            && typeof property === 'object'
            && property !== null
            && 'type' in property
            && property.type === 'Literal'
            && 'value' in property
            && property.value === 'innerHTML'
        const isInnerHtmlProperty
          = isIdentifierProperty || isLiteralProperty

        if (!isInnerHtmlProperty) {
          return
        }

        // Capture the first innerHTML assignment found in the script.
        extractedHtml = getStringValue(node.right, constantStrings)
      }
    })

    return extractedHtml
  } catch {
    // If the script format changes or parse fails, fail gracefully.
    return ''
  }
}

export function extractFormFields($: cheerio.CheerioAPI) {
  const labels = [] as Record<string, string>[]

  $('label').each((_, element) => {
    const attrs: Record<string, string> = {}
    for (const [name, value] of Object.entries(element.attribs || {})) {
      attrs[name] = value
    }
    attrs['data-label'] = $(element).text().trim().replace(/\s*\*$/, '').replace(/\s*\?$/, '') // Remove trailing asterisks and question amrks for required fields
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

export async function useFormScriptFields(id: number, prospectFormOrgId: string) {
  const { data } = await useFetch<string>(`https://userresources.prospect365.com/forms/${prospectFormOrgId}/${id}/form.js`)
  const html = computed(() => {
    const script = data.value?.toString() || ''
    return extractInnerHtml(script)
  })

  const formFields = computed(() => {
    // Cheerio is still used here to query labels/inputs from extracted HTML.
    const $ = cheerio.load(html.value || '')
    return extractFormFields($)
  })

  return formFields
}
