import { defineConfig } from "../config";

import base from "./base/base";

/** 是否使用国际化 */
export const isUseI18n = false;

export default defineConfig({
  
  // 基础模块
  ...base,
  
});
