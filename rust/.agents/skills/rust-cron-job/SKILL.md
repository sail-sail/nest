---
name: rust-cron-job
description: Rust 定时任务规范.新增/修改定时任务使用
---

# Rust 定时任务开发

## 用途

当需要在本仓库新增、修改、排查定时任务时使用。

本项目的定时任务不是写死在代码配置里，而是：
- 业务逻辑写在 `app/{mod}/{table}/` 下
- 调度入口统一走 `app/cron/job/job_dao.rs`
- 调度配置存储在数据库表 `cron_job`、`cron_cron_job`
- 初始数据通过 `codegen/src/tables/{mod}/cron_job.{mod}.sql.csv`, `codegen/src/tables/{mod}/cron_cron_job.{mod}.sql.csv` 导入
- 其中的 `mod` 代表当前业务模块，例如 `ec`、`crm` 等

## 设计约定

### 1) 任务逻辑放业务模块

不要把业务逻辑直接堆在 `app/cron/job/job_dao.rs`。

正确做法：
- 在对应业务模块里写任务函数
- 例如 1688 刷新 token 放在 `app/ec/alibaba_app/alibaba_app_service.rs`

`job_dao.rs` 只负责：
- 根据 `job.code` 分发任务
- 创建/更新 `cron_job_log`
- 写任务执行状态

### 2) 分发方式使用静态 match

在 `app/cron/job/job_dao.rs` 的 `run_job` 中，使用 `match code.as_str()` 静态分发：

```rust
let exec_result: Option<Result<SmolStr>> = match code.as_str() {
  "test" => test(
    id,
    tenant_id,
    options,
  ).await.into(),
  "refresh_alibaba_app_token" => refresh_alibaba_app_token_job(
    id,
    tenant_id,
    options,
  ).await.into(),
  _ => None,
};
```

不优先做 trait 插拔、注册表、宏自动注册。

原因：
- 更贴合当前仓库规模
- 更容易让人和 AI 读懂
- 搜 `job code` 就能快速定位执行入口

### 3) 任务日志写明细

复杂任务建议往 `cron_job_log_detail` 写过程日志。

常用写法：

```rust
create_cron_job_log_detail(
  CronJobLogDetailInput {
    lbl: Some("日志内容".into()),
    cron_job_log_id: Some(cron_job_log_id),
    tenant_id: Some(tenant_id),
    ..Default::default()
  },
  options,
).await?;
```

适合记录：
- 扫描到多少条数据
- 哪些记录被跳过
- 哪些记录刷新成功
- 哪些记录失败及原因

## 新增定时任务步骤

### 第一步：在业务模块写任务函数

示例位置：
- `app/ec/alibaba_app/alibaba_app_service.rs`

函数签名建议与现有 cron 任务保持一致：

```rust
pub async fn some_job(
  cron_job_log_id: CronJobLogId,
  tenant_id: TenantId,
  options: Option<Options>,
) -> Result<SmolStr>
```

返回值：
- 成功时返回摘要文本 `SmolStr`
- 失败时返回 `Err(...)`

### 第二步：在 `job_dao.rs` 注册分发

在 `app/cron/job/job_dao.rs` 的 `run_job` 中加入一个新的 `match` 分支。

`job.code` 必须与 CSV 里的 `cron_job.code` 保持一致。

### 第三步：配置任务主数据 CSV

文件：
- `codegen/src/tables/{mod}/cron_job.{mod}.sql.csv`

新增一条任务定义，例如：

```csv
id,code,lbl,is_locked,is_enabled,order_by,is_sys,tenant_id
V2X8nQ4mLp7sKd3rTy6HzA,refresh_alibaba_app_token,1688自动刷新Token,1,1,2,1,ZDbZlC1OT8KaDg6soxMCBQ
```

字段要点：
- `code`：和 `job_dao.rs` 中的 match 分支一致
- `lbl`：任务名称
- `is_sys`：系统任务通常填 `1`

### 第四步：配置定时任务实例 CSV

文件：
- `codegen/src/tables/{mod}/cron_cron_job.{mod}.sql.csv`

新增调度实例，例如：

```csv
id,seq,lbl,job_id,cron,timezone,is_locked,is_enabled,order_by,rem,tenant_id
X9mC4rTb7qL2nHs6Pw8YdE,1,1688自动刷新Token,V2X8nQ4mLp7sKd3rTy6HzA,0 0 */2 * * *,Asia/Shanghai,0,1,1,每2小时自动刷新1688店铺Token,ZDbZlC1OT8KaDg6soxMCBQ
```

字段要点：
- `job_id`：指向 `cron_job.{mod}.sql.csv` 中的任务 ID
- `cron`：当前项目使用带秒字段的 6 段表达式
- `timezone`：通常用 `Asia/Shanghai`

## Cron 表达式约定

本项目调度实现使用 `delay_timer`，cron 表达式按 6 段写：

```text
秒 分 时 日 月 周
```

示例：
- 每 2 小时执行一次：`0 0 */2 * * *`
- 每天凌晨 1 点执行：`0 0 1 * * *`
- 每 30 分钟执行一次：`0 */30 * * * *`

不要误写成传统 Linux crontab 的 5 段格式。

## 导入配置

修改完两个 CSV 后，需要执行：

```bash
npm run importCsv -- {mod}/cron_job.{mod},{mod}/cron_cron_job.{mod}
```

工作目录：
- `codegen/`

作用：
- 将 `cron_job` 和 `cron_cron_job` 配置导入数据库

## 推荐检查清单

新增一个定时任务后，至少检查以下几点：

1. 业务函数是否放在正确模块，而不是直接塞进 `job_dao.rs`
2. `job_dao.rs` 是否已注册 `match` 分支
3. `cron_job.cron.sql.csv` 是否已新增任务定义
4. `cron_cron_job.cron.sql.csv` 是否已新增调度定义
5. `job.code` 和代码分支字符串是否完全一致
6. cron 是否是 6 段表达式
7. 是否已执行 `npm run importCsv -- {mod}/cron_job.{mod},{mod}/cron_cron_job.{mod}`
8. 是否写了足够的 `cron_job_log_detail` 明细日志
