/// <reference types="vite/client" />

declare module '*.mp3' {
  const src: string
  export default src
}

declare module '*.css' {
  const content: Record<string, string>
  export default content
}
