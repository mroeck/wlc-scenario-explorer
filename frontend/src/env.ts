import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";
import { TEST } from "./lib/constants";

export const env = createEnv({
  /**
   * The prefix that client-side variables must have. This is enforced both at
   * a type-level and at runtime.
   */
  clientPrefix: "PUBLIC_",

  client: {
    PUBLIC_API_URL: z.string().min(1),
    PUBLIC_NODE_ENV: z.enum(["production", "development", "test"]),
    PUBLIC_DEBUG: z.boolean().optional(),
  },

  /**
   * What object holds the environment variables at runtime. This is usually
   * `process.env` or `import.meta.env`.
   */
  runtimeEnv: {
    PUBLIC_API_URL:
      import.meta.env.VITE_NODE_ENV === TEST
        ? "http://localhost:8081"
        : (import.meta.env.VITE_API_URL as string | undefined) ?? "/api",
    PUBLIC_NODE_ENV:
      (import.meta.env.VITE_NODE_ENV as string | undefined) ??
      import.meta.env.MODE,
    PUBLIC_DEBUG: import.meta.env.VITE_DEBUG as string | undefined,
  },

  /**
   * By default, this library will feed the environment variables directly to
   * the Zod validator.
   *
   * This means that if you have an empty string for a value that is supposed
   * to be a number (e.g. `PORT=` in a ".env" file), Zod will incorrectly flag
   * it as a type mismatch violation. Additionally, if you have an empty string
   * for a value that is supposed to be a string with a default value (e.g.
   * `DOMAIN=` in an ".env" file), the default value will never be applied.
   *
   * In order to solve these issues, we recommend that all new projects
   * explicitly specify this option as true.
   */
  emptyStringAsUndefined: true,
});
