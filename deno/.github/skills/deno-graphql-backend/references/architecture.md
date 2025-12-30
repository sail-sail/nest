# 架构约定参考

## 目录结构

```
deno/
├── gen/                    # 自动生成（不要修改）
│   ├── types.ts           # GraphQL 类型
│   └── {module}/{table}/  # DAO、Model、GraphQL
├── src/                    # 手写业务逻辑
│   ├── graphql.ts         # 顶层入口
│   └── {module}/          # 按模块组织
│       ├── graphql.ts     # 模块入口
│       └── {feature}/     # 三层架构文件
└── lib/                    # 通用库
```

## 命名约定

| 类型 | 规则 | 示例 |
|------|------|------|
| 表名 | `{module}_{table}` | `base_usr` |
| ID类型 | `{Table}Id` | `UsrId` |
| 模型 | `{Table}Model` | `UsrModel` |
| 输入 | `{Table}Input` | `UsrInput` |
| 搜索 | `{Table}Search` | `UsrSearch` |

## 核心约定

- **软删除**: `is_deleted` 字段，默认逻辑删除
- **审计字段**: `create_usr_id`, `create_time`, `update_usr_id`, `update_time`
- **外键**: `xxx_id` + `xxx_id_lbl` (显示名称)
- **多租户**: `tenant_id`, `org_id` 自动隔离

## 模块注册

```
src/graphql.ts（顶层）
  └── src/{module}/graphql.ts（模块）
       └── src/{module}/{feature}/{feature}.graphql.ts
```

在 `src/{module}/graphql.ts` 添加：
```typescript
import "./{feature}/{feature}.graphql.ts";
```
