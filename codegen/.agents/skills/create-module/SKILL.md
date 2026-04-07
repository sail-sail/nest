---
name: create-module
description: 创建新业务模块时使用
---

# 创建模块

## 文件结构

```
src/tables/{mod}/
├── {mod}.sql    # 表结构
└── {mod}.ts     # 表配置
```

## 步骤

1. 创建 `src/tables/{mod}/{mod}.sql`
2. 创建 `src/tables/{mod}/{mod}.ts`
3. 在 `src/tables/tables.ts` 注册：

```typescript
import { defineConfig } from "../config.ts";
import base from "./base/base.ts";
import {mod} from "./{mod}/{mod}.ts";

export default defineConfig({
  ...base,
  ...{mod},
});
```

4. 创建菜单 CSV: `src/tables/{mod}/base_menu.{mod}.sql.csv`

```csv
id,parent_id,lbl,route_path,is_home_hide,is_enabled,is_hidden,order_by
{uuid},,模块名称,,0,1,0,60000
{uuid},{parent_uuid},子菜单,/{mod}/{table},0,1,0,60001
```

- `parent_id` 为空表示根菜单
- `is_hidden=1, is_enabled=0` 表示隐藏菜单 (通常用于被其他页面内联查看的子表)
- **仅需创建 `base_menu.{mod}.sql.csv`**, 无需手动创建 `base_tenant_menu` 和 `base_role_menu`, 它们在 `npm run importCsv` 时自动生成
- **无需创建 `base_menu_lang`**, 国际化菜单仅在启用 i18n 时需要, 大部分系统不需要

## 示例

模块名: `ec`（电商）

```typescript
// src/tables/ec/ec.ts
import { defineConfig } from "../../config.ts";

export default defineConfig({
  // 订单
  ec_order: { /* 订单表配置 */ },
  // 订单明细
  ec_order_detail: { /* 订单明细配置 */ },
});
```
