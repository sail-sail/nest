---
name: bootstrap-new-project
description: 新分支启动新项目时，执行工程改名、环境配置与品牌替换。
metadata:
  version: "1.1"
---

# 新项目初始化

先确认 `{name}`、中文名 `{label}`、对外地址 `{domain}`、环境 `{env}`（`dev|test|prod`）及数据库、MinIO、Redis、端口和凭据。

## 命名规则

| 用途 | 值 |
|---|---|
| Cargo 包名 / 主二进制名 | `{name}` |
| PM2 应用名 / `server_title` | `{name}4{env}` |
| 数据库 / 数据库用户名 | `{name}4{env}` |
| OSS / tmpfile bucket | `{name}4{env}` / `tmpfile4{name}4{env}` |
| `RUST_LOG` 首段 | `{name}=info` |

`ecosystem.config.json` 源文件保留字面量 `{name}4{env}`，构建脚本部署时才替换 `{env}`。tmpfile 前缀是 `tmpfile4`，不是 `{name}4tmpfile`。

## 按顺序修改

### 1. 运行标识

- `rust/Cargo.toml`：修改 `[package] name`、`default-run` 和主应用 `[[bin]] name`；保留 `schema` 等工具二进制原名
- `rust/ecosystem.config.json`：应用名改为 `{name}4{env}`，脚本改为 `./{name}`
- `rust/.vscode/launch.json`：配置名和进程过滤器改为 `{name}`

### 2. 环境文件

同时修改 `.env`、`.env.test`、`.env.prod`，包括被注释的配置：

- `RUST_LOG`、`server_title`、`server_port`
- `database_*`、`database_dw_*`
- `oss_bucket`、`tmpfile_bucket`、`cache_db`
- `mcp_public_base_url`

用户名 / 库名按命名规则修改；密码和连接信息使用新项目凭据。端口与 `cache_db` 在共享环境中必须唯一。

`.env` 的 `server_title` 使用 `{name}4dev`；当前团队约定 `database_*` / `database_dw_*` 直连 `{name}4prod`。对象存储等资源按目标环境确认。

### 3. API 与品牌

- OAI / MCP 服务显示名改为 `{name}`：`rust/app/base/oai/`、`rust/app/base/mcp/`
- 默认租户 `lbl` / `title` 改为 `{label}`：`codegen/src/tables/base/base_tenant.sql.csv`
- PC 登录页品牌与 uni 应用标题改为 `{label}`：`pc/src/layout/`、`uni/src/pages.json`
- MCP 对外地址同步改为 `{domain}`，包括相关文档示例

## 残留检查

按旧工程名和旧中文名搜索全仓库，逐项判断：

```bash
rg -n -i "旧工程名|旧项目中文名"
```

运行标识、服务标题、品牌和部署配置必须替换；产品型号、业务数据、历史记录不得盲目替换。改组件文件名时同步修改引用。

## 验证

- 三份环境文件及注释配置无遗漏，Cargo / PM2 / 调试进程名一致
- 残留仅为明确保留的业务或历史内容
- Rust 改动执行 `cargo check`；前端改动执行对应构建检查
