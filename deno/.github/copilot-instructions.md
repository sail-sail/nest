# Nest - 全栈代码生成系统

基于数据库模式定义，自动生成 GraphQL API、前端组件。

## 架构

| 模块 | 说明 |
|------|------|
| `deno/` | Deno + Oak + GraphQL API 服务器 |
| `pc/` | Vue 3 + Element Plus 管理界面 |
| `uni/` | Uni-app 移动端（小程序、H5、APP） |
| `codegen/` | 代码生成引擎 |

## 核心原则

**永远不要手动创建 CRUD**。在 `codegen/src/tables/` 定义模式，运行 `nr codegen` 生成代码。

## 目录约定

- `gen/` - 自动生成（不要修改）
- `src/` - 手写业务逻辑

## 命名规范

- 表名：`{module}_{table}`（如 `base_usr`）
- 类型：`{Table}Id`, `{Table}Model`, `{Table}Input`, `{Table}Search`
- 软删除：`is_deleted` 字段
- 外键：`xxx_id` + `xxx_id_lbl`

## Agent Skills

后端接口开发请查阅 [.github/skills/deno-graphql-backend/SKILL.md](./skills/deno-graphql-backend/SKILL.md)，包含：
- 三层架构模板（GraphQL/Resolver/Service）
- DAO 函数使用
- 事务处理规则
- 认证权限处理
- 错误处理规范
