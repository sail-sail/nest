import { defineConfig } from "../config";

import base from "./base/base";

// 电子档案
import eams from "./eams/eams";

export default defineConfig({
  
  // 基础模块
  ...base,
  
  // 电子档案
  ...eams,
  
});
