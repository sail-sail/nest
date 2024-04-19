import { defineConfig } from "../config";

import base from "./base/base";

// 网站
import nuxt from "./nuxt/nuxt";

export default defineConfig({
  
  // 基础模块
  ...base,
  
  // 网站
  ...nuxt,
  
});
