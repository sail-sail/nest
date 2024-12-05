import { defineConfig } from "../config";

import base from "./base/base";

import submail from "./submail/submail";

export default defineConfig({
  
  // 基础模块
  ...base,
  
  // 短信模块
  ...submail,
  
});
