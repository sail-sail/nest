import { defineConfig } from "../config";

/** 是否使用国际化 */
export const isUseI18n = false;

import base from "./base/base";

// 电子档案
import eams from "./eams/eams";

export default defineConfig({
  
  // 基础模块
  ...base,
  
  // 电子档案
  ...eams,
  
});
