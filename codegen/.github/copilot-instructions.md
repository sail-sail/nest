# Nest Codegen - 代码生成引擎

从数据库模式定义自动生成 GraphQL API 和前端组件。

## 架构

| 模块 | 说明 |
|------|------|
| `deno/` | GraphQL API 后端 |
| `pc/` | Vue 3 管理界面 |
| `uni/` | Uni-app 移动端 |
| `codegen/` | 代码生成引擎 |

## 目录约定

| 目录 | 说明 |
|------|------|
| `src/tables/{mod}/{mod}.sql` | 表结构定义 |
| `src/tables/{mod}/{mod}.ts` | 表配置 |
| `src/tables/tables.ts` | 模块注册 |

## 生成输出

| 目标 | 路径 |
|------|------|
| 后端 | `deno/gen/{mod}/{table}/` |
| PC端 | `pc/src/views/{mod}/{table}/` |
| 移动端 | `uni/src/pages/{table}/` |

## 命名规范

| 类型 | 格式 | 示例 |
|------|------|------|
| 表名 | `{mod}_{table}` | `base_usr` |
| 主键 | `id` varchar(22) | UUID base64 |
| 外键 | `{table}_id` | `usr_id` |
| 标签 | `lbl` / `{fk}_lbl` | 显示名称 |

## 开发命令

```bash
nr codegen      # 生成并应用代码
nr uuid         # 生成 UUID
nr importCsv    # 导入字典数据
```

## Agent Skills

| 技能 | 说明 |
|------|------|
| [create-module](skills/create-module/SKILL.md) | 创建新模块 |
| [create-table](skills/create-table/SKILL.md) | 数据库建表规范 |
| [table-config](skills/table-config/SKILL.md) | 表配置规范 |
| [dict](skills/dict/SKILL.md) | 字典配置 |
