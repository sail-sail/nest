import { defineConfig } from "../config";

/** 是否使用国际化 */
export const isUseI18n = false;

import base from "./base/base";

import submail from "./submail/submail";

export default defineConfig({
  
  // 基础模块
  ...base,
  
  // 短信模块
  ...submail,
  
});
