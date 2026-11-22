---
name: uni-spec
description: Uni 移动端页面、表单、生命周期与样式开发规范
compatibility: Uni-app + UnoCSS
metadata:
  version: "1.1"
---

# 使用边界

- `uni-spec` 负责页面、表单、生命周期、样式与通用约定。
- tm-ui 组件的 props、events、slots、ref 先查 `tm-ui-components`。
- 自定义 GraphQL 接口遵守 `uni-graphql-frontend`，不要在本规范中重复约定。
- 组件文档与源码不一致时，以 `src/uni_modules/tm-ui/components/` 源码为准。

# 核心编码约定

1. 使用 Vue Macros 的 `$ref`、`$computed`；Vue、uni-app API 由 `AutoImport` 提供，无需手动导入。
2. 数组、对象值内留空格：`[ 1, 2 ]`、`{ }`；函数参数与组件属性统一换行，不混排。
3. 模板中大块标签之间留空行；结构标签上写简短注释；空白行缩进与上一行一致。
4. 使用 `pnpm typecheck`。该命令以 `tsconfig_tc.json` 检查并执行 ESLint；`tsconfig.json` 主要服务编辑器提示。

# 表单与初始化

## 必填标记

- `tm-form-item` 的 `required` 默认显示 `*`。
- 非必填字段必须写 `:required="false"`，否则会错误显示必填标记。
- 该属性只控制标记；真正的校验规则由 `tm-form` 的 `rules` 决定。

## 异步初始化

- 用 `inited` 表示初始化完成，用 `is_form_hydrating` 表示数据回填。
- 回填期间和初始化完成前，禁止 `watch` 自动回写持久化字段。
- 输入类组件优先传 `:page-inited="inited"`，避免占位内容提前显示。

```ts
watch(
  () => dyn_page_field_input,
  () => {
    if (!inited || is_form_hydrating) {
      return;
    }

    // 只处理用户编辑后的变更
  },
  {
    deep: true,
  },
);
```

# CustomInput 数值输入

- `type="decimal"` 会将输入值转换为 `Decimal`；`type="number"` / `type="digit"` 会转换为 `number`。
- 不要再把 `type` 只理解为键盘类型，也不要同时额外传 `:is-decimal` / `:is-number`。
- 金额或后续需要调用 `lte`、`gt`、`eq` 的状态使用 `type="decimal"`。
- `isHideZero` 默认开启；需要真实显示 `0` 时传 `:is-hide-zero="false"`。
- 默认保留 `precision=2`；只有业务需要时调整精度。

```vue
<CustomInput
  v-model="recharge_amount"
  type="decimal"
  :is-hide-zero="false"
  placeholder="请输入充值金额"
></CustomInput>
```

# 页面生命周期与刷新

- 页面参数从 `onLoad(query)` 接收，禁止使用 `getCurrentPages()`。
- 先解析参数，再执行 `initFrame()`。
- 路由页面的初始化、事件绑定使用 `onLoad`；解绑使用 `onUnload`。
- 页面也被父组件复用时，向外暴露 `refresh()`，父组件复用该入口，不重复初始化。
- 跨页面刷新统一使用 `uni.$emit` / `uni.$on`。
- 事件名使用目标页面路径，例如：
  - `/pages/order/List:refresh`
  - `/pages/order/Detail:refresh`
- 绑定前先 `uni.$off` 同名监听，销毁时再次解绑。

```ts
const refresh_event_name = "/pages/order/List:refresh";

onLoad(async () => {
  uni.$off(refresh_event_name, onPageRefresh);
  uni.$on(refresh_event_name, onPageRefresh);
  await initFrame();
});

onUnload(() => {
  uni.$off(refresh_event_name, onPageRefresh);
});

defineExpose({
  refresh: initOrRefresh,
});
```

# 静态图标与富文本

## 本地图标

- `uno_uni.config.ts` 已注册 `iconfont` collection，读取 `src/assets/iconfont/*.svg`。
- 单色图标优先用 `un-i="iconfont-名称"`，不要使用 `image + src` 或 `new URL()`。
- 尺寸、颜色使用 UnoCSS 属性控制；只有多色、渐变或位图资源才使用 `image`。

```vue
<view
  un-i="iconfont-refresh"
  un-w="4"
  un-h="4"
  un-text="gray-600"
></view>
```

## 富文本

- 先确认字段存储的是 HTML 还是附件 id；不要把任意 `detail` 字段直接传给 `tm-html`。
- 若字段是 OSS/tmpfile 附件 id：先用 `getDownloadUrl({ id, inline: "1" })` 获取地址，再请求正文，最后将 HTML 字符串交给 `tm-html`。
- Uni 迁移此类字段时，以对应 PC 富文本实现为准。

# 样式规范

## 字体

`src/assets/style/common.scss` 的基线为：

- `--font-size: 32rpx`，约 `16px`
- `--font-size-sm: 28rpx`，约 `14px`

字号优先：

- 常规正文：默认字号或 `un-text="4"`
- 次级说明：`un-text="3.5"`
- 卡片 / 分组标题：`un-text="4.5"` 至 `un-text="5"`
- 不要用 `un-text="6"` 以上撑普通正文的视觉重点

## 颜色

- 优先使用 UnoCSS 标准色阶，避免业务页面随意添加十六进制颜色。
- 弱提示：`gray-400`
- 次级文案：`gray-500` / `gray-600`
- 重要正文：`gray-700`
- 暗色模式只补对应的 `dark:` 色阶，不另写平行色值。

## Attributify

- 同前缀合并到一个属性。
- 属性名与值首段相同时使用 `~`。
- 无参数工具类使用无值属性。
- 单边边框同时设置颜色或 `solid` 时，先用 `0` 清空其它边框。

```vue
<view
  un-flex="~ col"
  un-items="center"
  un-border="0 b-1 solid gray-200"
  un-rounded
></view>
```

# 自动导入

- `vite.config.mts` 的 `AutoImport` 已注册 Vue、uni-app、Pinia、`dayjs`、`Decimal`、`numeral` 及仓库公共函数。
- `uni`、生命周期钩子、全局工具函数直接使用；新增全局项时修改配置，不要手改生成的 `src/typings/auto-imports.d.ts`。
- 已声明在 `src/typings/components2.d.ts` 的组件可直接用于模板，不要手工导入或修改该声明文件。
