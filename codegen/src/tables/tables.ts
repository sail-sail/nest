import { defineConfig } from "../config";

import base from "./base/base";
import wx from "./wx/wx";
import esw from "./esw/esw";

export default defineConfig({
  
  // 基础模块
  ...base,
  
  // 微信模块
  ...wx,
  
  // 企服模块
  ...esw,
  
});
