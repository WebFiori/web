import type { Plugin } from 'vite'
import fs from 'fs'
import path from 'path'
import { execSync } from 'child_process'
import MarkdownIt from 'markdown-it'

const VIRTUAL_ID = 'virtual:docs'
const RESOLVED_ID = '\0' + VIRTUAL_ID

interface TocEntry { id: string; title: string; level: number }

interface NavItem { title: string; slug: string; description: string }
interface NavGroup { category: string; description: string; icon: string; items: NavItem[] }

// Default MDI icon per known group heading. Unlisted groups fall back to a generic icon.
const GROUP_ICONS: Record<string, string> = {
  'Getting Started': 'mdi-rocket-launch',
  'Core Features': 'mdi-cube-outline',
  'User Interface': 'mdi-palette',
  'Data & Storage': 'mdi-database',
  'File Handling': 'mdi-file-multiple',
  'Advanced Topics': 'mdi-sitemap',
  'Infrastructure': 'mdi-server',
  'Configuration': 'mdi-cog',
  'AI (Add-on Library)': 'mdi-robot',
}

// Groups in index.md that are not documentation categories and should be skipped.
const SKIP_GROUPS = new Set(['Quick Links'])

/**
 * Parses the docs index.md into an ordered navigation model.
 *
 * Recognizes:
 *   - `## Group Heading`                         -> a nav group
 *   - an optional plain paragraph after a heading -> the group description
 *   - `* [Title](learn/<slug>) - description`     -> a nav item in the group
 *
 * This makes index.md the single source of truth for docs navigation, so
 * adding a page requires no website code changes.
 */
function parseNav(indexPath: string): NavGroup[] {
  if (!fs.existsSync(indexPath)) return []

  const raw = fs.readFileSync(indexPath, 'utf-8')
  const lines = raw.split(/\r?\n/)
  const groups: NavGroup[] = []
  let current: NavGroup | null = null

  const itemRe = /^\*\s+\[([^\]]+)\]\(\s*(?:learn\/)?([a-z0-9-]+)\s*\)\s*(?:-\s*(.*))?$/i

  for (const line of lines) {
    const headingMatch = line.match(/^##\s+(.+?)\s*$/)
    if (headingMatch) {
      const category = headingMatch[1].trim()
      if (SKIP_GROUPS.has(category)) { current = null; continue }
      current = {
        category,
        description: '',
        icon: GROUP_ICONS[category] ?? 'mdi-book-open-variant',
        items: [],
      }
      groups.push(current)
      continue
    }

    if (!current) continue

    const itemMatch = line.match(itemRe)
    if (itemMatch) {
      current.items.push({
        title: itemMatch[1].trim(),
        slug: itemMatch[2].trim(),
        description: (itemMatch[3] ?? '').trim(),
      })
      continue
    }

    // First non-empty, non-list line under a heading becomes the group description.
    const trimmed = line.trim()
    if (trimmed !== '' && !trimmed.startsWith('*') && current.description === '' && current.items.length === 0) {
      current.description = trimmed
    }
  }

  // Drop groups that ended up with no items (e.g. prose-only sections).
  return groups.filter(g => g.items.length > 0)
}

function slugify(text: string): string {
  return text.toLowerCase().replace(/<[^>]+>/g, '').replace(/[^\w\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-').trim()
}

function getLastModified(filePath: string): string {
  try {
    const out = execSync(`git log -1 --format=%cI -- "${filePath}"`, { cwd: path.dirname(filePath), encoding: 'utf-8' }).trim()
    if (out) return out
  } catch { /* ignore */ }
  // Fallback to file mtime
  try {
    return fs.statSync(filePath).mtime.toISOString()
  } catch {
    return ''
  }
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

      // Add language label to fenced code blocks
      const originalRender = md.render.bind(md)
      md.render = (src: string, env?: any) => {
        let html = originalRender(src, env)
        // Inject lang labels into <pre><code class="language-xxx"> blocks
        html = html.replace(/<pre><code class="language-(\w+)">/g, (_match: string, lang: string) => {
          return `<pre data-lang="${lang}"><span class="code-lang-label">${lang}</span><code class="language-${lang}">`
        })
        return html
      }

      const docs: Record<string, { title: string; description: string; html: string; toc: TocEntry[]; text: string; lastUpdated: string }> = {}

      const resolved = path.resolve(docsDir)
      if (!fs.existsSync(resolved)) {
        return `export default ${JSON.stringify(docs)}`
      }

      for (const file of fs.readdirSync(resolved)) {
        if (!file.endsWith('.md') || file === 'README.md') continue

        const slug = file.replace('.md', '')
        const filePath = path.join(resolved, file)
        const raw = fs.readFileSync(filePath, 'utf-8')

        const titleMatch = raw.match(/^#\s+(.+)$/m)
        const title = titleMatch ? titleMatch[1] : slug

        const descMatch = raw.match(/<meta\s+name="description"\s+content="([^"]+)"/)
        const description = descMatch ? descMatch[1] : ''

        const toc: TocEntry[] = []
        for (const m of raw.matchAll(/^(#{2,3})\s+(.+)$/gm)) {
          toc.push({ id: slugify(m[2]), title: m[2], level: m[1].length })
        }

        const cleaned = raw.replace(/<meta[^>]*>/g, '')
        const html = md.render(cleaned)
        const text = cleaned.replace(/^#+\s+/gm, '').replace(/[`*_~\[\]()]/g, '').replace(/\n{2,}/g, '\n').trim()
        const lastUpdated = getLastModified(filePath)

        docs[slug] = { title, description, html, toc, text, lastUpdated }
      }

      const nav = parseNav(path.join(resolved, 'index.md'))

      return [
        `export default ${JSON.stringify(docs)}`,
        `export const nav = ${JSON.stringify(nav)}`,
      ].join('\n')
    },
  }
}
