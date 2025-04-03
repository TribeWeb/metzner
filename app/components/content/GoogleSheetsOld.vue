<script setup lang="ts">
import { z } from 'zod'
import type { FormSubmitEvent } from '@nuxt/ui'
// import type { productSchema } from '../../../app/utils/transformZod'
// import * as schemas from '../../../app/utils/transformZod'

interface Props {
  sheets: string[]
  contentFolderPath: string
  googleSheets: { id: string, title: string }[]
}

const { sheets = ['sheet1'], contentFolderPath = '../../content', googleSheets = [{ id: 'a', title: 'b' }] } = defineProps<Props>()

const sheetsList = computed(() => googleSheets.map(sheet => ({ value: sheet.id, label: sheet.title })))

const spreadsheetPropsSchema = z.object({
  spreadsheetId: z.string().length(44),
  sheet: z.string(),
  columnFirst: z.string().min(1, 'Must be at least 1 character').max(2, 'Must be at most 2 characters').toUpperCase(),
  columnLast: z.string().min(1, 'Must be at least 1 character').max(2, 'Must be at most 2 characters').toUpperCase()
})

type Form = z.output<typeof spreadsheetPropsSchema>

const spreadsheetProps = reactive<Partial<Form>>({
  spreadsheetId: undefined,
  sheet: undefined,
  columnFirst: undefined,
  columnLast: undefined
})

const writeFile = reactive({
  slug: undefined,
  schema: 'machineSchema'
})

const schema = await import(`../../../app/utils/schemas/${writeFile.schema}.ts`)

// console.log(schema)
type Import = z.infer<typeof schema>

// https://content3.nuxt.dev/docs/collections/types#schema-overrides
// title, description (in body?), navigation || slug, folder, layout

function transformToArrayOfObjects(values: GoogleSheetsApiValues) {
  const transformed = values.map((value) => {
    const keys: string[] = values[0] || ['']
    const row: Import = {}
    value.map((_, j: number) => {
      const key: string = keys[j] || ''
      row[key] = value[j]
    })
    return row
  })
  return transformed.splice(1)
}

const { data: products, status, execute } = useFetch(() => `/api/import`, {
  query: spreadsheetProps,
  immediate: false,
  watch: false,
  transform: (googleSheetsApiResult: GoogleSheetsApiReturn) => {
    return transformToArrayOfObjects(googleSheetsApiResult.values)
  }
})

const columnList = computed(() => Object.keys(Object.assign({}, ...products.value || [])))

const productsLength = computed(() => products.value?.length || 0)
const logsLength = computed(() => logs.value?.length || 0)

const logs = ref<string[]>([])
async function start(arr: Import[]) {
  const transformed = arr.map(async (productObject: Import) => {
    const payload = schema.parse(productObject)
    const log = await $fetch<string>(`/api/write?path=${contentFolderPath}&folder=${spreadsheetProps.sheet}&slug=${writeFile.slug}`, {
      method: 'POST',
      body: payload
    })
    return logs.value.push(log)
  })
  return transformed
}

const toast = useToast()
async function onSubmit(event: FormSubmitEvent<Form>) {
  toast.add({ title: 'Success', description: 'The form has been submitted.', color: 'success' })
  console.log(event.data)
}
</script>

<template>
  <UContainer>
    <UForm
      v-model:state="spreadsheetProps"
      :schema="spreadsheetPropsSchema"
      class="space-y-4"
      @submit="onSubmit"
    >
      <UFormField
        label="Google Sheet spreadsheetId"
        name="spreadsheetId"
      >
        <USelect
          v-model="spreadsheetProps.spreadsheetId"
          :items="sheetsList"
          label="Google Sheet spreadsheetId"
          icon="i-heroicons-document-chart-bar-20-solid"
          class="w-60"
        />
      </UFormField>
      <UFormField
        label="Google Sheet name"
        name="sheet"
      >
        <USelect
          v-model="spreadsheetProps.sheet"
          :items="sheets"
          label="Name of sheet to import"
          icon="i-heroicons-document-chart-bar-20-solid"
          class="w-60"
        />
      </UFormField>
      <UFormField
        label="Range first column"
        name="columnFirst"
      >
        <UInput
          v-model="spreadsheetProps.columnFirst"
          type="text"
          label="Google Sheet range first column"
          icon="i-heroicons-document-chart-bar-20-solid"
          class="w-60"
        />
      </UFormField>
      <UFormField
        label="Range last column"
        name="columnLast"
      >
        <UInput
          v-model="spreadsheetProps.columnLast"
          type="text"
          label="Google Sheet range last column"
          icon="i-heroicons-document-chart-bar-20-solid"
          class="w-60"
        />
      </UFormField>
      <UFormField>
        <UButton
          label="Get product data from google sheets"
          icon="i-heroicons-document-arrow-down-20-solid"
          :disabled="status === 'pending' || !spreadsheetProps.spreadsheetId"
          :loading="status === 'pending'"
          @click.prevent="execute()"
        />
      </UFormField>
      <UFormField
        v-if="products?.length"
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
          v-if="products?.length"
          label="Write data to files"
          icon="i-heroicons-document-plus-20-solid"
          :disabled="!products"
          @click.prevent="start(products)"
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
    <UCard
      v-for="(product, p) in products"
      :key="p"
      class="mt-6"
    >
      <template #header>
        <div> {{ product.productCode }}</div>
      </template>

      <div
        v-for="(val, key, i) in product"
        :key="i"
      >
        <b>{{ key }} :</b> {{ val }}
      </div>

      <template #footer>
        <div>---</div>
      </template>
    </UCard>
  </UContainer>
</template>
