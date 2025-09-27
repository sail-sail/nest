import { defineConfig } from "../config.ts";

import base from "./base/base.ts";

import cron from "./cron/cron";

/** 是否使用国际化 */
export const isUseI18n = false;

export default defineConfig({
  
  // 基础模块
  ...base,
  
  // 定时任务
  ...cron,
  
});
