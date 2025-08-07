// unlinkSync, readFileSync, statSync, readdirSync,
import { existsSync, mkdirSync, writeFileSync } from 'node:fs'
import * as path from 'node:path'
import { fileURLToPath } from 'node:url'
import yaml from 'js-yaml'
import type { Import } from '~~/app/utils/schemas'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename) // "/Users/<username>/<documents-subfolder>/<project-root>/.nuxt/dev"

// contentFolderPath = "../../content/"
// folder = "dc-dc-converters"
// slug = "slug"

export const writeFile = (frontmatter: Import, contentFolderPath: string = '../../content/', folder: string = 'imported', slug: string = 'slug', order: string = ''): string => {
  if (!contentFolderPath || !folder) {
    return 'contentFolderPath or folder is undefined'
  }
  const folderPath = createFolderPath(contentFolderPath, folder) // "/Users/<username>/<documents-subfolder>/<project-root>/content/2.products/<folder>"
  const filePrefix = order ? `${frontmatter[order as keyof Import]}.` : ''
  const filePath = path.resolve(folderPath, `${filePrefix}${frontmatter[slug as keyof Import]}.md`)
  writeFileSync(filePath, '---\n' + yaml.dump(frontmatter, { lineWidth: 360 }) + '---\n')
  return filePath

  function createFolderPath(contentFolderPath: string, folder: string): string {
    const folderPath = path.resolve(__dirname, `${contentFolderPath}/${folder}`)
    if (!existsSync(folderPath)) {
      mkdirSync(folderPath, { recursive: true })
    }
    return folderPath
  }
}
