<script setup lang="ts">
import { z } from 'zod'

interface Props {
  googleSheets: { id: string, label: string }[]
}

const { googleSheets } = defineProps<Props>()

const showButton = ref(false)

const googleSheetSchema = z.object({
  spreadsheetId: z.string().length(44),
  sheetTitle: z.string(),
  range: z.string(),
  schema: z.string(),
  callType: z.enum(['sheet', 'values'])
})

type Form = z.output<typeof googleSheetSchema>

const googleSheet = reactive<Partial<Form>>({
  spreadsheetId: undefined,
  sheetTitle: undefined,
  range: undefined,
  schema: undefined,
  callType: 'sheet'
})

function columnCountToRange(columnCount: number): string {
  let dividend = columnCount
  let columnName = ''
  let modulo: number
  while (dividend > 0) {
    modulo = (dividend - 1) % 26
    columnName = String.fromCharCode(65 + modulo) + columnName
    dividend = Math.floor((dividend - modulo) / 26)
  }
  return `A:${columnName}`
}

const { data: sheetTitles, status, execute } = useFetch(() => `/api/import`, {
  query: googleSheet,
  immediate: false,
  watch: false,
  transform: (googleSheetsApiResult: GoogleSheetsApiSheetResponse) => {
    return googleSheetsApiResult.sheets.map((sheet: GoogleSheetsApiSheet) => ({
      label: sheet.properties.title,
      range: columnCountToRange(sheet.properties.gridProperties.columnCount)
    }
    ))
  },
  onResponse() {
    toast.add({ title: 'Success', description: 'The Google Sheet sheet titles have been retrieved.', color: 'success' })
  }
})

const upperCaseRange = computed({
  get: () => googleSheet.range,
  set: (value: string | undefined) => {
    googleSheet.range = value?.toUpperCase() || ''
  }
})

watch(() => ({ ...googleSheet }), (newVal, oldVal) => {
  if (newVal.spreadsheetId !== oldVal.spreadsheetId) {
    googleSheet.sheetTitle = undefined
    googleSheet.range = undefined
    googleSheet.schema = undefined
    execute()
  } else if (!googleSheet.range) {
    googleSheet.range = sheetTitles.value?.find(sheet => sheet.label === googleSheet.sheetTitle)?.range
  }
  if (googleSheet.sheetTitle && !googleSheet.schema) {
    googleSheet.schema = googleSheet.sheetTitle.replace(/ /g, '_')
  }
}, { deep: true })

const toast = useToast()
</script>

<template>
  <UContainer>
    <UForm
      :state="googleSheet"
      :schema="googleSheetSchema"
      class="space-y-4"
    >
      <UFormField
        label="Google Sheet spreadsheetId"
        name="spreadsheetId"
      >
        <USelect
          v-model="googleSheet.spreadsheetId"
          :items="googleSheets"
          value-key="id"
          label="Google Sheet spreadsheetId"
          icon="i-heroicons-document-chart-bar-20-solid"
          class="w-60"
          :loading="status === 'pending'"
        />
      </UFormField>
      <UFormField
        v-if="sheetTitles"
        label="Google Sheet titles"
        name="sheetTitle"
      >
        <USelect
          v-model="googleSheet.sheetTitle"
          :items="sheetTitles"
          value-key="label"
          label="Google Sheet sheet titles"
          icon="i-heroicons-document-chart-bar-20-solid"
          class="w-60"
        />
      </UFormField>
      <UFormField
        v-if="googleSheet.sheetTitle"
        label="Google Sheet range"
        name="range"
      >
        <UInput
          v-model="upperCaseRange"
          label="something"
          icon="i-heroicons-document-chart-bar-20-solid"
          class="w-60"
        />
      </UFormField>
      <UFormField
        v-if="googleSheet.range"
        label="Google Sheet schema"
        name="schema"
      >
        <UInput
          v-model="googleSheet.schema"
          label="schema"
          icon="i-heroicons-document-chart-bar-20-solid"
          class="w-60"
        />
      </UFormField>
      <UButton
        label="Get data from google sheets"
        icon="i-heroicons-document-arrow-down-20-solid"
        :loading="status === 'pending'"
        @click.prevent="showButton = true"
      />
    </UForm>
    <GoogleSheetsValues v-if="showButton" :query="googleSheet" />
  </UContainer>
</template>
