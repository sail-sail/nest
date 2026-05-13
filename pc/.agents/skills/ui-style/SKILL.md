---
name: ui-style
description: 页面开发样式规范。开发 UI 界面时使用
compatibility: Vue 3 + Element Plus + UnoCSS
metadata:
  version: "1.0"
---

# 页面开发样式规范

## 编码规范
- 使用 Vue Macros 的 reactivity transform（`$ref`、`$computed` 等）
- vue 相关的类型都无需导入, 如 `ref`, `computed` 等, 直接使用即可, 因为 `vite.config.mts` 配置了自动导入 `AutoImport`
- 函数定义和调用的时候, 参数都换行, vue 组件属性也换行
- 空白行代码缩进要保持和上一行一致, 方便后续添加代码
- 大块标签之间要留空行
- 结构标签上面写上注释

## CSS - Attributify Mode

### 基础用法
将冗长的 class 拆分为语义化属性：

```html
<!-- ❌ 传统方式 -->
<el-button class="bg-blue-400 hover:bg-blue-500 py-2 px-4 box-border">
  Button
</el-button>

<!-- ✅ Attributify -->
<el-button
  un-bg="blue-400 hover:blue-500"
  un-p="y-2 x-4"
  un-box-border
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
把一组 class 改写成 Attributify 属性时, 按下面顺序逐条判断, 不需要一次套用所有规则：
1. 先看能否合并相同前缀：`text-sm text-white` → `un-text="sm white"`
2. 如果属性名和值里有重复词, 再用自引用 `~`：`flex flex-col` → `un-flex="~ col"`
3. 如果工具类本身没有参数, 直接改成无值属性：`rounded` → `un-rounded`
4. 如果只保留单边边框, 且同时写 `solid` 或颜色, 先用 `0` 清零未显式定义的其它边框方向：`un-border="0 b-1 solid [#f0f2f5]"`, 不要写成 `un-border="b-1 solid [#f0f2f5]"`

## 本地静态 Icon
- 当前 uni 仓库已在 `uno.config.ts` 和 `uno_uni.config.ts` 中通过 UnoCSS `presetIcons` 注册了 `iconfont` collection，会自动读取 `src/assets/iconfont/{icon_name}.svg`
- 对这类本地单色 svg 图标, 优先使用 `un-i="iconfont-图标名"` 挂在 `view` / `text` 等普通节点上，不要再写成 `image + src`，也不要用 `new URL(...svg, import.meta.url)` 去手动引资源
- 图标颜色、尺寸直接用 UnoCSS 原子属性控制，例如 `un-text="[#f08b6a]"`、`un-w="5"`、`un-h="5"`
- 仅当资源本身需要保留原始多色效果、渐变、位图展示时，才继续使用 `image` 标签
- 可参考 `src/pages/product/Detail.vue` 的收藏按钮写法

```vue
<view
  un-i="iconfont-favorite_service"
  un-w="5"
  un-h="5"
  un-text="[#f08b6a]"
></view>
```

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
