import { defineConfig } from "../config";

import base from "./base/base";
import wxwork from "./wxwork/wxwork";

export default defineConfig({
  
  // 基础模块
  ...base,
  
  // 企业微信模块
  ...wxwork,
  
});
