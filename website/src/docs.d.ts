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
}
