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
- 空白行代码缩进要保持和上一行一致, 方便后续添加代码
- 大块标签之间要留空行
- 结构标签上面写上注释
- 代码检查应该用 `pnpm typecheck`, `tsconfig_tc.json` 才是正确的类型检查配置，`tsconfig.json` 只是为了编辑器提示

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
    v-model="usr_input.code"
    placeholder="请输入 编码"
  ></CustomInput>
</tm-form-item>
```

# 常用类库
- `dayjs` - 处理日期时间, 可直接使用, 无需引入
- `decimal.js` - 处理精确小数计算, 金额计算, 可直接使用, 无需引入
- `numeral` - 数字格式化, 可直接使用, 无需引入

# 常用开发技巧

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

## 富文本展示
- 像 `detail` 这类富文本字段, 在当前仓库里通常保存的是 oss/tmpfile 附件 id, 不是 html 正文
- 移动端展示时不要直接把字段值传给组件, 应先通过 `getDownloadUrl({ id, inline: "1" })` 拿到下载地址, 再用 `uni.request` 拉取 html 字符串
- 模板中使用 `tm-html` 渲染拉取回来的 html 内容, 可参考 `src/pages/product/Detail.vue`

```vue
<view
  v-if="detail_html"
>
  <tm-html
    :value="detail_html"
  ></tm-html>
</view>
```

```ts
async function loadDetailHtml(
  detail?: string,
) {
  detail_html = "";
  if (!detail) {
    return;
  }
  const url = getDownloadUrl({
    id: detail,
    inline: "1",
  });
  const res = await uni.request({
    url,
    method: "GET",
  });
  detail_html = typeof res.data === "string"
    ? res.data
    : String(res.data || "");
}
```

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
- `is_form_hydrating` 则表示表单是否正在数据回填
- 如果表单存在由其他字段派生但最终仍会持久化的字段, `watch` 中必须区分初始化回填和用户编辑; 初始化阶段不要自动回写派生字段, 避免首屏展示值与数据库值不一致, 或用户未编辑就隐式改库

```vue
watch(
  () => dyn_page_field_input,
  () => {
    
    if (!inited || is_form_hydrating) {
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

## 字体与颜色约定

- 当前 uni 仓库默认字号基线来自 `src/assets/style/common.scss`:
  - `--font-size: 32rpx`，约等于 `16px`
  - `--font-size-sm: 28rpx`，约等于 `14px`
- 使用 `un-text="数字"` 时，不要把数字直接当成移动端常规字号；在当前 UnoCSS 配置下可近似理解为 `数字 * 4 = px`，例如 `un-text="6"` 约等于 `24px`，对普通列表正文通常明显偏大
- 移动端页面正文、列表项、说明文案优先贴近默认基线：
  - 常规正文优先使用继承默认字号，或 `un-text="4"` 左右
  - 次级说明文案优先使用 `un-text="3.5"` 或接近 `14px` 的大小
  - 分组标题、卡片标题通常控制在 `un-text="4.5"` 到 `un-text="5"`，除非是页面主标题，不要轻易使用 `un-text="6"` 及以上
- 先根据信息层级控制字号，再决定字重；不要靠过大的字号去撑出“重点感”
- 颜色优先使用 UnoCSS 标准色阶，例如 `gray-200`、`gray-400`、`gray-700`、`red-500`，尽量避免随手写零散十六进制颜色
- 只有在品牌色、业务状态色、设计稿明确指定时，才使用自定义颜色，例如 `un-text="[#24324a]"`
- 灰色文案优先从标准灰阶中选择：
  - 弱提示/分隔信息优先 `gray-400`
  - 常规次级文案优先 `gray-500` 或 `gray-600`
  - 重要正文优先 `gray-700`，不要用过浅灰色影响可读性

```vue
<!-- ❌ 正文过大, 颜色也不够规范 -->
<view
  un-text="6 [#24324a]"
  un-font="700"
>
  今日食堂菜单
</view>

<!-- ✅ 更接近当前 uni 仓库的移动端字号基线 -->
<view
  un-text="5 gray-700"
  un-font="700"
>
  今日食堂菜单
</view>

<view
  un-text="4 gray-700"
>
  午餐 A: 红烧排骨 + 清炒时蔬 + 紫菜蛋花汤
</view>

<view
  un-text="3.5 gray-500"
>
  限时供应, 售完即止
</view>
```

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
4. 单边边框如果同时写 `solid`/颜色, 必须先用 `0` 清零其它边框: `un-border="0 b-1 solid [#f0f2f5]"`, 不要写成 `un-border="b-1 solid [#f0f2f5]"`

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

