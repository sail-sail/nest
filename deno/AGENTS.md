# Deno - GraphQL API 后端

## 目录约定

- `gen/` - 自动生成（不要修改）
- `src/` - 手写业务逻辑

- 开发自定义业务逻辑时写上简洁的注释

## 命名规范

- 表名：`{module}_{table}`（如 `base_usr`）
- 类型：`{Table}Id`, `{Table}Model`, `{Table}Input`, `{Table}Search`
- 软删除：`is_deleted` 字段
- 外键：`xxx_id` + `xxx_id_lbl`

## 可用 Skills (.agents/skills/)

- `wx-pay` - 微信支付流程开发. 需要实现支付功能时使用
- `deno-graphql-backend` - GraphQL 后端接口的完整开发指南. 当需要创建、修改后端 API 接口时使用此技能
