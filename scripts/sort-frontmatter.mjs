import { readdir, readFile, writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import yaml from 'js-yaml'

const CONTENT_DIR = 'content'
const FRONTMATTER_ORDER = [
  'title',
  'description',
  'fieldGroup',
  'navigation',
  'questions',
  'headerCopy'
]

async function walkMarkdownFiles(dir) {
  const entries = await readdir(dir, { withFileTypes: true })
  const files = await Promise.all(entries.map(async (entry) => {
    const path = join(dir, entry.name)
    if (entry.isDirectory()) {
      return walkMarkdownFiles(path)
    }

    if (entry.isFile() && path.endsWith('.md')) {
      return [path]
    }

    return []
  }))

  return files.flat()
}

function sortTopLevelKeys(frontmatter) {
  if (!frontmatter || typeof frontmatter !== 'object' || Array.isArray(frontmatter)) {
    return frontmatter
  }

  const ordered = {}
  const remaining = new Set(Object.keys(frontmatter))

  for (const key of FRONTMATTER_ORDER) {
    if (key in frontmatter) {
      ordered[key] = frontmatter[key]
      remaining.delete(key)
    }
  }

  for (const key of Object.keys(frontmatter)) {
    if (remaining.has(key)) {
      ordered[key] = frontmatter[key]
    }
  }

  return ordered
}

function replaceFrontmatter(content) {
  const match = content.match(/^---\n([\s\S]*?)\n---\n?/)
  if (!match) {
    return null
  }

  const parsed = yaml.load(match[1])
  if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
    return null
  }

  const ordered = sortTopLevelKeys(parsed)
  const dumped = yaml.dump(ordered, {
    lineWidth: 160,
    noRefs: true,
    sortKeys: false
  }).trimEnd()

  const rest = content.slice(match[0].length)
  return `---\n${dumped}\n---\n${rest.replace(/^\n*/, '')}`
}

async function main() {
  const files = await walkMarkdownFiles(CONTENT_DIR)

  await Promise.all(files.map(async (filePath) => {
    const content = await readFile(filePath, 'utf8')
    const next = replaceFrontmatter(content)

    if (next && next !== content) {
      await writeFile(filePath, next)
    }
  }))
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
