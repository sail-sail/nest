# Nest Rust - GraphQL API 后端

Rust + async-graphql + sqlx 后端服务。

## 架构

| 模块 | 说明 |
|------|------|
| `rust/` | GraphQL API 后端 |
| `pc/` | Vue 3 管理界面 |
| `uni/` | Uni-app 移动端 |
| `codegen/` | 代码生成引擎 |

## 核心原则

**无需手动创建 CRUD**。在 `codegen/src/tables/` 定义模式，运行 `nr codegen` 生成代码。

## 目录约定

| 目录 | 说明 |
|------|------|
| `generated/{mod}/{table}/` | 生成代码(可改但尽量不改)|
| `app/{mod}/` | 手写业务代码 |

## 三层架构

```
app/{mod}/{table}/
├── {table}_graphql.rs   # GraphQL 接口定义
├── {table}_resolver.rs  # 参数解构/日志
├── {table}_model.rs     # 类型定义
├── {table}_dao.rs       # 数据库操作
└── {table}_service.rs   # 业务逻辑/数据库
```
