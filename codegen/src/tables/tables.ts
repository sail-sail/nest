import { defineConfig } from "../config.ts";

import base from "./base/base.ts";

// 网站
import nuxt from "./nuxt/nuxt";

/** 是否使用国际化 */
export const isUseI18n = false;

export default defineConfig({
  
  // 基础模块
  ...base,
  
  // 网站
  ...nuxt,
  
});
