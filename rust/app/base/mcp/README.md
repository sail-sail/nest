# MCP 使用说明

该目录实现了内嵌在 rust 服务中的 MCP 入口、标准 OAuth2 授权服务，以及 MCP 调试工具。

## 入口

- MCP 端点: `/mcp`
- 手工登录辅助: `POST /mcp/login`
- OAuth Protected Resource Metadata:
  - `/.well-known/oauth-protected-resource/mcp`
  - `/.well-known/oauth-protected-resource`
- OAuth Authorization Server Metadata: `/.well-known/oauth-authorization-server`
- OAuth 端点:
  - `GET/POST /authorize`
  - `POST /token`
  - `POST /register`
  - `POST /revoke`

## 两种使用方式

### 方式一: 标准 MCP OAuth 接入

适用于支持 Streamable HTTP MCP 和 OAuth 授权码 + PKCE 的客户端。

1. 把 MCP 服务地址配置为 `http://<host>:<port>/mcp`
2. 客户端首次访问 `/mcp` 时会收到 `401` 和 `WWW-Authenticate`，并从 `resource_metadata` 继续发现授权服务
3. 客户端读取 `/.well-known/oauth-authorization-server`
4. 客户端如果没有预注册 client，可先调用 `POST /register`
5. 客户端使用 `code_challenge_method=S256` 发起 `/authorize`
6. 用户在授权页里用当前系统的租户、用户名、密码登录并授权
7. 客户端用 `/token` 换取 `access_token / refresh_token`
8. 后续访问 `/mcp` 时带 `Authorization: Bearer <access_token>`

说明:

- 当前只支持 `response_type=code`
- 当前只支持公开客户端 `token_endpoint_auth_method=none`
- 当前只支持 `mcp:tools` scope
- 当前只支持 `code_challenge_method=S256`

### 方式二: 手工调试直连

适用于本地调试、脚本验证，或不想走完整 OAuth 授权码流程时。

1. 调用 `POST /mcp/login`
2. 请求体直接复用系统登录结构:

```json
{
  "username": "admin",
  "password": "***",
  "tenant_id": "...",
  "org_id": null
}
```

3. 返回值里的 `authorization` 就是当前系统 JWT
4. 访问 `/mcp` 时带上 `Authorization: Bearer <authorization>`

这条路径不是标准 OAuth，只用于手工接入和排障。

## 已提供的 MCP tools

- `session_me`: 查看当前登录态和 token 相关信息
- `schema_search`: 搜索当前服务的 GraphQL schema，定位 Query、Mutation、Input、返回类型和字段签名；会过滤 `findOneOk*` / `findByIdOk*` / `findByIdsOk*`、`getFieldComments*` 和 `*FieldComment`
- `schema_get`: 按类型名精确返回完整 SDL，适合在搜索后查看某个类型的完整定义；过大的聚合类型会直接拒绝返回
- `graphql_execute`: 直接在进程内执行 GraphQL query / mutation；顶层 `findAll*` 缺 `page` 会拒绝执行，`pgSize` 缺省按 20，超过 200 自动降到 200
- `oss_upload`: 上传附件
- `oss_download_url`: 生成附件下载链接
- `oss_image_url`: 生成图片预览链接

建议:

1. 先调用 `session_me` 验证身份是否正确
2. 不清楚 GraphQL 名称时先用 `schema_search` 搜索 Query、Mutation 和相关 Input/Model
3. 已经定位到精确类型名后，用 `schema_get` 拉该类型的完整 SDL
4. 如果是 `findAll*` 列表查询，务必显式传 `page: { pgOffset, pgSize, isResultLimit: true }`；缺 page 会被直接拒绝，`pgSize` 缺省按 20、超过 200 自动降到 200，并优先先查对应的 `findCount*`
5. 再用 `graphql_execute` 调试业务接口
6. 附件相关场景再调用 `oss_*`

## token 存储配置

通过 `.env` 配置 `mcp_token_type`:

```dotenv
mcp_token_type = "redis" # "redis" or "memory"
mcp_token_redis_hostname = "127.0.0.1"
mcp_token_redis_username = ""
mcp_token_redis_password = ""
mcp_token_redis_port = 6379
mcp_token_redis_db = 0
```

说明:

- `memory`: 进程内存版，服务重启后 OAuth client、authorization code、OAuth session、rmcp session 恢复状态全部丢失
- `redis`: 持久化到 Redis，适合本地长期调试和单实例部署；rmcp 会用 `SessionStore` 持久化会话恢复所需的 initialize 状态

Redis key 前缀统一为:

- `mcp:oauth:client:*`
- `mcp:oauth:code:*`
- `mcp:oauth:session:*`
- `mcp:oauth:access:*`
- `mcp:oauth:refresh:*`
- `mcp:rmcp:session:*`

## 可选过期配置

```dotenv
mcp_oauth_access_token_timeout = 3600
mcp_oauth_refresh_token_timeout = 2592000
mcp_oauth_authorization_code_timeout = 300
mcp_rmcp_session_timeout = 300
```

默认值:

- access token: 3600 秒
- refresh token: 30 天
- authorization code: 300 秒
- rmcp session 空闲超时: 300 秒

## 可选 Host / Origin allowlist

如果需要启用 rmcp 自带的 Host / Origin 校验，可通过 `.env` 显式配置:

```dotenv
mcp_allowed_hosts = "mcp.example.com,mcp.example.com:8443"
mcp_allowed_origins = "https://client.example.com,https://client.example.com:443"
```

说明:

- 当前默认值为了兼容既有部署，等价于关闭 Host / Origin allowlist 校验
- 一旦配置了 `mcp_allowed_hosts` / `mcp_allowed_origins`，rmcp 会按配置值校验请求头里的 `Host` / `Origin`
- `mcp_allowed_origins` 需要带协议；如需严格浏览器来源控制，建议显式配置而不是依赖默认值

## 当前限制

- 当前 `/mcp` 已切到基于 rmcp 的 Streamable HTTP transport，并通过 `SessionStore` 支持会话恢复；OAuth discovery、授权页、token/register/revoke 仍是当前项目内嵌实现
- 当前 OAuth client 注册、token、session 没有做多实例并发协调之外的额外治理策略
- 当前 `mcp_oss_download_url` / `mcp_oss_image_url` 返回的是底层业务 JWT 链接，因为附件和图片接口本身仍走现有业务鉴权
- 当前只做了 OAuth 公开客户端模式，没有实现 client secret 模式

## 验证建议

1. 用 curl 或 Postman 调 `POST /register`
2. 用返回的 `client_id` 走 `/authorize` + `/token`
3. 拿到 `access_token` 后调用 `/mcp` 的 `initialize`、`tools/list`、`tools/call`
4. 如果只想快速验证，直接用 `POST /mcp/login` + `/mcp`
