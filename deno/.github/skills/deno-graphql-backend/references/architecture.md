# 架构约定参考

## 目录结构

```
deno/
├── gen/                    # 自动生成（不要修改）
│   ├── types.ts           # GraphQL 类型
│   └── {mod}/{table}/     # DAO、Model、GraphQL
├── src/                    # 手写业务逻辑
│   ├── graphql.ts         # 顶层入口
│   └── {mod}/             # 按模块组织
│       ├── graphql.ts     # 模块入口
│       └── {table}/       # 三层架构文件
└── lib/                    # 通用库
```

## 文件结构

```
src/{mod}/{table}/
├── {table}.graphql.ts   # GraphQL Schema 定义
├── {table}.model.ts     # 自定义类型(可选)
├── {table}.resolver.ts  # 参数解构/事务/认证
├── {table}.service.ts   # 业务逻辑
└── {table}.dao.ts       # 自定义 DAO(可选, 一般用 gen 下的)
```

## 命名约定

| 类型 | 规则 | 示例 |
|------|------|------|
| 表名 | `{mod}_{table}` | `base_usr` |
| ID类型 | `{Table}Id` | `UsrId` |
| 模型 | `{Table}Model` | `UsrModel` |
| 输入 | `{Table}Input` | `UsrInput` |
| 搜索 | `{Table}Search` | `UsrSearch` |

## 核心约定

| 约定 | 说明 |
|------|------|
| 软删除 | `is_deleted` 字段, 默认逻辑删除 |
| 审计字段 | `create_usr_id`, `create_time`, `update_usr_id`, `update_time` |
| 外键 | `xxx_id` + `xxx_id_lbl` (显示名称) |
| 多租户 | `tenant_id`, `org_id` 自动隔离 |
| 事务 | 增删改 `context.is_tran = true`, 查询不设置 |
| 认证 | 默认需登录, 公开接口设 `context.notVerifyToken = true` |
| 错误 | `throw "中文提示"` 业务错误, `throw new Error()` 系统错误 |

## 模块注册

```
src/graphql.ts（顶层）
  └── src/{mod}/graphql.ts（模块）
       └── src/{mod}/{table}/{table}.graphql.ts
```

在 `src/{mod}/graphql.ts` 添加：
```typescript
import "./{table}/{table}.graphql.ts";
```
