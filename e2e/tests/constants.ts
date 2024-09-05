import {
  DEFAULT_ATTRIBUTE,
  DEFAULT_INDICATOR,
  DEFAULT_SCENARIO,
  TAB_CONTENT_TESTID,
} from "@/lib/constants";

export const DEFAULT_DATA_HEADER = `${DEFAULT_INDICATOR} by ${DEFAULT_ATTRIBUTE} for ${DEFAULT_SCENARIO}`;
export const APP_PORT = "3002";
export const APP_URL = `http://localhost:${APP_PORT}`;
export const ACTIVE_DATA_TAB_LOCATOR = `[data-testid="${TAB_CONTENT_TESTID}"][data-state="active"]`;
