---
name: bootstrap-new-project
description: 新分支启动新项目时，执行全仓库改名与环境配置。
metadata:
  version: "1.0"
---

# 新项目初始化（改名 + 环境配置）

## 何时使用

- 从 `rust4wx` 等上游分支 checkout 新分支，准备启动新项目
- 需要把示例工程名（如 `rust` / `nest`）批量替换为新工程名
- 需要切换数据库 / minio / redis 等到新项目专属资源

## 核心命名规则（先记牢再动手）

设新工程名为 `{name}`，环境为 `{env}` ∈ `dev|test|prod`：

| 用途 | 取值 | 例 |
|------|------|----|
| Cargo 包名 / bin 名 | `{name}` | `ql4wlsy` |
| PM2 应用名 / server_title | `{name}4{env}` | `ql4wlsy4prod` |
| 数据库名 / 用户名 | `{name}4{env}` | `ql4wlsy4prod` |
| OSS / tmpfile bucket | `{name}4{env}` / `tmpfile4{name}4{env}` | `ql4wlsy4prod` / `tmpfile4ql4wlsy4prod` |
| RUST_LOG 首段 | `{name}=info,...` | `ql4wlsy=info,generated=info,app=info` |

⚠️ 常见错误：漏掉 `4{env}` 后缀、把 `tmpfile4` 前缀写成 `{name}4tmpfile`。

## 改动清单（按文件执行）

### 1. `rust/Cargo.toml` — 3 处
- `[package] name`
- `[package] default-run`
- `[[bin]] name`

### 2. `rust/ecosystem.config.json` — 2 处
- `apps[0].name`: `{name}4{env}`（注意保留 `4{env}` 占位）
- `apps[0].script`: `./{name}`

### 3. `rust/.vscode/launch.json` — 2 处
- `configurations[0].name`
- `inputs[0].args.filter`

### 4. `rust/.env` / `.env.test` / `.env.prod` — 每个文件都改

| 字段 | 改成 |
|------|------|
| `RUST_LOG` 首段 | `{name}=info` |
| `server_title` | `{name}4{env}` |
| `server_port` | 项目专属端口（仅 prod 必改；dev/test 按需） |
| `database_username` / `database_password` / `database_database` | 新项目库（含被注释掉的 `database_dw_*` 示例行也一并改，方便后续启用） |
| `oss_bucket` | `{name}4{env}` |
| `tmpfile_bucket` | `tmpfile4{name}4{env}` |
| `cache_db` | 项目专属 redis db 编号（多项目共用 redis 时避免冲突） |

⚠️ 当前团队约定 `.env`（dev 本地）也直连 `{name}4prod` 远程库，不要用 `4dev`。

### 5. `codegen/src/tables/base/base_tenant.sql.csv`
- 默认租户行的 `lbl` 与 `title` 改为新项目中文名

## 常见遗漏

- ❌ 只改了 `.env`，漏改 `.env.prod` / `.env.test`
- ❌ 漏改被注释掉的 `database_dw_*` 行（后续启用时会踩坑）
- ❌ `cache_db` 沿用旧编号，多项目共用 redis 时串数据
- ❌ `rust/readme.md` 不需要改动
