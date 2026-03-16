# PC - 电脑端界面

## 目录约定

| 目录 | 说明 |
|------|------|
| `src/views/{mod}/{table}/` | 生成的 CRUD 视图 |
| `src/components/` | 通用组件(不需要import即可全局引用) |

## 生成文件结构

```
src/views/{mod}/{table}/
├── Model.ts    # 类型定义
├── List.vue    # 列表页（搜索/表格/分页）
├── Dialog.vue  # 新增/编辑弹窗
└── Api.ts      # GraphQL 操作
```

## 手写接口约定

- `Api.ts` 为生成文件, 尽量不手改
- 自定义 GraphQL 接口统一写到 `src/views/{mod}/{table}/Api2.ts`
- 页面中如果需要调用手写接口, 从 `./Api2.ts` 导入, 以减少与生成代码的 git 冲突

## 命名规范

| 类型 | 格式 | 示例 |
|------|------|------|
| 视图目录 | `{mod}/{table}` | `base/usr` |
| API 函数 | `findAll{Table}`, `create{Table}` | `findAllUsr` |
| 类型 | `{Table}Model`, `{Table}Input` | `UsrModel` |

## 编码规范
- 异常无需捕获，发起Graphql请求时会自动由全局错误处理器处理
- 使用 Vue Macros 的 reactivity transform（`$ref`、`$computed` 等）
- vue 相关的类型都无需导入, 如 `ref`, `computed` 等, 直接使用即可, 因为 `vite.config.mts` 配置了自动导入 `AutoImport`

## 可用 Skills (.agents/skills/)

- `pc-graphql-frontend` - 前端自定义 GraphQL API 接口. 当需要在 Vue 3 前端调用后端自定义接口（非标准 CRUD）时使用此技能
- `ui-style` - 页面开发样式规范. 开发 UI 界面时使用
- `unocss` - UnoCSS 即时原子 CSS 引擎，Tailwind CSS 的超集。当配置 UnoCSS、编写实用程序规则、快捷方式或使用 Wind、Icons、Attributify 等预设时使用
