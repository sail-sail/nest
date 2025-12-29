# Nest Uni - 跨平台移动端

基于代码生成的 Uni-app 移动应用（微信小程序、H5、APP）。

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
| `src/pages/{table}/` | 生成的页面 |
| `src/components/` | 通用组件 |
| `src/compositions/` | 组合式函数 |

## 生成文件结构

```
src/pages/{table}/
├── List.vue    # 列表页
├── Dialog.vue  # 新增/编辑页
└── Api.ts      # GraphQL 操作
```

## 开发命令

```bash
nr dev:mp-weixin   # 微信小程序开发
nr dev:h5          # H5 开发
nr build-prod      # 生产构建
nr typecheck       # 类型检查
```

## 技术栈

- Vue 3 + Composition API + TypeScript
- Uni-app 跨平台框架
- Vite + UnoCSS
- GraphQL 客户端

## 平台条件编译

```vue
<!-- #ifdef MP-WEIXIN -->
<text>仅微信小程序</text>
<!-- #endif -->

<!-- #ifdef H5 -->
<text>仅 H5</text>
<!-- #endif -->
```
