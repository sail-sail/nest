import { defineConfig } from "../config";

import base from "./base/base";

import wx from "./wx/wx";
import wshop from "./wshop/wshop";

/** 是否使用国际化 */
export const isUseI18n = false;

export default defineConfig({
  
  // 基础模块
  ...base,
  
  // 微信模块
  ...wx,
  
  // 商城模块
  ...wshop,
  
});
