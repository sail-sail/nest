---
name: uni-spec
description: 移动端页面开发规范。开发 UI 界面时使用
compatibility: Uni-app + UnoCSS
metadata:
  version: "1.0"
---

## 编码规范
- 使用 Vue Macros 的 reactivity transform（`$ref`、`$computed` 等）
- 当 `[ ]` 代表的是值时中间有空格, 例如: `const arr = [ 1, 2, 3 ];`, `const arr = [ ];`, `{ }` 也同理
- 函数定义和调用的时候, 参数都换行, vue 组件属性也换行
- vue 相关的类型都无需导入, 如 `ref`, `computed` 等, 直接使用即可, 因为 `vite.config.mts` 配置了自动导入 `AutoImport`

# form表单

- `tm-form-item` 组件中如果不需要校验必填则必须添加 `:required="false"` 属性, 否则会默认校验必填, 例:

```vue
<!-- 编码 -->
<tm-form-item
  label="编码"
  name="code"
  :required="false"
>
  <CustomInput
    v-model="dyn_page_field_input.code"
    placeholder="请输入 编码"
  ></CustomInput>
</tm-form-item>
```

# 常用类库
- `dayjs` - 处理日期时间, 可直接使用, 无需引入
- `decimal.js` - 处理精确小数计算, 金额计算, 可直接使用, 无需引入
- `numeral` - 数字格式化, 可直接使用, 无需引入

# 常用开发技巧

## 页面参数接收
- 使用 `onLoad` 生命周期钩子接收页面跳转传递的参数，**禁止**使用 `getCurrentPages()` 方式获取参数
- `onLoad` 的回调参数 `query` 包含页面 URL 中的查询参数
- 页面初始化逻辑（如 `initFrame()`）应放在 `onLoad` 内部调用，而非直接在 `setup` 中调用

```typescript
onLoad(async (query?: AnyObject) => {
  const some_param = query?.some_param;
  if (some_param) {
    search.some_field = decodeURIComponent(some_param);
  }
  await initFrame();
});
```

- 表单通常会有 `let inited = $ref(false);` 标记是否初始化完成, 避免在初始化前触发表单变更事件

```vue
watch(
  () => dyn_page_field_input,
  () => {
    
    if (!inited) {
      return;
    }
    
    // 处理表单变更逻辑
  },
  {
    deep: true,
  },
);
```

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

