/// <reference types="vite/client" />

declare module 'path' {
  export function resolve(...pathSegments: string[]): string;
}

declare const __dirname: string;
