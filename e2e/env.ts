import 'dotenv/config'
import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";

const preprocessEnv = (env: NodeJS.ProcessEnv) => {
  if (!env.APP_URL && env.BASE_URL) {
    env.APP_URL = '/';
  }
  if (!env.API_URL && env.BASE_URL) {
    env.API_URL = '/api';
  }
  return env;
};
 
export const env = createEnv({ 
  /**
   * The prefix that client-side variables must have. This is enforced both at
   * a type-level and at runtime.
   */
  clientPrefix: "",
 
  client: {
    API_URL: z.string().min(1),
    APP_URL: z.string().min(1),
  },
 
  /**
   * What object holds the environment variables at runtime. This is usually
   * `process.env` or `import.meta.env`.
   */
  runtimeEnv: preprocessEnv(process.env),
 
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