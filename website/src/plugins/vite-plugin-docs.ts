import type { Plugin } from 'vite'
import fs from 'fs'
import path from 'path'
import MarkdownIt from 'markdown-it'

const VIRTUAL_ID = 'virtual:docs'
const RESOLVED_ID = '\0' + VIRTUAL_ID

export default function docsPlugin(docsDir: string): Plugin {
  return {
    name: 'vite-plugin-docs',
    resolveId(id) {
      if (id === VIRTUAL_ID) return RESOLVED_ID
    },
    load(id) {
      if (id !== RESOLVED_ID) return

      const md = new MarkdownIt({ html: true, linkify: true })
      const docs: Record<string, { title: string; description: string; html: string }> = {}

      const resolved = path.resolve(docsDir)
      if (!fs.existsSync(resolved)) {
        return `export default ${JSON.stringify(docs)}`
      }

      for (const file of fs.readdirSync(resolved)) {
        if (!file.endsWith('.md') || file === 'README.md') continue

        const slug = file.replace('.md', '')
        const raw = fs.readFileSync(path.join(resolved, file), 'utf-8')

        // Extract title from first # heading
        const titleMatch = raw.match(/^#\s+(.+)$/m)
        const title = titleMatch ? titleMatch[1] : slug

        const descMatch = raw.match(/<meta\s+name="description"\s+content="([^"]+)"/)
        const description = descMatch ? descMatch[1] : ''

        // Remove the meta tag before rendering
        const cleaned = raw.replace(/<meta[^>]*>/g, '')
        const html = md.render(cleaned)

        docs[slug] = { title, description, html }
      }

      return `export default ${JSON.stringify(docs)}`
    },
  }
}
