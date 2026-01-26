---
name: ui-style
description: 页面开发样式规范。开发 UI 界面时使用
compatibility: Uni-app + UnoCSS
metadata:
  version: "1.0"
---

# 页面开发样式规范

## CSS - Attributify Mode

### 基础用法
将冗长的 class 拆分为语义化属性：

```html
<!-- ❌ 传统方式 -->
<tm-button class="bg-blue-400 hover:bg-blue-500 text-sm text-white font-mono py-2 px-4 rounded border-2">
  Button
</tm-button>

<!-- ✅ Attributify -->
<tm-button
  un-bg="blue-400 hover:blue-500"
  un-text="sm white"
  un-font="mono"
  un-p="y-2 x-4"
  un-border="2 rounded"
>
  Button
</tm-button>
```

### 自引用前缀 `~`
当属性名与值相同时使用：

```html
<!-- border border-red → un-border="~ red" -->
<tm-button
  un-border="~ red"
>
  Button
</tm-button>
<!-- flex flex-col → un-flex="~ col" -->
<view
  un-flex="~ col"
></view>
```

### 无值属性
无参数工具类直接作为属性：

```html
<view
  un-rounded
  un-truncate
  un-italic
></view>
```

### 原则
1. 相同前缀合并：`text-sm text-white` → `un-text="sm white"`
2. 自引用用 `~`：`flex flex-col` → `un-flex="~ col"`
3. 无参数用无值属性：`rounded` → `un-rounded`

## 自动引入的变量和组件
由 `unplugin-auto-import` 自动生成，无需手动维护。配置在 `vite.config.mts` 的 `AutoImport({imports:[]})` 中

### 全局变量
`src/typings/auto-imports.d.ts` 中的变量可直接使用：

```typescript
// 如 dayjs、ref、computed 等
const now = dayjs().format('YYYY-MM-DD');
```

### uni 中的 API 也可直接使用, 在 `src/typings/uni.d.ts` 中定义:

```typescript
const res = await uni.navigateTo({
  url: "/pages/index/index",
});
```

### 全局组件
`src/typings/components2.d.ts` 中的组件可直接在模板中使用：

```vue
<tm-button>Click Me</tm-button>
```

