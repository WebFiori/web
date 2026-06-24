import type { Plugin } from 'vite'
import fs from 'fs'
import path from 'path'
import { execSync } from 'child_process'

const BASE_URL = 'https://webfiori.com'

const STATIC_ROUTES = [
  { path: '/', changefreq: 'weekly', priority: '1.0' },
  { path: '/v3', changefreq: 'monthly', priority: '0.8' },
  { path: '/features', changefreq: 'monthly', priority: '0.8' },
  { path: '/getting-started', changefreq: 'monthly', priority: '0.8' },
  { path: '/docs', changefreq: 'weekly', priority: '0.9' },
  { path: '/blog', changefreq: 'weekly', priority: '0.9' },
  { path: '/libraries', changefreq: 'monthly', priority: '0.6' },
  { path: '/contributing', changefreq: 'monthly', priority: '0.5' },
]

function getLastMod(filePath: string): string {
  try {
    const out = execSync(`git log -1 --format=%cI -- "${filePath}"`, {
      cwd: path.dirname(filePath),
      encoding: 'utf-8',
    }).trim()
    if (out) return out.slice(0, 10)
  } catch { /* ignore */ }
  try {
    return fs.statSync(filePath).mtime.toISOString().slice(0, 10)
  } catch {
    return new Date().toISOString().slice(0, 10)
  }
}

function parseFrontmatterDate(raw: string): string {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---/)
  if (!match) return ''
  const dateMatch = match[1].match(/^date:\s*(.+)$/m)
  return dateMatch ? dateMatch[1].trim().replace(/["']/g, '') : ''
}

function buildUrl(entry: { loc: string; lastmod?: string; changefreq?: string; priority?: string }): string {
  let xml = `  <url>\n    <loc>${entry.loc}</loc>\n`
  if (entry.lastmod) xml += `    <lastmod>${entry.lastmod}</lastmod>\n`
  if (entry.changefreq) xml += `    <changefreq>${entry.changefreq}</changefreq>\n`
  if (entry.priority) xml += `    <priority>${entry.priority}</priority>\n`
  xml += `  </url>`
  return xml
}

export default function sitemapPlugin(docsDir: string, blogDir: string): Plugin {
  return {
    name: 'vite-plugin-sitemap',
    apply: 'build',
    closeBundle() {
      const today = new Date().toISOString().slice(0, 10)
      const urls: string[] = []

      // Static routes
      for (const route of STATIC_ROUTES) {
        urls.push(buildUrl({
          loc: `${BASE_URL}${route.path}`,
          lastmod: today,
          changefreq: route.changefreq,
          priority: route.priority,
        }))
      }

      // Doc pages
      const docsResolved = path.resolve(docsDir)
      if (fs.existsSync(docsResolved)) {
        for (const file of fs.readdirSync(docsResolved)) {
          if (!file.endsWith('.md') || file === 'README.md' || file === 'index.md') continue
          const slug = file.replace('.md', '')
          const filePath = path.join(docsResolved, file)
          urls.push(buildUrl({
            loc: `${BASE_URL}/docs/${slug}`,
            lastmod: getLastMod(filePath),
            changefreq: 'monthly',
            priority: '0.7',
          }))
        }
      }

      // Blog posts (only published)
      const blogResolved = path.resolve(blogDir)
      if (fs.existsSync(blogResolved)) {
        for (const file of fs.readdirSync(blogResolved)) {
          if (!file.endsWith('.md')) continue
          const filePath = path.join(blogResolved, file)
          const raw = fs.readFileSync(filePath, 'utf-8')
          const postDate = parseFrontmatterDate(raw)

          // Exclude future posts
          if (postDate && postDate > today) continue

          const slug = file.replace('.md', '')
          urls.push(buildUrl({
            loc: `${BASE_URL}/blog/${slug}`,
            lastmod: postDate || getLastMod(filePath),
            changefreq: 'yearly',
            priority: '0.7',
          }))
        }
      }

      const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join('\n')}
</urlset>
`

      const outDir = path.resolve('dist')
      fs.mkdirSync(outDir, { recursive: true })
      fs.writeFileSync(path.join(outDir, 'sitemap.xml'), sitemap)
      console.log(`✓ sitemap.xml generated with ${urls.length} URLs`)
    },
  }
}
