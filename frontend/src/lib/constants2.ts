// this file avoid import loop with env.ts
import { env } from "@/env";
import { TEST } from "./constants";

export const SHOULD_ANIMATE = !(
  env.PUBLIC_NODE_ENV === TEST || env.PUBLIC_CI === "true"
);
