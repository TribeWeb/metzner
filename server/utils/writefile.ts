// unlinkSync, readFileSync, statSync, readdirSync,
import { existsSync, mkdirSync, writeFileSync } from 'node:fs'
import * as path from 'node:path'
import { fileURLToPath } from 'node:url'
import yaml from 'js-yaml'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename) // "/Users/<username>/<documents-subfolder>/<project-root>/.nuxt/dev"

// contentFolderPath = "../../content/"
// folder = "dc-dc-converters"
// slug = "slug"

export const writeFile = (frontmatter: Machine, contentFolderPath = '../../content/', folder = 'imported', slug = 'slug'): string => {
  if (!contentFolderPath || !folder) {
    return 'contentFolderPath or folder is undefined'
  }
  const folderPath = createFolderPath(contentFolderPath, folder) // "/Users/<username>/<documents-subfolder>/<project-root>/content/2.products/<folder>"
  const filePath = path.resolve(folderPath, `${frontmatter[slug]}.md`)
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
