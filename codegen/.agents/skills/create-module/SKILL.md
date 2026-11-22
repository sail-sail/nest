---
name: create-module
description: 创建新代码生成业务模块；串联建表、表配置、模块注册和菜单
---

# 创建模块

## 输出

```
codegen/src/tables/{mod}/
├── {mod}.sql
├── {mod}.ts
└── base_menu.{mod}.sql.csv  # 有页面入口时
```

## 流程

1. 确认 `{mod}` 未出现在 `src/tables/` 和 `src/tables/tables.ts`。
2. 按 [create-table/SKILL.md](../create-table/SKILL.md) 创建 `{mod}.sql`。
3. 按 [table-config/SKILL.md](../table-config/SKILL.md) 创建 `{mod}.ts`。
4. 在 `src/tables/tables.ts` 增量注册，保留现有模块：

```typescript
import {mod} from "./{mod}/{mod}.ts";

export default defineConfig({
  ...{mod},
});
```

5. 有页面入口时，按 [create-menu/SKILL.md](../create-menu/SKILL.md) 创建菜单 CSV。

## 约束

- 只生成或修改文件；不要执行数据库、`codegen`、`importCsv` 或 `permit` 命令。
- 隐藏明细菜单只设置 `is_hidden=1`，`is_enabled` 仍为 `1`；禁用是独立语义。
- 不手写 `base_role_menu`、`base_tenant_menu`；仅启用 i18n 时创建 `base_menu_lang`。
