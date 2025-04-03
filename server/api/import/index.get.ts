import { z } from 'zod'

const sheetQuery = z.object({
  spreadsheetId: z.string(),
  sheetTitle: z.string().optional(),
  range: z.string().optional(),
  callType: z.string().optional()
})

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig(event)
  const { spreadsheetId, sheetTitle, range, callType } = await getValidatedQuery(event, query => sheetQuery.parse(query))
  try {
    const googleApiKey = config.googleApiKey
    const sheetRange = `${sheetTitle}!${range}`
    let url = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${sheetRange}?key=${googleApiKey}`

    if (callType === 'sheet') {
      url = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}?key=${googleApiKey}`
    }

    const getRows = await $fetch(url)
    return getRows
  } catch (err) {
    console.error(err)
  }
  return {}
})
