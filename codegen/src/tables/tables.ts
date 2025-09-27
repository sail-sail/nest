import { defineConfig } from "../config.ts";

import base from "./base/base.ts";

import submail from "./submail/submail";

/** 是否使用国际化 */
export const isUseI18n = false;

export default defineConfig({
  
  // 基础模块
  ...base,
  
  // 短信模块
  ...submail,
  
});
