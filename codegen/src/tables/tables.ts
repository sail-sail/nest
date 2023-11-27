import { defineConfig } from "../config";

import base from "./base/base";
import cron from "./cron/cron";

export default defineConfig({
  
  // 基础模块
  ...base,
  
  // 定时任务
  ...cron,
  
});
