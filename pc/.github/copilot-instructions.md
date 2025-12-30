# Nest PC - Vue 3 管理界面

基于代码生成的 Vue 3 + Element Plus 管理系统。

## 架构

| 模块 | 说明 |
|------|------|
| `deno/` | GraphQL API 后端 |
| `pc/` | Vue 3 + Element Plus 管理界面 |
| `uni/` | Uni-app 移动端 |
| `codegen/` | 代码生成引擎 |

## 核心原则

**永远不要手动创建 CRUD**。在 `codegen/src/tables/` 定义模式，运行 `nr codegen` 生成代码。

## 目录约定

| 目录 | 说明 |
|------|------|
| `src/views/{module}/{table}/` | 生成的 CRUD 视图 |
| `src/components/` | 通用组件 |
| `src/compositions/` | 组合式函数 |

## 生成文件结构

```
src/views/{module}/{table}/
├── List.vue    # 列表页（搜索/表格/分页）
├── Dialog.vue  # 新增/编辑弹窗
└── Api.ts      # GraphQL 操作
```

## 命名规范

| 类型 | 格式 | 示例 |
|------|------|------|
| 视图目录 | `{module}/{table}` | `base/usr` |
| API 函数 | `findAll{Table}`, `create{Table}` | `findAllUsr` |
| 类型 | `{Table}Model`, `{Table}Input` | `UsrModel` |

## 开发命令

```bash
nr start        # 开发服务器
nr build-prod   # 生产构建
nr typecheck    # 类型检查
```

## 技术栈

- Vue 3 + Composition API + TypeScript
- Element Plus 组件库
- Vite + UnoCSS
- GraphQL 客户端

## Agent Skills

前端自定义接口开发请查阅 [.github/skills/pc-graphql-frontend/SKILL.md](./skills/pc-graphql-frontend/SKILL.md)，包含：
- Query/Mutation 模板
- 类型导入规范
- 命名约定
