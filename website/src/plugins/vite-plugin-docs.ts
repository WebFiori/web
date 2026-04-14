import type { Plugin } from 'vite'
import fs from 'fs'
import path from 'path'
import MarkdownIt from 'markdown-it'

const VIRTUAL_ID = 'virtual:docs'
const RESOLVED_ID = '\0' + VIRTUAL_ID

interface TocEntry { id: string; title: string; level: number }

function slugify(text: string): string {
  return text.toLowerCase().replace(/<[^>]+>/g, '').replace(/[^\w\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-').trim()
}

export default function docsPlugin(docsDir: string): Plugin {
  return {
    name: 'vite-plugin-docs',
    resolveId(id) {
      if (id === VIRTUAL_ID) return RESOLVED_ID
    },
    load(id) {
      if (id !== RESOLVED_ID) return

      const md = new MarkdownIt({ html: true, linkify: true })

      // Add ids to headings
      const defaultOpen = md.renderer.rules.heading_open || ((tokens, idx, opts, _env, self) => self.renderToken(tokens, idx, opts))
      md.renderer.rules.heading_open = (tokens, idx, opts, env, self) => {
        const token = tokens[idx]
        const inline = tokens[idx + 1]
        if (inline?.children) {
          const text = inline.children.map(t => t.content).join('')
          token.attrSet('id', slugify(text))
        }
        return defaultOpen(tokens, idx, opts, env, self)
      }

      const docs: Record<string, { title: string; description: string; html: string; toc: TocEntry[] }> = {}

      const resolved = path.resolve(docsDir)
      if (!fs.existsSync(resolved)) {
        return `export default ${JSON.stringify(docs)}`
      }

      for (const file of fs.readdirSync(resolved)) {
        if (!file.endsWith('.md') || file === 'README.md') continue

        const slug = file.replace('.md', '')
        const raw = fs.readFileSync(path.join(resolved, file), 'utf-8')

        const titleMatch = raw.match(/^#\s+(.+)$/m)
        const title = titleMatch ? titleMatch[1] : slug

        const descMatch = raw.match(/<meta\s+name="description"\s+content="([^"]+)"/)
        const description = descMatch ? descMatch[1] : ''

        // Extract TOC from raw markdown
        const toc: TocEntry[] = []
        for (const m of raw.matchAll(/^(#{2,3})\s+(.+)$/gm)) {
          toc.push({ id: slugify(m[2]), title: m[2], level: m[1].length })
        }

        const cleaned = raw.replace(/<meta[^>]*>/g, '')
        const html = md.render(cleaned)

        docs[slug] = { title, description, html, toc }
      }

      return `export default ${JSON.stringify(docs)}`
    },
  }
}
