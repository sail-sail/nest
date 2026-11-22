---
name: pc-to-uni-migration
description: '将 PC 端相对生成代码的手工业务增强迁移到对应 Uni CRUD 页面，保留权限、动作、筛选、转化和回刷语义'
user-invocable: true
compatibility: Uni-app + codegen CRUD pages
metadata:
  version: "1.1"
---

# PC 到 Uni 业务迁移

## 适用边界

- 仅用于“PC 端在生成代码上增加业务逻辑，再迁移到对应 Uni 页面”的场景。
- 目标页面应已有 `List.vue`、`Detail.vue` 等生成骨架。
- 不用于纯后端接口、纯视觉改版、全新页面或大模块补齐。
- 目标页、下游转化页或外键页签缺失时，先报告依赖并停止扩面，不要凭空补整个模块。

## 目标

迁移业务语义，不逐像素复制桌面端：

- 保留权限、按钮文案、动作名。
- 保留业务筛选、公海状态、转化链和回刷链。
- 将交互放到适合移动端的载体中。
- 不迁移表格列、列配置、导出和复杂表头等纯桌面行为。

## 依赖规范

- UI、事件和类型约定遵守 `uni-spec`。
- 自定义 GraphQL 接口遵守 `uni-graphql-frontend`。
- 与目标模块现有实现冲突时，优先保持模块内一致，并在结果中说明。

## 迁移流程

### 1. 找出 PC 手工差异

优先对比：

- `codegen/__out__/pc/src/views/{mod}/{table}/`
- `pc/src/views/{mod}/{table}/`

同时检查 Uni 当前页面，避免重复实现。重点查看：

- `List.vue`
- `Detail.vue`
- `ForeignTabs.vue`
- `Pool.vue`
- `Api.ts` / `Api2.ts`
- `Model.ts`

先把差异归类：

1. 业务动作
2. 业务筛选
3. 转化链
4. 详情页签与上下文
5. 公海或包装页
6. 纯桌面展示

前 5 类优先迁移；第 6 类只在有明确业务价值时迁移。

### 2. 按依赖顺序实现

1. 自定义 API
2. 下游 `Detail.vue` 的 `ActionType`、入参解析和保存分支
3. 上游详情页的触发动作、权限校验和跳转
4. `List.vue` 的关键筛选与上下文跳转
5. `ForeignTabs.vue`、`Pool.vue`、包装页
6. `pages.json` 路由

不要先改列表样式，否则容易遗漏实际业务链路。

### 3. 验证

在 `uni/` 运行：

```bash
pnpm run typecheck
```

## PC 到 Uni 的职责映射

| PC 载体 | Uni 载体 | 处理原则 |
|---|---|---|
| 列表单条业务动作 | `Detail.vue` 操作区 / 抽屉 | 通常下沉，权限与文案不变 |
| 列表表格 | `List.vue` 卡片列表 | 只保留必要筛选、进入详情和批量动作 |
| `showDialog()` 下游详情 | 下游 `Detail.vue` 页面 | 用 `action` + `input_patch` 传上下文 |
| `ForeignTabs.vue` 弹窗 | `ForeignTabs.vue` 独立页面 | 使用 `tm-slider-menu` |
| 公海或包装页 | 优先复用 `List.vue` | 已有独立实现的模块保持现状，不为迁移强行重构 |
| 自定义 GraphQL | Uni `Api2.ts` | 遵守 `uni-graphql-frontend` |

## 必须遵守的业务规则

### 动作、权限和文案

- 按钮权限、文案、动作名与 PC 保持一致。
- 已有自定义动作名不能改别名；当前转化链包括：
  - `clue_to_business`
  - `business_to_order`
  - `order_to_contract`
- 执行业务动作前保留 PC 的权限、状态和重复转化校验。

### 转化链

先实现下游承接，再接上游按钮：

1. 下游扩展 `ActionType`。
2. 解析 `action` 和 `input_patch`。
3. 在保存分支调用对应自定义 API。
4. 保存成功后回刷当前列表和受影响的上游列表 / 详情。

`input_patch` 只传必要字段：

- 主外键 id / label
- 必要的 owner、source、remark
- 必要的 pool 状态或上游关联 id

不要传仅用于桌面展示的标题或冗余数据。

### 列表

- 保留卡片浏览、批量删除 / 取消和关键筛选。
- 只迁移影响业务范围的条件，例如 `my_scope`、`is_pool`、关键日期和上游外键。
- `my_scope` 的值必须保留 PC 语义，如 `owner` / `collab`。
- 不复制 PC 的全部搜索、列控制、导出和复杂表头。

### `ForeignTabs.vue`

- 左侧使用 `tm-slider-menu`。
- 第一项为“基本信息”。
- 用 `visitedTabIds` 惰性渲染。
- `Detail` 子页使用 `:init="false"`、`:back-after-save="false"`。
- 子列表通过 `builtInSearch` + `addQuery` 接收上下文。

### Workflow 弹窗

- 优先复用模块现有 `CustomDialog`。
- `showDialog()` 返回 `{ type: 'confirm' | 'cancel', ...payload }`。
- 页面侧只在 `confirm` 后进入统一的 `onWorkflowConfirm()`。

## 刷新事件

列表事件：

```text
/pages/{table}/List:refresh
```

详情事件：

```text
/pages/{table}/Detail:refresh
```

转化成功至少回刷：

1. 当前下游列表
2. 受影响的上游列表
3. 上游“是否已转化 / 关联 id / pool 状态”等已变化时，对应的上游详情

## 验收清单

- [ ] PC 手工差异已逐项归类并有迁移结论。
- [ ] 权限、按钮文案和动作名与 PC 一致。
- [ ] 下游详情正确解析自定义 `action`。
- [ ] `input_patch` 只包含必要字段。
- [ ] 转化成功后刷新事件完整。
- [ ] `ForeignTabs.vue` 正确透传上下文。
- [ ] `Pool.vue` / 包装页没有无必要的重复实现。
- [ ] 路由已补齐。
- [ ] `pnpm run typecheck` 通过。

## 交付要求

一次性交付迁移涉及的页面、`Api2.ts`、路由和包装页；缺失页面骨架、未迁桌面专属逻辑及验证结果必须明确列出。
