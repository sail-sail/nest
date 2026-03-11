# Uni - 移动端应用

## 目录约定

| 目录 | 说明 |
|------|------|
| `src/pages/{table}/` | 生成的页面 |
| `src/components/` | 通用组件(不需要import即可全局引用) |

## 生成文件结构

```
src/pages/{table}/
├── Model.ts    # 类型定义
├── List.vue    # 列表页
├── DetailModal.vue # 详情弹窗
├── Dialog.vue  # 新增/编辑页
└── Api.ts      # GraphQL 操作
```

## 编码规范
- 使用 Vue Macros 的 reactivity transform（`$ref`、`$computed` 等）
- 当 `[ ]` 代表的是值时中间有空格, 例如: `const arr = [ 1, 2, 3 ];`, `const arr = [ ];`, `{ }` 也同理
- 函数定义和调用的时候, 参数都换行, vue 组件属性也换行

## 可用 Skills (.agents/skills/)

- `ui-style` - 页面开发样式规范. 开发 UI 界面时使用
- `sub-package` - 微信小程序分包配置. 需要将页面拆分到子包时使用
- `unocss` - UnoCSS 即时原子 CSS 引擎，Tailwind CSS 的超集。当配置 UnoCSS、编写实用程序规则、快捷方式或使用 Wind、Icons、Attributify 等预设时使用
