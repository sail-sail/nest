---
name: ui-style
description: PC 页面开发样式规范。开发 PC 页面时使用
compatibility: Vue 3 + Element Plus + UnoCSS
metadata:
  version: "1.1"
---

# PC 页面开发样式规范

## 编码规范
- 使用 Vue Macros 的 reactivity transform（`$ref`、`$computed` 等）
- `src/typings/auto-imports.d.ts`、`src/typings/components.d.ts` 中已声明的 API 和组件无需导入；未声明的必须显式导入
- 函数定义或调用有 2 个及以上参数时，每个参数独占一行
- Vue 组件有 2 个及以上属性时，每个属性独占一行
- 空白行的缩进与上一行保持一致
- 主要结构块之间留空行，结构块前写用途注释

## UnoCSS Attributify
- 优先使用 `un-*` 属性
- 相同前缀合并：`text-sm text-white` → `un-text="sm white"`
- 属性名与工具类重复时用 `~`：`flex flex-col` → `un-flex="~ col"`
- 无参数工具类使用无值属性：`rounded` → `un-rounded`
- 同名属性只能写一次；静态值和动态值必须合并到动态绑定，例如：`` :un-text="`xs ${ color }`" ``

```html
<el-button
  un-bg="blue-400 hover:blue-500"
  un-p="y-2 x-4"
  un-flex="~"
  un-rounded
  un-box-border
>
  Button
</el-button>
```

只设置部分边框时，`un-border` 值必须以 `0` 开头，清除其他方向：`un-border="0 b-1 solid [#f0f2f5]"`

## 本地静态图标
- `uno.config.ts` 已将 `src/assets/iconfont/{icon_name}.svg` 注册为 `iconfont` collection
- 单色 SVG 优先用 `un-i="iconfont-图标名"` 挂在 `div`、`i` 等节点上；颜色、尺寸用 UnoCSS 属性设置
- 禁止为单色图标手写 `new URL(...svg, import.meta.url)` 或使用 `<img src=...>`
- 多色、渐变、位图仍使用 `<img>`
- SVG 不存在时，保留 `<!-- TODO: 需添加图标 {icon_name}.svg 到 src/assets/iconfont/ -->`，不要临时替换成图片

```html
<div
  un-i="iconfont-favorite_service"
  un-w="5"
  un-h="5"
  un-text="[#f08b6a]"
></div>
```

## 弹窗规范 — CustomDialog
- 业务页面禁止直接使用 `<el-dialog>`；自定义表单或复杂内容必须抽成同目录的 `XxxDialog.vue`
- 确认、删除等简单操作优先使用 `ElMessageBox.confirm(...)`
- `XxxDialog.vue` 统一通过 `CustomDialog`，并通过 `showDialog()` 返回 Promise
- 有操作模式时，为弹窗单独定义 `DialogAction`
- 按钮关闭、右上角关闭及其他关闭路径都必须 resolve `cancel`
- `type`：`auto` 自适应尺寸、`medium` 1250px、`large` 接近全屏；`default` 使用默认 960px × 90vh

### 弹窗骨架 `XxxDialog.vue`

```vue
<template>
<CustomDialog
  ref="customDialogRef"
  :before-close="beforeClose"
>
  <!-- 弹窗内容 -->
</CustomDialog>
</template>

<script setup lang="ts">
type DialogAction = "refund";

type OnCloseResolveType = {
  type: "ok" | "cancel";
};

let dialogAction = $ref<DialogAction>("refund");
let onCloseResolve = function(_value: OnCloseResolveType) {};

const customDialogRef = $(useTemplateRef("customDialogRef"));

async function showDialog(arg: { action: DialogAction }) {
  dialogAction = arg.action;
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

function onConfirm() {
  onCloseResolve({ type: "ok" });
}

function beforeClose(done: (cancel?: boolean) => void) {
  done(false);
  onClose();
}

defineExpose({ showDialog });
</script>
```

### 调用方

```typescript
const xxxDialogRef = $(useTemplateRef("xxxDialogRef"));

const res = await xxxDialogRef!.showDialog({ action: "refund" });
if (res.type === "ok") {
  await dataGrid(true);
}
```

### 示例参考
- `src/layout/change_password/ChangePassword.vue`
