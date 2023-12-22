import { defineConfig } from "../config";

import base from "./base/base";
import wx from "./wx/wx";
import wshop from "./wshop/wshop";

export default defineConfig({
  
  // 基础模块
  ...base,
  
  // 微信模块
  ...wx,
  
  // 商城模块
  ...wshop,
  
});
