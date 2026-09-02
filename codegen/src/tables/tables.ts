import { defineConfig } from "../config.ts";

import base from "./base/base.ts";

import tsdb from "./tsdb/tsdb.ts";

/** 是否使用国际化 */
export const isUseI18n = false;

export default defineConfig({
  
  // 基础模块
  ...base,
  
  // 时序数据库
  ...tsdb,
  
});
