declare module 'virtual:docs' {
  const docs: Record<string, {
    title: string
    description: string
    html: string
    toc: { id: string; title: string; level: number }[]
    text: string
    lastUpdated: string
  }>
  export default docs

  export interface DocsNavItem { title: string; slug: string; description: string }
  export interface DocsNavGroup {
    category: string
    description: string
    icon: string
    items: DocsNavItem[]
  }
  export const nav: DocsNavGroup[]
}
