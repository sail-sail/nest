# 新建模块规范
假如模块名字叫做: ec
1. sql文件: codegen/src/tables/ec/ec.sql
2. ts文件: codegen/src/tables/ec/ec.ts

3. 引入模块:
  - 在 codegen/src/tables/tables.ts 中引入模块
  ```ts
  import { defineConfig } from "../config";

  import base from "./base/base";

  import es from "./es/es.ts";

  /** 是否使用国际化 */
  export const isUseI18n = false;

  export default defineConfig({
    
    // 基础模块
    ...base,
    
    ...es,
    
  });
  ```
  其中: base 固定的基础模块
