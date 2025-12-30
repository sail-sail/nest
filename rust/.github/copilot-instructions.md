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

**永远不要手动创建 CRUD**。在 `codegen/src/tables/` 定义模式，运行 `nr codegen` 生成代码。

## 目录约定

| 目录 | 说明 |
|------|------|
| `generated/{mod}/{table}/` | 生成代码（勿改）|
| `app/{mod}/` | 手写业务代码 |

## 三层架构

```
app/{mod}/
├── {mod}_graphql.rs   # GraphQL 接口定义
├── {mod}_resolver.rs  # 参数解构/日志
└── {mod}_service.rs   # 业务逻辑/数据库
```

## 开发命令

```bash
nr start        # 开发服务器
nr build-prod   # 生产构建
nr typecheck    # clippy 检查
```

## 技术栈

- Rust + async-graphql + poem
- sqlx (MySQL)
- color_eyre 错误处理

## Agent Skills

| 技能 | 说明 |
|------|------|
| [graphql-api](skills/graphql-api/SKILL.md) | GraphQL 接口开发 |
| [excel-export](skills/excel-export/SKILL.md) | Excel 导出功能 |
