declare module 'virtual:blog' {
  const posts: Record<string, {
    title: string
    date: string
    summary: string
    tags: string[]
    example: string
    html: string
    toc: { id: string; title: string; level: number }[]
    text: string
  }>
  export default posts
}
