import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";

// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
const envProvider = import.meta.env
  ? import.meta.env
  : {
      VITE_NODE_ENV: "test",
      VITE_API_URL: "",
      VITE_DATA_PATH: "",
      CI: "true",
      MODE: "",
      VITE_DEBUG: undefined,
      VITE_HOSTNAME: undefined,
    };

export const env = createEnv({
  /**
   * The prefix that client-side variables must have. This is enforced both at
   * a type-level and at runtime.
   */
  clientPrefix: "PUBLIC_",

  client: {
    PUBLIC_API_URL: z.string().min(1),
    PUBLIC_NODE_ENV: z.enum(["production", "development", "test"]),
    PUBLIC_DEBUG: z
      .enum(["true", "false"])
      .transform((value) => value === "true")
      .optional(),
    PUBLIC_CI: z.literal("true").optional(),
    PUBLIC_DATA_PATH: z.string().min(1).optional(),
    PUBLIC_HOSTNAME: z
      .string()
      .url()
      .catch("ae-scenario-explorer.cloud.set.kuleuven.be"),
  },

  /**
   * What object holds the environment variables at runtime. This is usually
   * `process.env` or `import.meta.env`.
   */
  runtimeEnv: {
    PUBLIC_API_URL:
      envProvider.VITE_NODE_ENV === "test"
        ? "http://localhost:8081"
        : (envProvider.VITE_API_URL as string | undefined) ?? "/api",
    PUBLIC_NODE_ENV:
      (envProvider.VITE_NODE_ENV as string | undefined) ?? envProvider.MODE,
    PUBLIC_DEBUG: envProvider.VITE_DEBUG as string | undefined,
    PUBLIC_CI: envProvider.CI as string,
    PUBLIC_DATA_PATH: envProvider.VITE_DATA_PATH as string | undefined,
    PUBLIC_HOSTNAME: envProvider.VITE_HOSTNAME as string | undefined,
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
