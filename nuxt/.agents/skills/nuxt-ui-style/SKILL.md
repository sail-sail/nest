---
name: nuxt-ui-style
description: 页面开发样式规范。开发 UI 界面时使用
compatibility: Vue 3 + Nuxt 4 + UnoCSS
metadata:
  version: "1.0"
---

# 页面开发样式规范

## 编码规范
- 使用 Vue Macros 的 reactivity transform（`$ref`、`$computed` 等）
- vue 相关的类型都无需导入, 如 `ref`, `computed` 等, 直接使用即可
- 函数定义和调用的时候, 参数都换行, vue 组件属性也换行

## CSS - Attributify Mode

### 基础用法
将冗长的 class 拆分为语义化属性：

```html
<!-- ❌ 传统方式 -->
<el-button class="bg-blue-400 hover:bg-blue-500 text-sm text-white font-mono py-2 px-4 rounded border-2">
  Button
</el-button>

<!-- ✅ Attributify -->
<el-button
  un-bg="blue-400 hover:blue-500"
  un-text="sm white"
  un-font="mono"
  un-p="y-2 x-4"
  un-border="2 rounded"
>
  Button
</el-button>
```

### 自引用前缀 `~`
当属性名与值相同时使用：

```html
<!-- border border-red → un-border="~ red" -->
<el-button
  un-border="~ red"
>
  Button
</el-button>
<!-- flex flex-col → un-flex="~ col" -->
<div
  un-flex="~ col"
></div>
```

### 无值属性
无参数工具类直接作为属性：

```html
<div
  un-rounded
  un-truncate
  un-italic
></div>
```

### 原则
1. 相同前缀合并：`text-sm text-white` → `un-text="sm white"`
2. 自引用用 `~`：`flex flex-col` → `un-flex="~ col"`
3. 无参数用无值属性：`rounded` → `un-rounded`

