---
name: tm-ui-components
description: tm-ui 组件 API 与源码定位。仅在需要核对某个 tm 组件的 props、events、slots、ref 方法或源码路径时使用；不要用于通用页面开发、样式规范或业务逻辑问题
compatibility: Uni-app + tm-ui
metadata:
  version: "1.0"
---

# tm-ui 组件 API 检索

仅在 tm-ui 组件 API 核对类问题中使用本 skill：

1. 适用：查询某个 tm 组件的 props / events / slots / ref 方法、仓库源码路径，或核对组件文档与当前仓库实现是否一致。
2. 不适用：通用页面开发与样式规范问题（如布局、字体、颜色、UnoCSS、表单约定），以及与 tm-ui 组件 API 无关的业务逻辑、交互设计、数据流或页面初始化问题。

## 检索入口

- 组件文档目录：`.agents/skills/tm-ui-components/references/components/`
- 组件总索引：`.agents/skills/tm-ui-components/references/components-index.md`
- 组件源码目录：`src/uni_modules/tm-ui/components/`

## 命名映射规则

1. 文档文件名使用短名，例如 `button.md`
2. 对应源码组件目录通常是 `tm-{short-name}`，例如：
   - `button.md` -> `src/uni_modules/tm-ui/components/tm-button/tm-button.vue`
   - `form.md` -> `src/uni_modules/tm-ui/components/tm-form/tm-form.vue`
   - `input.md` -> `src/uni_modules/tm-ui/components/tm-input/tm-input.vue`
3. 特殊场景可在源码目录里再检索确认，例如 `tm-picker-time`、`tm-steps-item` 等复合命名

## 使用顺序

1. 先查组件总索引 `components-index.md`，快速从文档名定位组件名与源码路径
2. 再打开对应 `*.md` 文档，确认 props / events / slots / ref 信息
3. 涉及默认值、行为差异或边界条件时，直接到源码目录打开 `tm-xxx.vue` 核对实现

## 判定规则

- 文档用于快速定位和初步确认；只要文档描述与当前仓库实现有差异，就以源码实现为准
- 涉及行为差异时，以 `src/uni_modules/tm-ui/components/` 下实现为准
- 页面开发规范（字体基线、UnoCSS 约定、表单约定）仍由 `uni-spec` skill 负责
