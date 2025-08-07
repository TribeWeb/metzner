import { z } from 'zod'

const writeQuery = z.object({
  path: z.string(),
  folder: z.string(),
  slug: z.string(),
  order: z.coerce.string().optional()
})

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { path, folder, slug, order } = await getValidatedQuery(event, query => writeQuery.parse(query))

  try {
    return writeFile(body, path, folder, slug, order)
  } catch (err) {
    console.error(err)
  }

  return {}
})
