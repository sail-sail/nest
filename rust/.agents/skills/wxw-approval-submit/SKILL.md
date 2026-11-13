---
name: wxw-approval-submit
description: "为任意业务单据实现企业微信 OA 审批提交、审批单号与状态回写、审批回调同步时使用"
---
# 企微审批提交

面向任意业务单据。目标项目必定存在 `base`、`wxwork` 和代码生成约定。

业务适配代码放 `app/{mod}/{table}/`（`{table}_service.rs`、`{table}_resolver.rs`、`{table}_graphql.rs`），模型/dao/input 在 `generated/{mod}/{table}/`（生成结果可直接改）。本技能自包含，不读取其他业务模块的实现。

## 前置检查

- 复用 `wxwork` 的 token、企微请求、模板详情、控件转换、附件上传和回调解密；缺失能力补公共层，不在业务模块重写。
- 确认 `wxw_app` 已配置且启用；模板已同步企微 `template_id`，`business_type` 与业务模块常量逐字一致（含空格）；系统用户已同步为对应应用的企微用户。
- 业务字段先改代码生成的表定义（如 `codegen/src/tables/{mod}/{mod}.sql`），跑 `npm run codegen` 重新生成 model/dao/input（生成结果可直接改），再跑 `npm run sql-alter` 生成并执行 ALTER。
- 应用必须能通过当前租户/域名唯一解析。单租户存在多个企微应用时，模板必须有应用归属或明确映射，禁止猜测。
- 回调路由必须唯一解析应用，并从已验证的应用确定租户；确认 GET/POST 校验 `msg_signature`、`timestamp`、`nonce`，缺失时先补 `wxwork`。
- 确认菜单权限项、状态字典和 OSS 附件可读；权限未配置时不能依赖“找不到菜单就放行”的默认行为。

## 业务数据

业务表增加：

```sql
`wxw_sp_status`                tinyint unsigned NOT NULL DEFAULT 0   COMMENT '企微审批状态,dict:wxw_oa_biz_sp_status',
`wxw_oa_approval_detail_id`    varchar(22)  NOT NULL DEFAULT ''      COMMENT '企微审批单号',
`wxw_oa_approval_detail_id_lbl` varchar(45) NOT NULL DEFAULT ''      COMMENT '企微审批单号',
`wxw_oa_template_id`           varchar(22)  NOT NULL DEFAULT ''      COMMENT '企微审批模板',
`wxw_oa_template_id_lbl`       varchar(100) NOT NULL DEFAULT ''      COMMENT '企微审批模板',
INDEX (`tenant_id`, `is_deleted`, `org_id`, `wxw_sp_status`),
INDEX (`tenant_id`, `is_deleted`, `org_id`, `wxw_oa_approval_detail_id_lbl`)
```

- `wxw_oa_approval_detail_id` 存本地审批详情 id；对应 `_lbl` **存企微 `sp_no`**，用于展示和回调反查，禁止存名称。
- `wxw_oa_template_id` 存本地模板 id；企微 `template_id` 只存于 `wxw_oa_template`。
- `wxw_sp_status = 0` 表示本地待提交；其余值原样保存企微状态（企微：`1` 审批中、`2` 已通过、`3` 已驳回、`4` 已撤销，业务可追加自己的值）。使用 `tinyint unsigned`/`u8`，判断 `== 1`，不使用 `bool`；字典编码可自建（示例 `wxw_oa_biz_sp_status`），但选项值必须与企微一致。
- 审批详情至少按 `tenant_id + sp_no` 唯一并幂等写入；多企业或多应用可能产生单号冲突时增加区分维度。
- `raw_data` 可保存提交 payload 或回调 XML，但回调可能覆盖提交内容；需要完整审计时单独保留提交快照。

## 后端

### 入口与权限

增加 `wxwApprovalSubmit{Table}(ids: [{Table}Id!]!, wxw_oa_template_id: WxwOaTemplateId!)`，返回 `Vec<String>`，顺序与入参 `ids` 一致；写在 `{table}_graphql.rs`，并挂到 `app/{mod}/mod.rs` 的合并 Mutation，改完跑 `npm run gqlgen`。GraphQL 入口使用 `Ctx::builder(ctx).with_auth()?.build().scope(...)`，**不要包覆整个提交的 `with_tran()`**。

resolver 调用 `use_permit(get_page_path_{table}().to_string(), "wxw_approval_submit".into())`；前后端权限 key 均为 `wxw_approval_submit`。

### 提交编排

1. 校验 `ids`、模板 id 非空，去除重复 id；解析唯一且启用的应用，并校验模板已启用、未删除、企微 `template_id` 非空，且业务类型（与模块常量逐字一致）、租户、组织和应用归属匹配。
2. 逐条加载并校验单据：属于当前数据范围、业务状态允许提交、尚未关联审批单。并发不能只靠前端禁用按钮：用带前置条件的原子 `update` 先占位（如置本地「提交中」`wxw_sp_status=5`，字典同步加项，条件 `wxw_sp_status=0 and wxw_oa_approval_detail_id=''`），影响行数为 0 即视为已被提交或状态不允许；明确失败回滚占位，超时/未知保留占位待人工确认。
3. 抢占时一并回写模板 id 和名称，然后重读整行；业务模块生成 `form_json`。
4. 用 `resolve_creator_userid(usr_id, app.id, options)` 解析申请人；要求映射唯一且 userid 非空，找不到或重复均报错，不做姓名兜底。
5. 在事务外调用 `build_submit_approval_apply_payload`，序列化 payload 供留存，再调用 `submit_approval_apply(app.id, payload)`；成功响应中的 `sp_no` 必须非空。
6. 企微受理后立即落库：创建/更新审批详情（状态 `1`，保存 `sp_no`、模板、申请时间、申请人、原始数据、组织）并回写业务单（状态 `1`、详情 id、`_lbl = sp_no`）。两次写库要在一个短事务里；生成层没有局部事务入口时先补公共事务工具，不要为此把 HTTP 调用包进入口的大事务。
7. 批量默认逐条处理、失败即中止，错误中带单据编号，并明确此前可能已有成功单据；禁止回滚已被企微受理的申请。

响应超时按“结果未知”处理，通过对账或人工补偿确认，禁止盲目重提。需要自动补偿时，必须在提交前持久化请求快照；事后才写 `raw_data` 无法覆盖所有本地落库失败。

### 表单 JSON

`form_json` 是由业务模块生成的对象，key 必须与企微控件标题逐字一致（含空格、括号）。优先用生成的 `get_field_comments_{table}()` 元数据（字段名→注释名）；不存在时编写业务显式映射，不要在 `wxwork` 写死业务字段。同名注释去重优先级：非空 > `_lbl` > `lbl` > 日期时间 > 普通非 id 字段。

公共构造器负责控件值、摘要和模板默认审批人，不要手拼 `contents`：

- 支持 `Text/Textarea/Number/Money/Date/Selector/File` 和一层 `Table`；`Tips/Formula` 跳过，嵌套 `Table` 报错。
- 必填控件缺失或为空必须报错；`Table` 使用对象数组，每行同样以子控件标题为 key。
- `Date` 使用秒级时间戳字符串；`Selector` 传选项文案并由公共代码反查 key，单选不得传多值。
- `File` 传 OSS 附件 id 字符串/数组，由 `upload_media` 换成企微 `media_id`；不要把 OSS id 当成企微文件 id。`media_id` 是 3 天有效期的临时素材，只在上传后立即提交，不缓存复用。

### 回调

1. 验签、解密并唯一解析应用后，再处理 `sys_approval_change`；空 `sp_no`、非法状态直接拒绝，不使用默认状态 `0`。
2. 公共层按已验证应用的租户幂等 upsert 审批详情，再分发业务事件；回调不能依赖登录态（生成的 `find_*` 默认取 `get_auth_id_ok()`，回调里会报 `Not login`；应改用 dao 直查并显式按 `tenant_id` 过滤）。
3. 通过 `tenant_id + template_id` 查本地模板得到 `business_type`，由应用组装层的注册表/分发器调用业务处理器；禁止让 `wxwork` 静态引用具体业务模块。没有分发机制时先建立该扩展点。
4. 业务处理器按 `tenant_id + sp_no` 查询并原样回写 `wxw_sp_status`；重复回调必须幂等。处理失败返回非 200 或非 `success`，避免企微停止重试；无处理器或无匹配单据必须记录并可观测。

## 前端

1. 在目标业务模块增加上述 mutation 的 API 封装。
2. 弹窗仅选择模板：按当前 `business_type`、启用、未删除筛选，按 `order_by` 升序，排除企微 `template_id` 为空或应用不匹配的项，默认选中第一项。
3. 列表按钮使用 `permit("wxw_approval_submit", "企微审批提交")` 并校验多选；`wxw_sp_status != 0` 的行禁止再提交，并按业务规则锁定编辑/删除；成功或批量部分失败后都刷新列表。
4. 状态列绑定业务状态字典；单号显示 `wxw_oa_approval_detail_id_lbl`，模板显示 `wxw_oa_template_id_lbl`。

## 验证

- 执行 `cargo check` 和前端 `pnpm run typecheck`；GraphQL 变更后跑 `npm run gqlgen`。
- 覆盖：空/重复 ids、越权或跨租户、禁用模板、应用不唯一、用户缺失/重复、重复及并发提交、空 `sp_no`、批量部分成功、超时和本地落库失败。
- 覆盖各支持控件、必填空值、非法选项、附件上传失败、token 刷新，以及合法/非法签名、回调缺登录态、未知业务、处理器失败、重复回调。
