---
name: rust-cron-job
description: Rust 定时任务规范.新增、修改或排查时使用
---

# Rust 定时任务

## 文件职责

- `app/{mod}/{table}/`：业务逻辑
- `app/cron/job/job_dao.rs`：按 `job.code` 分发，记录任务状态；不要堆业务逻辑
- `codegen/src/tables/{mod}/cron_job.{mod}.sql.csv`：任务定义
- `codegen/src/tables/{mod}/cron_cron_job.{mod}.sql.csv`：执行计划

`{mod}` 是实际业务模块名，例如 `scrm`。

## 强约束

1. 任务逻辑必须放在对应业务模块。
2. `job_dao.rs` 使用静态 `match` 分发，不引入注册表、trait 或宏。
3. 分发结果必须是 `Result<String>`；成功时返回摘要，失败时返回 `Err(...)`。
4. 代码中的匹配字符串、CSV 中的 `cron_job.code` 必须完全一致。
5. 复杂任务通过 `cron_job_log_detail` 记录扫描数、跳过数、成功数和失败原因。
6. `Options` 和所有 ID 类型都是 `Copy`，直接传递，不要 `.clone()`。

需要写执行明细时，业务入口通常保持以下参数：

```rust
pub async fn some_job(
  cron_job_log_id: CronJobLogId,
  tenant_id: TenantId,
  options: Option<Options>,
) -> Result<String>
```

不需要执行明细时可省略 `cron_job_log_id`，但返回类型不变。

## 新增流程

### 1. 实现业务逻辑

放到对应模块，例如 `app/scrm/clue/clue_job_service.rs`。

写明细日志：

```rust
create_cron_job_log_detail(
  CronJobLogDetailInput {
    lbl: Some("扫描完成，共处理 10 条".into()),
    cron_job_log_id: Some(cron_job_log_id),
    tenant_id: Some(tenant_id),
    ..Default::default()
  },
  options,
).await?;
```

只记录排查需要的信息，不要逐条记录噪音。

### 2. 注册分发

在 `app/cron/job/job_dao.rs` 的 `run_job` 中增加分支：

```rust
"some_job" => some_job(
  id,
  tenant_id,
  options,
).await.into(),
```

### 3. 配置任务定义

修改 `codegen/src/tables/{mod}/cron_job.{mod}.sql.csv`，复制同模块现有表头和相邻数据格式：

- `code`：唯一，且与 `match` 字符串一致
- `lbl`：任务名称
- `is_enabled`：`1` 表示启用
- `is_sys`：系统任务填 `1`
- `tenant_id`：填当前租户

ID 使用 `npm run uuid -- 2` 生成，不要手写随机值。

### 4. 配置执行计划

修改 `codegen/src/tables/{mod}/cron_cron_job.{mod}.sql.csv`：

- `job_id`：引用上一步的任务 ID
- `cron`：使用 6 段表达式
- `timezone`：使用有效 IANA 时区；省略时数据库默认 `Asia/Shanghai`
- `exec_usr_id`、`org_id`：按该任务实际执行身份配置
- `is_enabled`：`1` 表示启用

当前调度器使用 `cron_clock::Schedule`。表达式顺序是：

```text
秒 分 时 日 月 周
```

```text
0 0 */2 * * *   # 每 2 小时
0 0 1 * * *     # 每天 01:00
0 */30 * * * *  # 每 30 分钟
```

不要使用 5 段 Linux crontab。

### 5. 导入并生效

在 `codegen/` 执行：

```bash
npm run importCsv -- {mod}/cron_job.{mod},{mod}/cron_cron_job.{mod}
```

参数不要带 `.sql.csv`。导入后重启 Rust 服务；排期在 `init_cron_jobs` 启动时加载。

## 完成检查

1. `cargo check` 通过。
2. 业务逻辑未进入 `job_dao.rs`。
3. `job.code`、`match` 字符串、`job_id` 一致。
4. Cron 为 6 段，任务和计划均已导入。
5. 复杂任务有足够的明细日志。