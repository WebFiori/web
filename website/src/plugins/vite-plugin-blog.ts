import type { Plugin } from 'vite'
import fs from 'fs'
import path from 'path'
import MarkdownIt from 'markdown-it'

const VIRTUAL_ID = 'virtual:blog'
const RESOLVED_ID = '\0' + VIRTUAL_ID

interface TocEntry { id: string; title: string; level: number }

interface BlogPost {
  title: string
  date: string
  summary: string
  tags: string[]
  example: string
  html: string
  toc: TocEntry[]
  text: string
}

function slugify(text: string): string {
  return text.toLowerCase().replace(/<[^>]+>/g, '').replace(/[^\w\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-').trim()
}

function parseFrontmatter(raw: string): { meta: Record<string, any>; content: string } {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/)
  if (!match) return { meta: {}, content: raw }

  const meta: Record<string, any> = {}
  for (const line of match[1].split('\n')) {
    const m = line.match(/^(\w[\w-]*):\s*(.+)$/)
    if (!m) continue
    let value: any = m[2].trim()
    // Parse array values: [a, b, c]
    if (value.startsWith('[') && value.endsWith(']')) {
      value = value.slice(1, -1).split(',').map((s: string) => s.trim().replace(/^["']|["']$/g, ''))
    } else {
      value = value.replace(/^["']|["']$/g, '')
    }
    meta[m[1]] = value
  }

  return { meta, content: match[2] }
}

export default function blogPlugin(blogDir: string): Plugin {
  return {
    name: 'vite-plugin-blog',
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
        html = html.replace(/<pre><code class="language-(\w+)">/g, (_match: string, lang: string) => {
          return `<pre data-lang="${lang}"><span class="code-lang-label">${lang}</span><code class="language-${lang}">`
        })
        return html
      }

      const posts: Record<string, BlogPost> = {}
      const resolved = path.resolve(blogDir)

      if (!fs.existsSync(resolved)) {
        return `export default ${JSON.stringify(posts)}`
      }

      for (const file of fs.readdirSync(resolved)) {
        if (!file.endsWith('.md')) continue

        const slug = file.replace('.md', '')
        const filePath = path.join(resolved, file)
        const raw = fs.readFileSync(filePath, 'utf-8')
        const { meta, content } = parseFrontmatter(raw)

        const toc: TocEntry[] = []
        for (const m of content.matchAll(/^(#{2,3})\s+(.+)$/gm)) {
          toc.push({ id: slugify(m[2]), title: m[2], level: m[1].length })
        }

        // Strip the first h1 heading (title is rendered by the Vue component from frontmatter)
        const contentWithoutTitle = content.replace(/^#\s+.+\r?\n+/, '')
        const html = md.render(contentWithoutTitle)
        const text = contentWithoutTitle.replace(/^#+\s+/gm, '').replace(/[`*_~\[\]()]/g, '').replace(/\n{2,}/g, '\n').trim()

        posts[slug] = {
          title: meta.title || slug,
          date: meta.date || '',
          summary: meta.summary || '',
          tags: Array.isArray(meta.tags) ? meta.tags : [],
          example: meta.example || '',
          html,
          toc,
          text,
        }
      }

      return `export default ${JSON.stringify(posts)}`
    },
  }
}
