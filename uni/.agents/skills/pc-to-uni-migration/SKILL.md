---
name: pc-to-uni-migration
description: '将本仓库 pc 端相对生成代码的手工业务逻辑迁移到 uni 端，保持 pc 端和 uni 端业务语义一致'
user-invocable: true
compatibility: Uni-app + codegen CRUD pages
metadata:
  version: "1.0"
---

# PC 到 Uni 业务迁移

## Skill 边界

- 适用于当前仓库这类“先代码生成，再对 pc 端做手工业务增强，再把增强逻辑迁到 uni 端”的页面迁移。
- 适用于 `src/pages/{table}` 这种生成式 CRUD 页面，尤其是 `List.vue`、`Detail.vue`、`ForeignTabs.vue`、`Pool.vue`、`Api.ts` / `Api2.ts` 这一组文件。
- 不适用于纯后端接口开发、纯视觉改版、全新无参考页面、或 uni 端根本没有对应业务页面骨架的场景。
- 如果目标 uni 页面、下游转化页面或外键页签页面不存在，先明确报出缺页依赖，不要在一次迁移里凭空扩大片面。

## 迁移目标

不是把 pc 表格页面逐像素搬到移动端，而是把 pc 的业务语义完整迁到移动端：

- 按钮权限、按钮文案、动作名称保持一致
- 搜索约束、池态约束、转化链路、回刷链路保持一致
- 交互承载位置改成适合移动端的结构

当前仓库里已经验证过的固定动作包括：

- 普通列表 vs 公海列表
- “我的关联”筛选
- `ForeignTabs` 页签详情页
- 审核动作下沉到详情抽屉
- 领取 / 分配 / 退回公海
- 线索转客户 / 线索转商机
- 商机转订单
- 订单转合同
- “我的跟进”这类基于现有列表的包装页

## 依赖的现有规范

迁移时要同时遵守以下已有 skill：

- `uni-spec`: 页面结构、排版、事件、类型检查约定
- `uni-graphql-frontend`: 自定义 GraphQL 接口优先放到 `Api2.ts`

如果这两个 skill 与当前迁移目标冲突，优先保持“当前模块内的一致性”，并在结果里明确说明为何没有完全按默认规范落地。

## 固定迁移原则

1. 先找 pc 差异，再写 uni 代码。
2. 先迁业务动作，再迁展示层细节。
3. 按钮名字和动作标识与 pc 保持一致，不要擅自改成“更移动端”的文案。
4. pc 列表工具栏里的核心业务动作，移动端通常下沉到 `Detail.vue` 里的 `tm-drawer` 操作抽屉。
5. 列表页面保留“卡片浏览 + 批量删除/取消 + 关键筛选”，不复制 pc 的表格列、导出、列配置、复杂表头行为。
6. 自定义转化链统一用“上游页面构造 `input_patch`，下游详情页用自定义 `action` 负责保存”。
7. 每条转化链保存成功后，要同时回刷当前列表，以及被下游结果反向影响到的上游详情/列表。
8. `ForeignTabs.vue` 在 uni 里是一个独立页面，不是 pc 的弹窗；左侧菜单用 `tm-slider-menu`。
9. `Pool.vue` 在 uni 里优先做成薄包装页，复用同模块 `List.vue`，通过 props 固定 `is_pool=1` 等状态。
10. 搜索条件不是 1:1 搬运。只迁“确实影响业务范围”的条件，例如 `my_scope`、`is_pool`、关键日期、上游业务外键。

## 迁移前必须收集的上下文

### 1. 提取 pc 端手工改动

优先对比：

- `codegen/__out__/pc/src/views/{mod}/{table}/`
- `pc/src/views/{mod}/{table}/`

重点看这些文件：

- `List.vue`
- `Detail.vue`
- `ForeignTabs.vue`
- `Api.ts`
- `Api2.ts`
- `Model.ts`

### 3. 先判断差异属于哪一类

把 pc 差异先分成 6 类，再决定要不要迁：

1. 真实业务动作
2. 真实业务筛选
3. 下游转化链路
4. 详情页签上下文
5. 公海 / 包装页
6. 纯桌面展示层差异

第 1 到第 5 类要优先迁；第 6 类只有在移动端仍有真实业务价值时才迁。

## 固定映射关系

### A. PC 文件到 Uni 文件的职责映射

| PC 载体 | Uni 载体 | 说明 |
|---|---|---|
| `List.vue` 工具栏业务按钮 | `Detail.vue` 操作抽屉 | 审核、领取、分配、转化等都优先下沉 |
| `List.vue` 表格 | `List.vue` 卡片列表 | 保留业务筛选、批量删除、进入详情 |
| `ForeignTabs.vue` 弹窗 | `ForeignTabs.vue` 页面 | 使用 `tm-slider-menu` |
| `Pool.vue` 独立复杂页面 | `Pool.vue` 薄包装页 | 优先复用 `List.vue` props |
| `Detail.showDialog({...})` | `navigateTo('/pages/.../Detail?...')` | 用 `action` + `input_patch` 承载上下文 |
| pc 自定义 GraphQL 调用 | uni `Api2.ts` | 默认优先放 `Api2.ts` |

### B. 固定动作名不要改

如果 pc 端已经有自定义动作名，uni 端继续沿用同名：

- `clue_to_business`
- `business_to_order`
- `order_to_contract`

不要改成新的别名

## 标准迁移顺序

永远按下面顺序迁，不要一上来先改列表样式：

1. 自定义 API
2. 下游详情页的自定义 `ActionType` 与保存分支
3. 上游页面的触发按钮与 `navigateTo` / workflow 逻辑
4. 列表页的关键筛选与上下文跳转
5. `ForeignTabs.vue` 的页签计数与上下文透传
6. `Pool.vue` / `MyList.vue` 这类包装页
7. `pages.json` 路由补齐
8. `pnpm run typecheck` 验证

## 详细迁移步骤

### 第一步：提取 pc 差异并归类

至少回答清楚这几个问题：

- pc 多了哪些业务按钮？
- 这些按钮在移动端应放列表，还是放详情抽屉？
- 是否多了 `ForeignTabs.vue` 的业务页签或跟进上下文？
- 是否多了 `my_scope`、`is_pool`、关键日期等业务筛选？
- 是否多了自定义转化 API？
- 是否多了上游 -> 下游 -> 上游回刷链？

### 第二步：优先落下游承接页

如果 pc 存在转化链，例如：

- 线索 -> 商机
- 商机 -> 订单
- 订单 -> 合同

先改下游详情页：

- 扩 `ActionType`
- 新增自定义 create API 调用
- 在保存分支里按 `action` 决定调用哪个接口
- 成功后发当前列表刷新事件
- 成功后回刷上游详情 / 列表

这样上游按钮接入时不会悬空。

### 第三步：再改上游触发页

上游触发页通常是 `Detail.vue` 的抽屉按钮，而不是 uni 的 `List.vue`。

固定做法：

1. 校验权限
2. 校验“是否已经转化过”
3. 组装 `input_patch`
4. `navigateTo` 到下游 `Detail.vue`
5. 通过 query 传 `action` 和 `input_patch`

`input_patch` 只传最小上下文：

- 主外键 id / label
- 需要预填的 owner / source / remark
- 必要的 pool 状态或上游关联 id

标题 `title` 不是必须字段。只在下游页面或页签标题确实要展示时才传。

### 第四步：列表页只迁关键搜索与上下文

移动端列表通常只保留：

- `keyword`
- `my_scope`（如果 pc 有）
- `is_pool`
- 少量日期范围
- 进入 `ForeignTabs` 所需的上下文 id

不要默认把 pc 全部搜索表单、列控制、导出逻辑照搬过去。

#### `my_scope` 的固定做法

- 用 `tm-checkbox` 组合成轻量筛选
- 值保持 `owner` / `collab` 等 pc 端原始语义
- 存到本地缓存时只存真实业务值，不存展示态

### 第五步：`ForeignTabs.vue` 统一页面化

固定结构：

1. 左侧 `tm-slider-menu`
2. 第一项固定 `基本信息`
3. 右侧内容页按 `visitedTabIds` 惰性渲染
4. `Detail` 子页使用 `:init="false"` 和 `:back-after-save="false"`
5. 子列表通过 `builtInSearch` + `addQuery` 收到上下文

## 组件级固定模式

### `List.vue` 固定模式

- 顶部是“操作 + 搜索”
- 主体是卡片列表，不是表格
- 批量态靠 `isEditing` 切换
- 进入详情优先跳 `ForeignTabs.vue`
- 列表缓存 key 通常要把关键业务维度带进去，例如 `is_pool`

### `Detail.vue` 固定模式

- 表单主体继续沿用生成页字段顺序
- 业务动作统一进 `tm-drawer`
- `hasOperationButtons` 控制抽屉入口显隐
- 抽屉里的按钮顺序按业务分组，而不是按技术实现分组

### Workflow 弹窗固定模式

- 用仓库现有 `CustomDialog` promise 形式
- `showDialog()` 返回 `{ type: 'confirm' | 'cancel', ...payload }`
- 页面侧拿结果后统一走一个 `onWorkflowConfirm()`

## 刷新事件固定规则

列表刷新：

- `"/pages/{table}/List:refresh"`

详情回刷：

- `"/pages/{table}/Detail:refresh"`

什么时候需要额外发详情回刷：

- 下游创建成功后会改上游的“是否已转化 / 关联 id / pool 状态”

例如：

- 商机创建成功后回刷线索详情
- 订单创建成功后回刷商机详情
- 合同创建成功后回刷订单详情

## 何时应该停止并报告，而不是继续硬迁

出现以下情况时，要先说明缺口，不要继续凭空扩大量级：

- uni 端没有对应业务页面骨架
- pc 差异依赖了 uni 里不存在的整个子模块
- pc 的差异只有桌面表格列展示，没有可迁移的移动端业务价值

## 验证步骤

每次迁移至少做这些检查：

1. 自定义 `action` 是否在下游 `Detail.vue` 被解析
2. `input_patch` 是否只传必要字段
3. `ForeignTabs.vue` 是否把关键上下文透传给子页
4. `Pool.vue` / 包装页是否只是薄壳，不复制主实现
5. 按钮文案是否与 pc 保持一致
6. 自定义 mutation 成功后是否发了正确刷新事件
7. 运行 `pnpm run typecheck`

## 使用 Skill 后的预期产出

理想结果应该一次性交付下面这些内容，而不是只改一个页面：

- 迁移后的 uni 页面代码
- 必要的 `Api2.ts` 或自定义接口补充
- 必要的 `pages.json` 路由
- 必要的包装页（如 `Pool.vue`、`MyList.vue`）
- 明确列出“因 uni 缺失页面骨架而暂未迁移”的剩余项
