/* supabase/functions/deno.d.ts */
/* Type declarations for Deno runtime & Supabase Edge Functions in VS Code / TypeScript */

declare module "@supabase/functions-js/edge-runtime.d.ts" {};

declare module "npm:@supabase/supabase-js@^2" {
  export * from "@supabase/supabase-js";
}

declare namespace Deno {
  export interface Env {
    get(key: string): string | undefined;
    set(key: string, value: string): void;
    delete(key: string): void;
    toObject(): Record<string, string>;
  }

  export const env: Env;

  export interface ServeOptions {
    port?: number;
    hostname?: string;
    signal?: AbortSignal;
    onListen?: (params: { port: number; hostname: string }) => void;
    onError?: (error: unknown) => Response | Promise<Response>;
  }

  export type ServeHandler = (
    request: Request,
    info?: { remoteAddr: { transport: string; hostname: string; port: number } }
  ) => Response | Promise<Response>;

  export function serve(handler: ServeHandler): void;
  export function serve(options: ServeOptions, handler: ServeHandler): void;
}
