---
name: ui-style
description: 页面开发样式规范。开发 UI 界面时使用
compatibility: Vue 3 + Element Plus + UnoCSS
metadata:
  version: "1.0"
---

# 页面开发样式规范

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

## 自动引入的变量和组件
由 `unplugin-auto-import` 自动生成，无需手动维护。配置在 `vite.config.mts` 的 `AutoImport({imports:[]})` 中

### 全局变量
`src/typings/auto-imports.d.ts` 中的变量可直接使用：

```typescript
// 如 dayjs、ref、computed 等
const now = dayjs().format('YYYY-MM-DD');
```

### 全局组件
`src/typings/components.d.ts` 中的组件可直接在模板中使用：

```vue
<el-button>Click Me</el-button>
```

## 弹窗规范 — CustomDialog

禁止在页面中内联 `el-dialog`，所有弹窗必须使用 `CustomDialog` 组件，抽离为独立的 `XxxDialog.vue` 文件。

### 核心规则
- **一个弹窗一个文件**：`XxxDialog.vue` 放在同目录下
- **Promise 模式**：`showDialog()` 返回 Promise，调用方 `await` 获取结果
- **DialogAction**：每个弹窗定义自己的 `DialogAction` 类型
- **CustomDialog type**：`"auto"` 自适应 / `"medium"` 中等 / `"large"` 大

### 弹窗骨架 `XxxDialog.vue`

```typescript
type DialogAction = "refund"; // 按业务定义

type OnCloseResolveType = {
  type: "ok" | "cancel";
};

let onCloseResolve = function(_value: OnCloseResolveType) { };

const customDialogRef = $(useTemplateRef("customDialogRef"));

async function showDialog(arg: { action: DialogAction; row: XxxModel }) {
  const dialogRes = customDialogRef!.showDialog<OnCloseResolveType>({
    type: "auto",
    title: "弹窗标题",
  });
  onCloseResolve = dialogRes.onCloseResolve;
  return await dialogRes.dialogPrm;
}

function onClose() {
  onCloseResolve({ type: "cancel" });
}

async function onConfirm() {
  onCloseResolve({ type: "ok" });
}

defineExpose({ showDialog });
```

### 调用方

```typescript
const xxxDialogRef = $(useTemplateRef("xxxDialogRef"));

const res = await xxxDialogRef!.showDialog({ action: "refund", row });
if (res.type === "ok") {
  await dataGrid(true);
}
```

### 示例参考
- `src/layout/change_password/ChangePassword.vue`
