import { defineConfig } from "../config.ts";

import base from "./base/base.ts";

// 百度设置
import baidu from "./baidu/baidu";

/** 是否使用国际化 */
export const isUseI18n = false;

export default defineConfig({
  
  // 基础模块
  ...base,
  
  // 百度设置
  ...baidu,
  
});
