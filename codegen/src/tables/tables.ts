import { defineConfig } from "../config";

import base from "./base/base";

// 电子档案
import eams from "./eams/eams";

/** 是否使用国际化 */
export const isUseI18n = false;

export default defineConfig({
  
  // 基础模块
  ...base,
  
  // 电子档案
  ...eams,
  
});
