import { defineConfig } from "../config";

import base from "./base/base";

// 百度设置
import baidu from "./baidu/baidu";

export default defineConfig({
  
  // 基础模块
  ...base,
  
  // 百度设置
  ...baidu,
  
});
