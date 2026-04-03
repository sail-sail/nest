# BPM 工作流引擎 — 产品需求文档 (PRD)

> 分支: `rust4bpm` | 状态: 草稿 | 创建日期: 2026-03-31

---

## 1. 目标与原则

### 1.1 核心目标

在 Nest 全栈架构之上构建一套 **刚好够用、简洁、灵活、易维护** 的流程引擎，覆盖中国企业常见审批场景。

### 1.2 设计原则

| 原则 | 说明 |
|------|------|
| **够用即可** | 不造通用 BPMN 引擎, 只覆盖审批流、会签、条件分支等高频场景 |
| **架构复用** | 充分利用现有 codegen 生成体系、GraphQL API、用户/部门/角色模型 |
| **数据驱动** | 流程定义用 JSON 存储, 节点/连线用表结构承载, 无需依赖外部引擎 |
| **前端体验** | 所见即所得流程图设计器 (PC), 移动端可查看流程图和当前节点状态 |
| **可审计** | 每一步操作留痕, 支持审计追溯 |

---

## 2. 术语定义

| 术语 | 英文 | 说明 |
|------|------|------|
| 流程定义 | Process Definition | 一套流程的模板, 包含节点和连线 |
| 流程版本 | Process Revision | 流程定义的一个发布快照, 发布后不可修改 |
| 流程实例 | Process Instance | 一次具体的审批流转, 由发起人创建 |
| 节点定义 | Node Definition | 流程中的一个步骤(开始/审批/条件/会签/结束等) |
| 节点实例 | Node Instance | 流程实例运行时, 某个节点的执行记录 |
| 任务 | Task | 分配给具体处理人的待办项 |
| 审批动作 | Action | 同意 / 拒绝 / 转交 / 退回 / 加签 / 撤回 |

---

## 3. 功能范围

### 3.1 P0 — 第一期必须实现

#### 3.1.1 流程定义管理

- 创建/编辑/删除流程定义
- 流程定义包含: 名称、编码、关联业务、分类、描述
- **流程图设计器 (PC)**
  - 链式审批流编排: 开始节点 → 审批节点 → 条件分支 → 抄送节点 → 结束节点
  - 点击节点之间的 "+" 按钮插入新节点 (审批人 / 抄送人 / 条件分支)
  - 节点属性配置面板 (处理人规则、超时设置等)
  - 纵向自动布局, 无需手动拖拽排列
  - 保存后生成结构化 JSON (链式树) 存储
- 流程定义支持版本管理: 编辑 → 发布 → 生成不可变版本快照
- 启用/停用流程定义

#### 3.1.2 节点类型

| 节点类型 | 标识 | 说明 |
|----------|------|------|
| 开始节点 | `start` | 每个流程有且仅有一个, 提交即通过 |
| 审批节点 | `approve` | 核心节点, 需要处理人操作 |
| 抄送节点 | `cc` | 通知指定人员, 不阻塞流程 |
| 条件分支组 | `condition_group` | 包含多个带优先级的条件分支; 同优先级多条匹配时并行执行, 全部完成后汇合 |
| 结束节点 | `end` | 流程正常结束 (链式末尾隐式终止) |

#### 3.1.3 处理人规则

审批节点支持以下指派方式:

| 方式 | 说明 |
|------|------|
| 指定用户 | 直接选择一个或多个用户 |
| 指定角色 | 拥有该角色的所有用户 |
| 部门负责人 | 发起人所在部门的负责人 (通过 `base_dept_usr`) |
| 上级部门负责人 | 发起人部门的父部门负责人 |
| 发起人自选 | 在发起时由发起人指定处理人 |
| 表单字段 | 取表单中某个用户字段的值 |

#### 3.1.4 审批方式

| 方式 | 标识 | 说明 |
|------|------|------|
| 或签 | `or_sign` | 任何一个处理人操作即可通过 (默认) |
| 会签 | `counter_sign` | 所有处理人都必须操作, 按比例或全部同意 |
| 依次审批 | `sequential` | 按顺序逐个审批 |

#### 3.1.5 审批动作

| 动作 | 标识 | 说明 |
|------|------|------|
| 同意 | `approve` | 通过当前节点 |
| 拒绝 | `reject` | 驳回, 流程终止或退回指定节点 |
| 转交 | `transfer` | 将任务转给其他人处理 |
| 退回 | `return` | 退回到前面的某个节点 |
| 加签 | `add_sign` | 临时增加审批人 (前加签/后加签) |
| 撤回 | `revoke` | 发起人在第一个节点未处理前可撤回 |

#### 3.1.6 流程实例

- 发起流程: 关联一条业务数据, 创建流程实例
- 流程状态: 进行中 / 已通过 / 已拒绝 / 已撤回
- 查看流程图: 显示当前到了什么节点, 已完成/进行中/未到达三种状态
- 审批记录: 时间线形式显示每一步的操作人、操作、意见、耗时
- 催办: 对逾期未处理的任务发送提醒

#### 3.1.7 我的待办 / 已办

| 列表 | 说明 |
|------|------|
| 我的待办 | 分配给我、尚未处理的任务 |
| 我的已办 | 我已处理过的任务 |
| 我发起的 | 我创建的流程实例 |
| 抄送我的 | 我被通知的流程 (仅查看) |

---

### 3.2 P1 — 第二期增强

| 功能 | 说明 |
|------|------|
| 条件分支表达式引擎 | 支持 `field > 1000 && field2 == "A"` 等简单表达式 |
| 超时自动处理 | 超过 N 小时/天未处理, 自动同意/自动转交/自动提醒 |
| 流程委托 | A 委托 B 代审批 (休假场景) |
| 流程数据统计 | 平均耗时、超时率、各节点瓶颈分析 |
| 移动端流程图查看 | UniApp 端查看流程图 + 当前节点 |
| 子流程 | 一个节点触发另一个流程 |
| 表单联动 | 审批同意后自动修改业务表单字段(如状态) |

### 3.3 不做 (Out of Scope)

- 完整 BPMN 2.0 规范 (太重, 不实用)
- 独立的表单设计器 (已有 codegen 生成体系)
- 复杂脚本引擎 (Groovy / JS 表达式)
- 跨租户流程

---

## 4. 数据模型设计

### 4.1 模块: `bpm`

新建独立模块 `bpm`, 表前缀 `bpm_`。

### 4.2 ER 关系概览

```
bpm_process_def  ─1:N─  bpm_process_revision
                              │
                             1:N
                              │
bpm_process_inst ─────── (关联 revision)
      │
     1:N
      │
bpm_node_inst
      │
     1:N
      │
bpm_task ──────── bpm_task_transfer (转交记录)
      │
bpm_process_inst_log (审批日志)
```

### 4.3 表清单

#### 4.3.1 `bpm_process_def` — 流程定义

> 流程的模板, 可被编辑, 发布后生成不可变版本。

| 字段 | 类型 | 说明 |
|------|------|------|
| `id` | varchar(22) | 主键 |
| `img` | varchar(22) | 图片 |
| `code_seq` | int unsigned | 编码序列号 |
| `code` | varchar(45) | 流程编码 (唯一) |
| `lbl` | varchar(100) | 流程名称 |
| `biz_code` | varchar(50) | 关联业务编码 (系统字典 `bpm_biz_code`, 如 `oa_leave` / `oa_expense`) |
| `category` | varchar(45) | 流程分类 (dict) |
| `current_revision_id` | varchar(22) | 当前生效版本 |
| `is_enabled` | tinyint | 启用状态 |
| `order_by` | int unsigned | 排序 |
| `description` | varchar(500) | 流程描述 |
| `rem` | varchar(100) | 备注 |
| `graph_json` | json | 流程图(JSON草稿) |
| `tenant_id` | varchar(22) | 租户 |
| + 审计字段 | | create/update/delete |

#### 4.3.2 `bpm_process_revision` — 流程版本 (快照)

> 流程定义发布时生成的不可变快照, 流程实例始终关联到具体版本。

| 字段 | 类型 | 说明 |
|------|------|------|
| `id` | varchar(22) | 主键 |
| `process_def_id` | varchar(22) | 所属流程定义 |
| `lbl` | varchar(200) | 名称 (流程名称跟版本号的组合, 如 "请假流程 v1", "请假流程 v2") |
| `process_version` | int unsigned | 版本号 (递增) |
| `graph_json` | json | 完整流程图 JSON (链式树结构) |
| `status` | varchar(20) | 版本状态: published / archived |
| `publish_time` | datetime | 发布时间 |
| `publish_usr_id` | varchar(22) | 发布人 |
| `publish_usr_id_lbl` | varchar(45) | 发布人 |
| `tenant_id` | varchar(22) | 租户 |
| + 审计字段 | | create/update/delete |

#### 4.3.3 `bpm_node_def` — 节点定义 (存储在 graph_json 内, 不单独建表)

> 节点定义嵌入 `bpm_process_revision.graph_json` JSON 中, 不单独建表。
> 采用**链式树结构**: 每个节点通过 `child` 指向下一个节点, 条件分支组内含多个带优先级的子链。
> 布局由前端自动计算 (纵向排列), 不存储坐标。
>
> **条件分支优先级规则:**
> - 按优先级数值从小到大**分层评估**
> - 先评估所有优先级=1 的条件, 如果有匹配则不再评估优先级=2, 3...
> - **同优先级多条同时匹配 → 并行执行**: 匹配的分支子链同时推进, 全部完成后汇合到 `condition_group.child`
> - 同优先级仅一条匹配 → 等价于普通条件分支 (XOR)
> - `expression` 为空字符串的分支视为兆底分支, 仅在同优先级无其他匹配时生效

```jsonc
{
  // 根节点: 开始节点 (有且仅有一个)
  "id": "node_001",
  "type": "start",
  "label": "发起人",
  "config": {},
  "child": {
    // 审批节点
    "id": "node_002",
    "type": "approve",
    "label": "审核人",
    "config": {
      "assignee_type": "dept_head", // 处理人规则
      "assignee_users": [],         // 指定用户 ID 列表
      "assignee_roles": [],         // 指定角色 ID 列表
      "approve_method": "or_sign",  // 审批方式: or_sign / counter_sign / sequential
      "counter_sign_ratio": 100,    // 会签通过比例 (%)
      "can_return": true,           // 是否允许退回
      "can_transfer": true,         // 是否允许转交
      "can_add_sign": true,         // 是否允许加签
      "timeout_hours": 0,           // 超时时间 (0=不超时)
      "timeout_action": "none"      // 超时动作: none / auto_approve / notify
    },
    "child": {
      // 条件分支组: 包含多个按优先级排列的分支
      "id": "node_003",
      "type": "condition_group",
      "label": "",
      "conditions": [
        {
          "id": "cond_1",
          "label": "条件1",
          "priority": 1,             // 优先级 (按顺序评估, 优先级小的先匹配)
          "expression": "dept in ['天旭']",
          "child": {
            // 该分支内的子链
            "id": "node_004",
            "type": "approve",
            "label": "审核人",
            "config": {
              "assignee_type": "user",
              "assignee_users": ["usr_xxx"],
              "assignee_roles": [],
              "approve_method": "or_sign",
              "counter_sign_ratio": 100,
              "can_return": true,
              "can_transfer": true,
              "can_add_sign": true,
              "timeout_hours": 0,
              "timeout_action": "none"
            },
            "child": null
          }
        },
        {
          "id": "cond_2",
          "label": "条件2",
          "priority": 2,
          "expression": "",           // 空表达式 = 兜底/默认分支
          "child": null               // 该分支无额外节点, 直接走主链
        }
      ],
      // 所有分支汇合后继续主链
      "child": {
        // 抄送节点: 通知指定人, 不阻塞流程
        "id": "node_005",
        "type": "cc",
        "label": "抄送人",
        "config": {
          "cc_type": "starter_select", // 抄送人规则: user / role / starter_select
          "cc_users": [],              // 指定用户 ID 列表
          "cc_roles": []               // 指定角色 ID 列表
        },
        "child": null                  // child 为 null 表示流程结束
      }
    }
  }
}
```

**节点通用字段说明:**

| 字段 | 类型 | 说明 |
|------|------|------|
| `id` | string | 节点唯一标识 (如 `node_001`) |
| `type` | string | 节点类型: `start` / `approve` / `condition_group` / `cc` / `end` |
| `label` | string | 节点显示名称 |
| `config` | object | 类型特定配置 (各类型不同) |
| `child` | object \| null | 下一个节点, `null` 表示流程结束 |

**condition_group 特有字段:**

| 字段 | 类型 | 说明 |
|------|------|------|
| `conditions` | array | 条件分支列表, 按 `priority` 排序 |
| `conditions[].id` | string | 分支标识 |
| `conditions[].label` | string | 分支名称 (如 "条件1") |
| `conditions[].priority` | number | 优先级 (越小越先评估; 同优先级多条匹配时并行执行) |
| `conditions[].expression` | string | 条件表达式, 空字符串为兜底分支 |
| `conditions[].child` | object \| null | 该分支的子节点链 |

#### 4.3.4 `bpm_process_inst` — 流程实例

> 一次具体的审批流转。

| 字段 | 类型 | 说明 |
|------|------|------|
| `id` | varchar(22) | 主键 |
| `lbl` | varchar(200) | 实例标题 (如 "张三的请假申请") |
| `process_def_id` | varchar(22) | 流程定义 |
| `process_revision_id` | varchar(22) | 关联的流程版本 |
| `status` | varchar(20) | 状态: running / approved / rejected / revoked |
| `biz_code` | varchar(50) | 关联业务编码快照, 用于回调分发 |
| `biz_id` | varchar(22) | 业务数据 ID |
| `start_usr_id` | varchar(22) | 发起人 |
| `start_usr_id_lbl` | varchar(45) | 发起人标签 |
| `start_dept_id` | varchar(22) | 发起人部门 (发起时快照) |
| `start_dept_id_lbl` | varchar(45) | 发起人部门标签 |
| `start_time` | datetime | 发起时间 |
| `end_time` | datetime | 结束时间 |
| `current_node_ids` | json | 当前活跃节点 ID 列表 (并行时可能多个) |
| `current_node_lbls` | varchar(500) | 当前节点名称 (便于列表展示) |
| `variables` | json | 流程变量 (如表单字段值, 用于条件判断) |
| `tenant_id` | varchar(22) | 租户 |
| + 审计字段 | | create/update/delete |

#### 4.3.5 `bpm_node_inst` — 节点实例

> 流程运行时, 每经过一个节点就生成一条节点实例记录。

| 字段 | 类型 | 说明 |
|------|------|------|
| `id` | varchar(22) | 主键 |
| `process_inst_id` | varchar(22) | 所属流程实例 |
| `node_id` | varchar(45) | 对应 graph_json 中的 node.id |
| `node_type` | varchar(20) | 节点类型 |
| `node_label` | varchar(100) | 节点名称 (快照) |
| `status` | varchar(20) | pending / running / completed / skipped / rejected |
| `start_time` | datetime | 开始时间 |
| `end_time` | datetime | 结束时间 |
| `tenant_id` | varchar(22) | 租户 |
| + 审计字段 | | create/update/delete |

#### 4.3.6 `bpm_task` — 待办任务

> 分配给具体处理人的一条待办。一个审批节点在会签时会生成多条 task。

| 字段 | 类型 | 说明 |
|------|------|------|
| `id` | varchar(22) | 主键 |
| `process_inst_id` | varchar(22) | 所属流程实例 |
| `node_inst_id` | varchar(22) | 所属节点实例 |
| `assignee_usr_id` | varchar(22) | 处理人 |
| `assignee_usr_id_lbl` | varchar(45) | 处理人标签 |
| `status` | varchar(20) | pending / approved / rejected / transferred / revoked |
| `action` | varchar(20) | 执行的动作: pending / approve / reject / transfer / return / add_sign |
| `opinion` | varchar(1000) | 审批意见 |
| `start_time` | datetime | 任务生成时间 |
| `end_time` | datetime | 处理时间 |
| `is_read` | tinyint unsigned | 是否已读 |
| `tenant_id` | varchar(22) | 租户 |
| + 审计字段 | | create/update/delete |

#### 4.3.7 `bpm_transfer` — 转交记录

| 字段 | 类型 | 说明 |
|------|------|------|
| `id` | varchar(22) | 主键 |
| `task_id` | varchar(22) | 原任务 |
| `from_usr_id` | varchar(22) | 转出人 |
| `from_usr_id_lbl` | varchar(45) | 转出人 |
| `to_usr_id` | varchar(22) | 接收人 |
| `to_usr_id_lbl` | varchar(45) | 接收人 |
| `reason` | varchar(200) | 转交原因 |
| `tenant_id` | varchar(22) | 租户 |
| + 审计字段 | | create/update/delete |

#### 4.3.8 `bpm_log` — 流程操作日志

> 审批记录时间线的数据来源。

| 字段 | 类型 | 说明 |
|------|------|------|
| `id` | varchar(22) | 主键 |
| `process_inst_id` | varchar(22) | 所属流程实例 |
| `node_inst_id` | varchar(22) | 所属节点实例 |
| `task_id` | varchar(22) | 关联任务 (可为空, 如系统自动操作) |
| `action` | varchar(20) | 动作: start / approve / reject / transfer / return / add_sign / revoke / auto_approve / cc |
| `usr_id` | varchar(22) | 操作人 |
| `usr_id_lbl` | varchar(45) | 操作人标签 |
| `opinion` | varchar(1000) | 意见 |
| `node_label` | varchar(100) | 节点名称 |
| `log_time` | datetime | 操作时间 |
| `tenant_id` | varchar(22) | 租户 |
| + 审计字段 | | create/update/delete |

---

## 5. 后端 API 设计

### 5.1 生成层 (codegen 生成)

以下表走标准 codegen 生成 CRUD:

- `bpm_process_def` — 流程定义增删改查
- `bpm_process_revision` — 版本列表/查看
- `bpm_process_inst` — 实例列表/查看
- `bpm_node_inst` — 节点实例 (主要查看)
- `bpm_task` — 任务列表
- `bpm_transfer` — 转交记录 (主要查看)
- `bpm_log` — 日志 (主要查看)

### 5.2 自定义 API (手写在 `app/bpm/`)

#### 流程设计 API

```graphql
# 保存并发布流程 → 从当前 graph_json 快照生成 process_revision
# 底层调用 creates_process_def 保存草稿, creates_process_revision 生成版本, updates_process_def 更新 current_revision_id
mutation saveAndPublishsProcessDef(
  inputs: [ProcessDefInput!]!
): [ProcessDefId!]!
```

- 编辑流程定义时, 如果点击的是 "编辑 {{ dialogModel.current_revision_id_lbl }}" 按钮, 则修改当前版本的 graph_json 草稿, 同时修改 版本表的 graph_json, 在这之前校验这个流程版本是否有正在运行的实例, 如果有则不允许修改, 删除流程定义时遍历版本表, 如果有版本被实例关联则不允许删除

#### 流程运行 API

```graphql
# 发起流程
mutation startProcess(
  process_def_id: ProcessDefId!
  biz_id: SmolStr!
  lbl: SmolStr!
): BpmProcessInstId!

# 审批操作
mutation completeTask(
  task_id: SmolStr!
  action: String!        # approve / reject / return / add_sign
  opinion: String
  return_node_id: SmolStr # 退回时指定节点
  add_sign_usr_ids: [SmolStr!] # 加签时指定用户
): Boolean!

# 转交
mutation transferTask(
  task_id: SmolStr!
  to_usr_id: SmolStr!
  reason: SmolStr
): Boolean!

# 撤回 (发起人)
mutation revokeProcess(
  process_inst_id: SmolStr!
): Boolean!

# 催办
mutation urgeTask(
  task_id: SmolStr!
): Boolean!
```

#### 查询 API

```graphql
# 我的待办
query findMyTodoTasks(
  search: BpmTaskSearch
  page: PageInput
  sort: [SortInput!]
): BpmTaskPage!

# 我的已办
query findMyDoneTasks(
  search: BpmTaskSearch
  page: PageInput
  sort: [SortInput!]
): BpmTaskPage!

# 我发起的
query findMyStartedProcess(
  search: BpmProcessInstSearch
  page: PageInput
  sort: [SortInput!]
): BpmProcessInstPage!

# 抄送我的
query findMyCcProcess(
  search: BpmProcessInstSearch
  page: PageInput
  sort: [SortInput!]
): BpmProcessInstPage!

# 审批记录时间线
query findProcessLogs(
  process_inst_id: String!
): [BpmLog!]!

# 流程图 + 当前状态 (前端渲染用)
query getProcessGraph(
  process_inst_id: String!
): ProcessGraphVO!
```

`ProcessGraphVO` 返回结构:

```jsonc
{
  "graph_json": "{ /* 完整流程图 */ }",
  "node_statuses": {
    "node_001": "completed",
    "node_002": "running",
    "node_003": "pending"
  },
  "logs": [ /* 时间线 */ ]
}
```

---

## 6. 流程引擎核心逻辑 (后端)

### 6.1 发起流程

```
1. 校验: process_def 是否启用, 是否有发布版本
2. 创建 bpm_process_inst (status=running, 写入 biz_code 快照)
3. 创建 bpm_node_inst (开始节点, status=completed)
4. 写入 bpm_log (action=start)
5. 推进到下一个节点 → 调用 advanceProcess()
```

### 6.2 推进流程 `advanceProcess()`

```
输入: 当前节点 (node)

1. 读取当前节点的 child
2. 如果 child 为 null:
   - 检查当前节点是否属于 condition_group 的分支子链:
     a. 如果是分支子链末尾 → 标记该分支已完成
        - 检查同优先级的其他并行分支是否全部完成
        - 全部完成 → 继续走 condition_group.child (主链汇合)
        - 未全部完成 → 等待其他分支
     b. 如果不是分支子链 → 流程结束
        - 更新 process_inst.status=approved, end_time
        - 写入 bpm_log (action=end)
3. 如果 child.type == "condition_group":
   - 创建 bpm_node_inst (condition_group, status=completed)
   - 按 priority 分层评估 conditions:
     a. 收集所有优先级=1 的条件, 评估 expression
     b. 如果有匹配:
        - 仅 1 条匹配 → 单分支执行 (XOR)
        - 多条匹配 → 所有匹配分支并行执行, 全部完成后汇合
        - 对每个匹配分支, 若其 child 不为 null 则递归 advanceProcess(分支.child)
     c. 如果无匹配 → 继续评估优先级=2, 以此类推
     d. 所有优先级都无匹配 → 直接走 condition_group.child (兆底)
4. 如果 child.type == "approve":
   - 创建 bpm_node_inst (status=running)
   - 根据处理人规则, 解析出具体用户列表 (resolveAssignees)
   - 为每个用户创建 bpm_task (status=pending)
   - 更新 process_inst.current_node_ids
5. 如果 child.type == "cc":
   - 创建 bpm_node_inst (status=completed)
   - 根据 cc_type 解析抄送人列表
   - 写入 bpm_log (action=cc)
   - 发送通知 (不阻塞流程)
   - 立即递归 advanceProcess(cc_node.child) 继续推进
```

> **并行分支中的 reject 处理**: 任一并行分支中的任务被拒绝, 整个流程终止 (process_inst.status=rejected), 其他并行分支的未处理任务标记为 skipped。

### 6.3 完成任务 `completeTask()`

```
1. 校验: task 是否 pending, 操作人是否是 assignee
2. 更新 bpm_task (status, action, opinion, end_time)
3. 写入 bpm_log
4. 判断节点是否完成:
   - or_sign: 任何一个 task 完成 → 节点完成, 其余 task 标记 skipped
   - counter_sign: 检查已完成比例是否达标
   - sequential: 检查是否是最后一个
5. 如果节点完成 → advanceProcess() 推进到下一节点
6. 如果是 reject:
   - 整个流程终止 (process_inst.status=rejected)
   - 或退回指定节点 (重置该节点及后续节点, 重新生成 task)
```

### 6.4 处理人解析 `resolveAssignees()`

```
输入: node.config.assignee_type + 流程上下文
输出: Vec<UsrId>

match assignee_type:
  "user"       → config.assignee_users
  "role"       → 查询 base_usr_role 获取角色下所有用户
  "dept_head"  → 查 start_dept_id → base_dept_usr 获取负责人
  "parent_dept_head" → 查 dept.parent_id → base_dept_usr
  "starter_select"   → 发起时传入的 assignee 列表
  "form_field"       → 从业务表单数据中取指定字段值
```

---

## 7. 前端页面 (PC)

### 7.1 管理端页面

| 页面 | 路由 | 说明 |
|------|------|------|
| 流程定义列表 | `/bpm/process_def` | 搜索/新增/编辑/启用停用/发布 |
| 流程设计器 | `/bpm/process_def/design/:id` | 链式审批流编辑器 |
| 流程版本列表 | `/bpm/process_revision` | 查看历史版本 |

### 7.2 用户端页面

| 页面 | 路由 | 说明 |
|------|------|------|
| 发起流程 | `/bpm/start` | 选择流程 → 填写表单 → 提交 |
| 我的待办 | `/bpm/todo` | 待办任务列表 |
| 我的已办 | `/bpm/done` | 已办任务列表 |
| 我发起的 | `/bpm/started` | 我创建的流程列表 |
| 流程详情 | `/bpm/process_inst/:id` | 流程图 + 表单数据 + 审批时间线 |
| 审批操作 | (弹窗) | 同意/拒绝/转交/退回/加签 |

### 7.3 流程设计器技术方案

- 链式审批流风格 (类似钉钉/飞书审批流设计器)
- 纵向自动布局, 无需手动拖拽排列
- 点击节点之间的 "+" 按钮插入新节点 (弹出选择: 审批人 / 抄送人 / 条件分支)
- 自定义节点渲染 (审批节点=橙色, 抄送节点=蓝色, 条件分支=绿色)
- 点击节点卡片右侧 ">" 打开属性配置面板
- 条件分支支持 "添加条件" 按钮动态增加分支
- 导出链式树 JSON (无坐标, 无 edges)

### 7.4 流程图查看 (只读)

- 复用设计器组件, 设为只读模式
- 节点颜色标记: 绿色=已完成, 蓝色=进行中, 灰色=未到达, 红色=已拒绝
- 点击节点可查看审批详情

---

## 8. 移动端 (UniApp)

### 8.1 页面

| 页面 | 说明 |
|------|------|
| 发起流程 | 选择流程类型 → 填表单 → 提交 |
| 我的待办 | 列表 + 搜索 |
| 我的已办 | 列表 |
| 我发起的 | 列表 |
| 流程详情 | 表单 + 审批时间线 + 简化流程图 |
| 审批操作 | 同意/拒绝 + 意见输入 + 手写签名 |

### 8.2 移动端流程图

简化展示方案 (非拖拽):
- **竖向步骤条** (Steps) 展示审批进度
- 每个步骤显示: 节点名称、处理人、状态、时间
- 条件分支/并行展示为缩进子步骤
- 点击步骤展开审批意见

---

## 9. 业务接入机制

其他业务模块接入审批流的标准方式:

每个接入 BPM 的业务模块需要先注册唯一 `biz_code`。`biz_code` 是稳定的业务标识, 用于流程定义归属、流程实例快照和后端回调分发, 不直接依赖具体菜单 ID 或页面路由。建议通过系统字典 `bpm_biz_code` 维护, 例如 `oa_leave`、`oa_expense`。

### 9.1 业务表改造

```sql
-- 在业务表上增加流程状态字段
ALTER TABLE oa_leave ADD COLUMN bpm_status ENUM('running', 'approved', 'rejected', 'revoked') NOT NULL DEFAULT 'running' COMMENT '审批状态,dict:bpm_inst_status';
```

### 9.2 发起流程

```typescript
// 前端: 提交业务表单后, 调用 startProcess
const instId = await startProcess({
  process_def_id: "请假流程ID",
  biz_id: leaveId,
  title: `${userName}的请假申请`,
});
```

### 9.3 流程回调

后端按 `process_inst.biz_code` 分发业务回调, 在流程结束时自动更新业务表状态:

```rust
// app/bpm/callbacks.rs
// 流程通过 → UPDATE oa_leave SET bpm_status='approved' WHERE id=biz_id
// 流程拒绝 → UPDATE oa_leave SET bpm_status='rejected' WHERE id=biz_id
```

`bpm_process_def.biz_code` 用于定义流程归属的业务, `bpm_process_inst.biz_code` 用于运行时快照和回调路由。

---

## 10. 开发计划

### 第一阶段: 后端核心 (当前阶段)

```
1. 建表: bpm 模块 SQL + 配置 → codegen 生成基础 CRUD
2. 流程引擎: app/bpm/ 手写核心逻辑
   - advanceProcess / completeTask / resolveAssignees
3. 自定义 API: startProcess / completeTask / transferTask 等
4. 单元测试: 覆盖核心流转逻辑
```

### 第二阶段: PC 前端

```
1. 流程设计器 (Vue Flow)
2. 管理页面 (流程定义/版本)
3. 用户页面 (待办/已办/发起/详情)
4. 流程图查看组件
```

### 第三阶段: 移动端

```
1. 审批操作页面
2. 待办/已办列表
3. 流程进度展示
4. 手写签名组件
```

### 第四阶段: 增强 (P1)

```
1. 条件表达式引擎
2. 超时自动处理
3. 流程委托
4. 数据统计
```

---

## 11. 字典清单

### 系统字典 (复用已有)

- `is_enabled` — 启用/停用
- `is_deleted` — 删除标记

### 系统字典 (dict 新建)

| 编码 | 说明 | 值 |
|------|------|------|
| `bpm_node_type` | 节点类型 | start / approve / condition_group / cc / end |
| `bpm_approve_method` | 审批方式 | or_sign / counter_sign / sequential |
| `bpm_assignee_type` | 处理人规则 | user / role / dept_head / parent_dept_head / starter_select / form_field |
| `bpm_biz_code` | 关联业务编码 | oa_leave / oa_expense / crm_contract / ... |
| `bpm_inst_status` | 流程实例状态 | running / approved / rejected / revoked |
| `bpm_node_inst_status` | 节点实例状态 | pending / running / completed / skipped / rejected |
| `bpm_task_status` | 任务状态 | pending / approved / rejected / transferred / revoked |
| `bpm_task_action` | 审批动作 | pending / approve / reject / transfer / return / add_sign |
| `bpm_log_action` | 日志动作 | start / approve / reject / transfer / return / add_sign / revoke / auto_approve / cc / end |
| `bpm_revision_status` | 版本状态 | published / archived |
| `bpm_process_def_category` | 流程分类 | 人事 / 财务 / 行政 / 采购 / 其他 (允许用户扩展) |

`bpm_biz_code` 的值应由各业务模块以系统记录方式维护, 且必须保持稳定, 作为后端回调分发的关键标识。

---

## 12. 安全与权限

| 维度 | 策略 |
|------|------|
| 数据隔离 | `tenant_id` 租户隔离 (所有表) |
| 操作权限 | 流程定义管理 → 需要菜单权限; 审批操作 → 只有 assignee 可操作 |
| 数据权限 | 我的待办/已办只能看到自己的; 管理员可看全部 |
| 防重复提交 | completeTask 检查 task.status 必须为 pending |
| 审批签名 | 可选手写签名, 存储为图片 URL |
