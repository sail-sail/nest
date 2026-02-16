# PC - Vue 3 管理界面

## 目录约定

| 目录 | 说明 |
|------|------|
| `src/views/{module}/{table}/` | 生成的 CRUD 视图 |
| `src/components/` | 通用组件(不需要import即可全局引用) |
| `src/compositions/` | 组合式函数 |

## 生成文件结构

```
src/views/{module}/{table}/
├── Model.ts    # 类型定义
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

## 编码约定
- 异常无需捕获，发起Graphql请求时会自动由全局错误处理器处理
- vue 相关的类型都无需导入, 如 `ref`, `computed` 等, 直接使用即可, 因为 `vite.config.mts` 配置了自动导入 `AutoImport`

## 可用 Skills (.github/skills/)

- `pc-graphql-frontend` - 前端自定义 GraphQL API 接口. 当需要在 Vue 3 前端调用后端自定义接口（非标准 CRUD）时使用此技能
- `ui-style` - 页面开发样式规范. 开发 UI 界面时使用
