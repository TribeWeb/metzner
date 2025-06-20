<script setup lang="ts">
import type { z } from 'zod'
import { schemas } from '#imports'

interface Props {
  query: {
    spreadsheetId: string
    sheetTitle: string
    range: string
    schema: string
    callType: string
  }
}

const contentFolderPath = '../../content/data'

const { query } = defineProps<Props>()
const localQuery = computed(() => ({ ...query, callType: 'values', sheetTitleKebab: kebabize(query.sheetTitle) }))

// Schema handling
const availableSchemas = computed(() => schemas as Record<string, z.ZodSchema>)
const requestedSchema = computed(() => query.schema)
const schemaExists = computed(() =>
  requestedSchema.value in availableSchemas.value
)
const activeSchema = computed(() =>
  schemaExists.value ? availableSchemas.value[requestedSchema.value] : null
)

// Type inference from schema
type SchemaType = z.infer<NonNullable<typeof activeSchema.value>>

const writeFile = reactive({
  slug: undefined
})

function formatZodError(issues: z.ZodIssue[]) {
  return issues.map((issue) => {
    const path = issue.path.join('.')
    const message = issue.message
    return `Column "${path}": ${message}`
  }).join('\n')
}

function handleArraysAndFalseyValues(columnName: string[], value: string | undefined): undefined | null | string[] | string {
  // TODO: handle booleans when there are no falsey values (implying that the data contains 'false' (which evaluates to true) instead of '')
  const schema = activeSchema.value as z.ZodObject<SchemaType>
  const path = columnName.join('.')
  const columnSchema = zodDeepPick(schema, path)
  const wrapType = zodWrapType(columnSchema)
  console.log(isZodArray(columnSchema), value)
  if (isZodArray(columnSchema)) {
    // console.log(isZodArray(columnSchema), value)
    if (value) return value.split(',').map(value => value.trim())
    if (wrapType === 'ZodOptional') return undefined
    if (wrapType === 'ZodNullable') return null
    return []
  }
  if (value) return value
  if (wrapType === 'ZodOptional') return undefined
  if (wrapType === 'ZodNullable') return null
  return ''
}

function pathsToTree(paths: string[], values: string | string[]) {
  // console.log('pathsToTree', paths, values)
  const pathTree = {}
  let index = 0
  if (paths instanceof Array === false) {
    throw new Error('Expected an Array of file paths, but saw ' + paths)
  }

  function mergePathsIntoFileTree(prevDir: Record<string, unknown>, currDir: string, i: number, pathSegments: string[]): Record<string, unknown> {
    if (i === pathSegments.length - 1) {
      prevDir[currDir] = handleArraysAndFalseyValues(pathSegments, values[index])
    }
    if (!(currDir in prevDir)) {
      prevDir[currDir] = {}
    }
    return prevDir[currDir]
  }

  function parseFilePath(path: string, i: number) {
    index = i
    const pathSegments = path.split('.')
    // If file is in root directory, eg 'index.js'
    if (pathSegments.length === 1) {
      return (pathTree[pathSegments[0]] = handleArraysAndFalseyValues(pathSegments, values[index]))
    }
    // pathSegments.reduce(mergePathsIntoFileTree, pathTree)
    pathSegments.reduce((prevDir, currDir, i, pathSegments) => mergePathsIntoFileTree(prevDir, currDir, i, pathSegments), pathTree)
  }

  paths.forEach(parseFilePath)
  return pathTree
}

function transformToArrayOfObjects(values: string[][]): SchemaType[] {
  if (!values?.length) return []
  if (!activeSchema.value) {
    toast.add({
      title: 'Data Validation Error',
      description: `Schema "${requestedSchema.value}" not found`,
      color: 'error'
    })
    return []
  }
  const [headers, ...rows] = values as [string[], ...string[][]]
  let prevError = ''
  return rows
    .map((row) => {
      const record = pathsToTree(headers, row)
      if (!activeSchema.value) return null
      const parsed = activeSchema.value.safeParse(record)
      if (!parsed.success) {
        console.log('no', record)
        const errorMessage = formatZodError(parsed.error.issues)
        if (prevError === parsed.error.message) {
          return null
        }
        toast.add({
          title: 'Data Validation Error',
          description: `${errorMessage}`,
          color: 'error',
          icon: 'i-heroicons-exclamation-triangle-20-solid'
        })
        prevError = parsed.error.message
      } else {
        return parsed.data
      }
    })
    .filter(Boolean) as SchemaType[]
}

// API fetch
const { data: values, status, execute } = useFetch('/api/import', {
  query: localQuery,
  immediate: false,
  watch: false,
  transform: (response: { values: string[][] }) =>
    transformToArrayOfObjects(response.values)
})

function kebabize(str: string) {
  return str.replace(/[A-Z]+(?![a-z])|[A-Z]/g, ($, ofs) => (ofs ? '-' : '') + $.toLowerCase())
}

const columnList = computed(() => Object.keys(Object.assign({}, ...values.value || [])))

const productsLength = computed(() => values.value?.length || 0)
const logsLength = computed(() => logs.value?.length || 0)

const logs = ref<string[]>([])
async function start(arr: Import[]) {
  const transformed = arr.map(async (importedObject: Import) => {
    // const payload = schema.parse(productObject)
    const log = await $fetch<string>(`/api/write?path=${contentFolderPath}&folder=${localQuery.value.sheetTitleKebab}&slug=${writeFile.slug}`, {
      method: 'POST',
      body: importedObject
    })
    return logs.value.push(log)
  })
  return transformed
}

const toast = useToast()
</script>

<template>
  <div>
    <!-- <pre>{{ activeSchema.shape['material'] }}</pre> -->
    <UButton
      label="Get data from google sheets"
      icon="i-heroicons-document-arrow-down-20-solid"
      :loading="status === 'pending'"
      @click.prevent="execute()"
    />
    <UForm :state="writeFile">
      <UFormField
        v-if="values?.length"
        label="Choose column to use as slug"
        name="slug"
      >
        <USelect
          v-model="writeFile.slug"
          :items="columnList"
          label="Column to use as slug/filename"
          icon="i-heroicons-document-chart-bar-20-solid"
          class="w-60"
        />
      </UFormField>
      <UFormField>
        <UButton
          v-if="values?.length"
          label="Write data to files"
          icon="i-heroicons-document-plus-20-solid"
          :disabled="!values"
          @click.prevent="start(values)"
        />
      </UFormField>
    </UForm>
    <UProgress
      class="mt-6"
      :model-value="logsLength"
      :max="productsLength"
      status
      :get-value-label="((value: number, max: number) => `${value} of ${max}`)"
    />
    <UCollapsible class="flex flex-col gap-2 w-full mt-6">
      <UButton
        label="Writing progress"
        color="neutral"
        variant="subtle"
        trailing-icon="i-lucide-chevron-down"
        block
      />

      <template #content>
        <pre class="text-xs">{{ logs }}</pre>
      </template>
    </UCollapsible>
    <div v-if="values">
      <pre>{{ values }}</pre>
    </div>
  </div>
</template>
