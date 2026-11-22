---
name: wxw-approval-submit
description: "为任意业务单据实现企业微信 OA 审批提交、审批单号与状态回写、审批回调同步时使用"
---
# 企微审批提交

适用于任意业务单据；目标项目已有 `base`、`wxwork` 和代码生成链路。

## 强制前提

- 业务适配放 `app/{mod}/{table}/`；通用 token、模板、控件、附件、签名与解密能力只放 `wxwork`。
- 当前租户/域名必须唯一定位已启用应用；多应用时模板必须有明确归属或映射，禁止猜测。
- 模板必须已同步 `template_id`，`business_type`、租户、组织、应用均匹配；申请人必须唯一映射到非空企微 userid。
- 回调必须先验签并从已验证应用确定租户；GET/POST 都校验 `msg_signature`、`timestamp`、`nonce`。
- 字段先改 `codegen/src/tables/{mod}/{mod}.sql`，再执行 `npm run codegen`、`npm run sql-alter`；同时配置权限、状态字典和附件可读权限。

## 业务数据

业务表：

```sql
`wxw_sp_status`                tinyint unsigned NOT NULL DEFAULT 0   COMMENT '企微审批状态,dict:wxw_oa_biz_sp_status',
`wxw_oa_approval_detail_id`    varchar(22)  NOT NULL DEFAULT ''      COMMENT '企微审批单号',
`wxw_oa_approval_detail_id_lbl` varchar(45) NOT NULL DEFAULT ''      COMMENT '企微审批单号',
`wxw_oa_template_id`           varchar(22)  NOT NULL DEFAULT ''      COMMENT '企微审批模板',
`wxw_oa_template_id_lbl`       varchar(100) NOT NULL DEFAULT ''      COMMENT '企微审批模板',
INDEX (`tenant_id`, `is_deleted`, `org_id`, `wxw_sp_status`),
INDEX (`tenant_id`, `is_deleted`, `org_id`, `wxw_oa_approval_detail_id_lbl`)
```

- `_id` 存本地 id；`wxw_oa_approval_detail_id_lbl` 必须存企微 `sp_no`；企微 `template_id` 只存模板表。
- `wxw_sp_status` 是状态枚举：`0` 待提交，`1/2/3/4` 对应审批中/通过/驳回/撤销，其他业务状态单独定义；禁止当作 bool。
- 审批详情至少保证 `tenant_id + sp_no` 唯一，可能冲突时加入应用维度；`raw_data` 不能同时承担提交快照和回调审计。

## 后端

### 入口与权限

- 增加 `wxwApprovalSubmit{Table}(ids: [{Table}Id!]!, wxw_oa_template_id: WxwOaTemplateId!): [String!]!`，写在 `{table}_graphql.rs`，挂到合并 Mutation。
- Resolver 校验权限 `wxw_approval_submit`；GraphQL 只使用 `.with_auth()?`，**禁止用大事务包裹企微 HTTP**。
- 去重 ids 并按首次出现顺序返回 `sp_no`；单号为空必须报错。

### 提交编排

1. 校验 ids、模板、应用、数据权限、业务状态及模板归属；不得仅依赖前端按钮。
2. 用带条件的原子更新抢占单据，条件为 `wxw_sp_status=0` 且审批 id 为空；可使用状态 `5` 表示提交中并同步字典。明确失败释放占位，结果未知时保留待确认。
3. 同步写入模板 id/名称并重读；业务层生成 `form_json`；用 `resolve_creator_userid` 解析申请人。
4. 在事务外构造并提交 payload；超时视为结果未知，禁止盲目重提。
5. 企微受理后，在一个短事务中幂等写入审批详情并更新业务单状态为 `1`、详情 id 和 `sp_no`。
6. 批量逐条、失败中止；错误必须带单据编号并说明前序单据可能已成功，已受理请求禁止回滚。

自动补偿必须在请求前持久化提交快照；企微受理后才落 `raw_data` 不能覆盖本地落库失败。

### 表单 JSON

- key 必须与控件标题逐字一致。优先使用字段注释元数据；同名字段按“非空 > `_lbl` > `lbl` > 日期时间 > 普通非 id 字段”去重。
- 公共构造器负责 `contents`、摘要和模板审批人，不在业务模块手拼。
- 支持 `Text/Textarea/Number/Money/Date/Selector/File` 和一层 `Table`；`Tips/Formula` 跳过，嵌套表格报错；必填空值报错。
- `Date` 传秒级时间戳；`Selector` 传选项文案；单选不得传数组。
- `File` 传 OSS id，由公共层上传为企微 `media_id` 后立即提交；不得缓存 3 天有效期的临时素材。

### 回调

1. 验签、解密、唯一解析应用后再处理 `sys_approval_change`；空 `sp_no` 或非法状态直接拒绝。
2. 回调无登录态，必须用 dao 直查并显式过滤已验证应用的 `tenant_id`。
3. 按租户和 `sp_no` 幂等 upsert 审批详情；通过本地模板的 `business_type` 经注册表分发，禁止 `wxwork` 静态引用业务模块。
4. 业务处理器按 `tenant_id + sp_no` 原样更新状态并保证幂等；临时失败返回非成功响应触发重试，未知业务/无匹配单据必须告警可观测。

## 前端

- 增加 mutation API；模板按当前 `business_type`、启用、未删除、应用匹配过滤，排序后默认选第一项。
- 按钮使用 `permit("wxw_approval_submit", "企微审批提交")`，必须校验多选；只有状态 `0` 可提交，并按业务规则锁定编辑/删除。
- 状态使用字典；单号、模板分别显示对应 `_lbl`；提交成功或部分失败都在 `finally` 刷新列表。

## 验证

- GraphQL 变更后执行 `npm run gqlgen`；执行 `cargo check` 和 `pc` 的 `pnpm run typecheck`。
- 必测：权限/租户、空重复 ids、禁用或不匹配模板、缺失/重复用户、并发提交、空 `sp_no`、部分成功、超时及本地落库失败。
- 必测：所有支持控件、必填/非法选项、附件上传、token 刷新、签名验签、无登录态回调、未知业务、处理失败和重复回调。
