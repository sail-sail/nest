import { defineConfig } from "../config.ts";

import base from "./base/base.ts";
import bpm from "./bpm/bpm.ts";

/** 是否使用国际化 */
export const isUseI18n = false;

export default defineConfig({
  
  // 基础模块
  ...base,
  
  // 工作流模块
  ...bpm,
  
});
