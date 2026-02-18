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

所有弹窗必须使用 `CustomDialog` 组件，将弹窗逻辑抽离为独立的 `.vue` 文件，而非在页面中内联 `el-dialog`。

### 核心原则
- **一个弹窗一个文件**：弹窗逻辑、模板、状态全部封装在独立的 `XxxDialog.vue` 中
- **Promise 模式**：通过 `customDialogRef.showDialog()` 返回 Promise，调用方 `await` 获取结果
- **dialogAction**：每个弹窗都定义 `DialogAction` 类型，便于后续扩展复用

### 错误方式 — 在页面中内联弹窗

```vue
<!-- List.vue 中内联写弹窗，导致文件臃肿 -->
<template>
  <!-- ...列表代码... -->
  <el-dialog v-model="dialogVisible" title="退款">
    <!-- 弹窗内容写在这里 -->
  </el-dialog>
</template>

<script setup>
let dialogVisible = $ref(false);
// 大量弹窗逻辑代码全堆在 List.vue 里...
</script>
```

### 正确方式 — 独立弹窗文件

#### 1. 弹窗组件 `XxxDialog.vue`

```vue
<template>
<CustomDialog
  ref="customDialogRef"
>
  <div
    un-flex="~ col"
    un-p="4"
  >
    
    <!-- 表单内容 -->
    <el-form
      label-width="90px"
    >
      
      <el-form-item
        label="字段名"
      >
        <CustomInput
          v-model="dialogModel.field"
        ></CustomInput>
      </el-form-item>
      
    </el-form>
    
    <!-- 底部按钮 -->
    <div
      un-p="y-3"
      un-box-border
      un-flex
      un-justify-center
      un-items-center
    >
      
      <el-button
        @click="onClose"
      >
        <span>取消</span>
      </el-button>
      
      <el-button
        type="primary"
        @click="onConfirm"
      >
        <span>确定</span>
      </el-button>
      
    </div>
    
  </div>
</CustomDialog>
</template>

<script lang="ts" setup>

type DialogAction = "refund"; // 按业务定义，如 "refund" | "adjust" 等

type DialogModel = {
  id?: XxxId;
  // ...业务字段
};

function initDialogModel(): DialogModel {
  return {
    id: undefined,
  };
}

let dialogModel = $ref<DialogModel>(initDialogModel());

// eslint-disable-next-line @typescript-eslint/no-unused-vars
let dialogAction = $ref<DialogAction>("refund");

type OnCloseResolveType = {
  type: "ok" | "cancel";
};

let onCloseResolve = function(_value: OnCloseResolveType) { };

const customDialogRef = $(useTemplateRef("customDialogRef"));

/** 打开对话框 */
async function showDialog(
  arg: {
    action: DialogAction;
    row: XxxModel; // 按业务需要传入数据
  },
) {
  const dialogRes = customDialogRef!.showDialog<OnCloseResolveType>({
    type: "auto",
    title: "弹窗标题",
  });
  onCloseResolve = dialogRes.onCloseResolve;
  dialogAction = arg.action;

  // 初始化弹窗数据
  dialogModel = {
    id: arg.row.id,
  };

  return await dialogRes.dialogPrm;
}

/** 关闭 */
function onClose() {
  onCloseResolve({
    type: "cancel",
  });
}

/** 确定 */
async function onConfirm() {
  // 业务逻辑...
  onCloseResolve({
    type: "ok",
  });
}

defineExpose({
  showDialog,
});
</script>
```

#### 2. 调用方 `List.vue`

```vue
<template>
  <!-- ...页面内容... -->
  <XxxDialog
    ref="xxxDialogRef"
  ></XxxDialog>
</template>

<script lang="ts" setup>
import XxxDialog from "./XxxDialog.vue";

const xxxDialogRef = $(useTemplateRef("xxxDialogRef"));

async function onXxx() {
  const res = await xxxDialogRef!.showDialog({
    action: "refund",
    row,
  });
  if (res.type === "ok") {
    // 刷新数据等后续操作
    await dataGrid(true);
  }
}
</script>
```

### 关键要点

| 要点 | 说明 |
|------|------|
| 文件命名 | `XxxDialog.vue`，放在同一目录下 |
| showDialog 参数 | 必须包含 `action`，业务数据按需传入 |
| 返回值 | `{ type: "ok" \| "cancel" }`，可按需扩展更多字段 |
| dialogAction | 每个弹窗自定义，如 `"refund"`、`"adjust"`，不必统一 |
| 数据初始化 | 在 `showDialog` 中完成，不用 `initDialogModel` 外部调用 |
| API 调用 | 弹窗内部完成，调用方只关心结果 |
| CustomDialog type | `"auto"` 自适应 / `"medium"` 中等 / `"large"` 大 |


## 示例参考
- `src/layout/change_password/ChangePassword.vue`
