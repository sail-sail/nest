# Deno - GraphQL API 后端

## 目录约定

- `gen/` - 自动生成（不要修改）
- `src/` - 手写业务逻辑

## 命名规范

- 表名：`{module}_{table}`（如 `base_usr`）
- 类型：`{Table}Id`, `{Table}Model`, `{Table}Input`, `{Table}Search`
- 软删除：`is_deleted` 字段
- 外键：`xxx_id` + `xxx_id_lbl`
