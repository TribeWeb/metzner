import { z } from 'zod'

const writeQuery = z.object({
  path: z.string(),
  folder: z.string(),
  slug: z.string()
})

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { path, folder, slug } = await getValidatedQuery(event, query => writeQuery.parse(query))

  try {
    return writeFile(body, path, folder, slug)
  } catch (err) {
    console.error(err)
  }

  return {}
})
