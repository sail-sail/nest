# agent —— 业务智能体服务

本目录是独立于 `rust/`、`pc/` 的第三个 Node 服务，作为「业务智能体」的宿主（Host）。
它不做业务 CRUD，只做四件事：鉴权透传、会话管理、驱动 dsh runtime、向前端流式输出。

浏览器访问 `http://localhost:4000/agent/*`，由 Vite dev server 反代到本服务 `127.0.0.1:4002`。
生产环境由同一个反向代理（Nginx）挂在同域名的 `/agent/` 子路径下，本服务不直接对外暴露。

## 当前状态（2026-10-22）

- 后端：单 runtime + 内部桥 + 7 个业务工具 + SSE + 会话转录/恢复，已用真实模型和真实 GraphQL 查询跑通。
- 页面操作：`page_status` / `page_operate` 已打通，实测模型调用后自动收起抽屉、点击页面按钮、回传结果（6 步约 50 秒）。
- 长期记忆：宿主侧按用户隔离，`memory_save/search/list/forget` + 首轮自动注入，已验证跨会话召回。
- 外接 MCP：`mcp.config.json` 驱动，已验证 streamable-http 工具发现与调用（`mcp__<name>__<tool>`）。
- 技能：`agent/skills` 已被 dsh 扫描，已验证 `business-query` 的目录注入与 `skill` 工具加载。
- 图表：ECharts（` ```echarts ` 代码块 + `<echarts>` 标签）和 Mermaid（flowchart / 时序 / ER 等）都已验证。
- 前端：`pc` 已接入 `markstream-vue`，右下角悬浮「智能助手」，抽屉模式；另有 `/agent` 独立页面。
- 待办：多实例 Redis 映射、工具审计落库、写操作白名单、生产反代（SSE 关闭缓冲）。

前端使用: https://github.com/Simon-He95/markstream-vue 来渲染对话内容

## 一、鉴权结论

**去掉了 OAuth2 授权码流程，但没有去掉鉴权。**

- OAuth2（`/authorize` + `/token` + PKCE）是给「第三方 MCP 客户端」用的接入方式，浏览器内的自有前端不需要它。
- 浏览器把 `localStorage.getItem("store.usr.authorization")` 里的业务 JWT 放进 `Authorization: Bearer <token>`，随每次对话请求发给本服务。
- 本服务只把 token 保存在**进程内存**中，按会话（dsh sessionId）索引；调用 Rust 时原样透传。
- Rust 的 `/mcp` 已经支持直接接受业务 JWT（`auth_model_from_authorization_header` 对非 `mcp_` 前缀的 token 走 `get_auth_model_by_token`），因此无需改动 Rust。

token 约束：

1. 不落盘、不写日志、不进模型上下文、不放进 URL query。
2. 前端不要用 `EventSource`（浏览器不允许给它设请求头），用 `fetch` + `ReadableStream` 读 SSE/NDJSON。
3. token 可能在响应头里被刷新（`pc/src/utils/request.ts` 会调 `refreshToken`），所以每条消息都重新读取，不要只在建立连接时读一次。

## 二、为什么不能把 `/mcp` 直接配进 dsh

dsh 自带 `@deepseek-ai/dsh-mcp-client`，可以把 MCP server 的工具自动注册成 `mcp__<server>__<tool>`。
但它的 `headers` 是**每个 server 连接一份、加载时求值**的静态配置（`!!js process.env.MCP_TOKEN`），
作用域是整个 runtime 进程，不是单个用户会话。多用户共用一个 runtime 时，静态 header 必然串号。

因此业务工具必须按会话取 token。两条可行路线：

### 方案 A（推荐，目标架构）：单 runtime + 内部工具桥

```
浏览器 :4000
  │ POST /agent/api/conversations/:id/messages   Authorization: Bearer <jwt>   (SSE 响应)
  ▼
Vite / Nginx 反代 /agent → 127.0.0.1:4002
  ▼
agent 服务（Node）
  ├─ 会话表：conversationId → { dshSessionId, token, usrId }
  ├─ DeepSeekHarness（单例，只 spawn 一个 dsh 子进程）
  │    launch: { profile: "sdk", patches: ["./dsh/patch.yml"], dshHome: "./.dsh" }
  │    run(prompt, { sessionId, onNotification }) → 转发 session.event 给浏览器
  └─ 内部桥 127.0.0.1:<随机端口>（仅回环 + 共享密钥）
         POST /internal/tools/call { sessionId, tool, args }
         → 按 sessionId 取 token
         → MCP client 调 Rust /mcp tools/call
         → 返回规范 JSON
  ▼
Rust :4001 /mcp   Authorization: Bearer <jwt>
```

dsh 里的工具插件（`dsh/tool-plugin.mjs`）只做一件事：
`execute()` 里拿 `exec.agent.id`（dsh 的 SessionId），带着桥密钥调用内部桥。
token 永远不进入 dsh 子进程，也不进入模型上下文。

代价：需要自己维护「会话 → token」映射与 MCP client 池；多实例部署时映射要放 Redis。

### 方案 B（仅用于冒烟验证）：每个用户一个 runtime

构造 `DeepSeekHarness` 时把 token 放进 `launch.env.MCP_TOKEN`，
`patch.yml` 里用 `mcp-client` 直接挂 Rust `/mcp`：

```yaml
- id: app-mcp
  name: '@deepseek-ai/dsh-mcp-client'
  config:
    serverName: app
    transport: streamable-http
    url: http://127.0.0.1:4001/mcp
    headers:
      Authorization: !!js '`Bearer ${process.env.MCP_TOKEN}`'
```

优点：零自定义工具代码，dsh 自动发现 schema。
缺点：每用户一个 Node 子进程（dsh 安装约 557 个包，单个 runtime 内存不小）；token 进环境变量；
token 轮换要重启 runtime；会话历史分散在各 runtime 的 `dshHome`。
只建议拿它验证 dsh 能否跑通，不作为最终架构。

## 三、dsh 侧的裁剪（很重要）

`sdk` profile = `dsh-base` + `dsh-sdk-app`，而 `dsh-base` 是一个**编码智能体**的完整组合：
`tool-bash` / `tool-pwsh` / `tool-fs` / `tool-fs-search` / `tool-web` / `tool-jobs` / `subagent` 全在，
`system-prompt.personaPrefix` 是 “You are a coding agent”，审批策略默认 `approval: ask`。

直接上线等于给模型一个服务器 shell，而且没有 UI 回答审批，工具调用会卡住。
`dsh/patch.yml` 必须做三件事：

1. 覆盖 `system-prompt.personaPrefix`，改成业务助手人格。
2. `disabled: true` 关掉 `tool-bash`、`tool-pwsh`、`tool-fs`、`tool-fs-search`；
   `tool-web` 按业务要求保留，但要在提示词里约束「不要把业务数据拼进 URL」。
3. `approval.policy: never` + `sandbox-policy.mode: read-only`，避免无 UI 审批；再按需放开。

保留：`skill` / `skill-filesystem` / `tool-skill`（技能）、`compaction-*`（长会话压缩）、`session-*`（持久化）。

## 四、工具清单（以 Rust 为准）

Rust 的 MCP 实际暴露 7 个工具，不是 5~6 个：
| 工具 | 用途 | 建议 |
|---|---|---|
| `session_me` | 当前登录态 | 保留，可用于启动自检 |
| `schema_search` | 搜索 GraphQL schema | 保留 |
| `schema_get` | 取类型 SDL | 保留 |
| `graphql_execute` | 直接执行 GraphQL | **默认只读**，见下 |
| `oss_upload` | 上传附件 | 按需 |
| `oss_download_url` | 下载链接 | 保留 |
| `oss_image_url` | 图片预览链接 | 保留 |

schema 定义以 `rust/app/base/mcp/mcp_model.rs` 为准，插件里手写一份并注明来源；
Rust 侧字段变更时必须同步修改，否则模型会传错参数。

另外还有 6 个**不走 Rust** 的宿主工具：

| 工具 | 用途 |
|---|---|
| `page_status` | 页面操作通道是否在线、当前路由 |
| `page_operate` | 在用户当前页面执行点击/填写/提交 |
| `memory_save` | 写入该用户的长期记忆 |
| `memory_search` | 检索长期记忆 |
| `memory_list` | 列出长期记忆 |
| `memory_forget` | 删除/清空长期记忆 |

## 五、安全边界

1. **`graphql_execute` 默认只读**：桥接层用 `graphql` 解析 AST，出现 `MutationDefinition` 直接拒绝；
   后续要放开写操作，走「mutation 白名单 + 二次确认」，不要整体放开。
2. **`tool-web` 已保留**：模型可以把业务数据拼进 URL 外发，提示词里要明确禁止；
   需要更严格时再单独关闭 `tool-web` 或 `web-fetch-http`。
3. **审计**：每次工具调用记录 `usrId / sessionId / tool / 耗时 / 是否成功`，不记录 token 和完整业务数据。
4. **网络**：agent 只 bind `127.0.0.1`；内部桥用随机端口 + 每次启动生成的共享密钥；生产只经同源反代。
5. **配额**：按用户限制并发会话数、单轮工具调用次数、单轮 token 上限。

## 六、目录规划

```
agent/
  src/
    index.ts           HTTP 入口（Hono）、/agent/api/*、SSE
    config.ts          环境变量与路径
    auth.ts            Bearer 解析、JWT payload、token hash
    store.ts           会话表、token 映射、会话持久化
    harness.ts         DeepSeekHarness 单例、spawn/关闭、resume
    stream.ts          session.event → SSE 事件映射
    bridge.ts          内部工具桥（仅回环 + 共享密钥）
    mcp-pool.ts        按 token 复用 MCP client
    readonly.ts        GraphQL 只读校验
    page-hub.ts        浏览器页面操作通道：连接注册、任务下发、超时
    llm-proxy.ts       /agent/llm 模型代理（key 留在服务端）
    transcript.ts      对话转录（JSONL，供前端恢复历史）
  dsh/
    patch.yml          dsh profile overlay
    tool-plugin.mjs    注册 7 个业务工具 + 2 个页面工具，转发到内部桥
  skills/              业务技能（SKILL.md，dsh 自动发现）
  SKILLS.md            技能目录约定与示例
  workspace/           dsh 的工作目录（沙箱根，不放业务代码）
  mcp.config.example.json  外接 MCP 模板
  mcp.config.json          本地外接 MCP 配置（git 忽略）
  .dsh/                dshHome：会话日志、配置、转录、生成的 MCP overlay（git 忽略）
```

## 七、接口草案

- `POST /agent/api/conversations` → `{ id }`
- `GET  /agent/api/conversations` → 当前用户的会话列表
- `POST /agent/api/conversations/:id/messages` → SSE 流
  - 请求：`{ "text": "..." }`，头 `Authorization: Bearer <jwt>`
  - 事件：`text`（助手增量/整段）、`tool_call`、`tool_result`、`done`、`error`
- `GET  /agent/api/health` → `{ ok, dsh: "up" | "down" }`

SSE 用 POST + `fetch` 读流，不用 `EventSource`；响应头 `X-Accel-Buffering: no` 防止 Nginx 缓冲。

## 八、已知的 dsh 版本坑

- npm `latest` 是旧的 `0.0.1-rc.1`；必须用 `next`：`0.2.1-rc.2`。所有 `@deepseek-ai/*` 必须同版本。
- 开发者预览，明确声明会有破坏性变更；升级时锁版本、跑冒烟。
- `DeepSeekHarness.resumeSession()` 在 0.2.1-rc.2 的 `.d.ts` 里没有声明（运行时存在），TS 需要断言或等官方补类型。
- 安装会拉 `node-pty` / `koffi` / `@deepseek-ai/dsh-subprocess-local` 等原生构建；
  Windows 没有 CMake/MinGW 时必须在 `pnpm-workspace.yaml` 的 `allowBuilds` 里显式关掉。
  **已实测**：用 `npm install --ignore-scripts` 安装后，`sdk` profile 的 `initialize` 能正常完成，
  说明不构建这些原生模块也能启动；但一旦启用 shell/PTY 工具就需要重新放开。
- 需要 `DEEPSEEK_API_KEY`；`sdk` profile 默认 `deepseek-official` / `deepseek-v4-flash`。
  没有 key 时 `initialize` 仍会成功，第一次对话才会报错。

## 九、外接 MCP（知识库）

dsh 自带 `@deepseek-ai/dsh-mcp-client`，但 `sdk` profile 默认不挂；本服务在启动时读取 `agent/mcp.config.json`，
生成一个只含 `mcp-client` 行的 overlay，再叠加到 dsh。

### 配置

复制 `mcp.config.example.json` 为 `mcp.config.json`（已 gitignore），按需填写：

```json
{
  "servers": [
    {
      "name": "kb",
      "transport": "streamable-http",
      "url": "http://localhost:9100/mcp",
      "headers": { "Authorization": "Bearer ${KB_MCP_TOKEN}" },
      "toolCallTimeoutMs": 60000,
      "failOnStartupError": false
    }
  ]
}
```

- `name`：工具命名空间，匹配 `[A-Za-z0-9_-]{1,32}`；模型看到的工具名是 `mcp__<name>__<tool>`。
- `transport`：`streamable-http`（`url` / `headers`）或 `stdio`（`command` / `args` / `env` / `cwd`）。
- `${ENV}` 会从 `.env` / 进程环境展开；不要把明文 token 写进 json。
- `enabled: false` 可临时停用；`failOnStartupError: false` 表示该 MCP 失败不影响整个 agent 启动。
- 修改后重启 agent 生效（mcp-client 在启动时连接并发现工具）。

### 限制

- mcp-client 的 `headers` 是「每个 server 连接一份、加载时求值」，不能按用户会话注入 token。
  知识库如果是全局服务账号，直接配；如果要按用户鉴权，必须像业务工具一样走内部桥。
- 外部 MCP 的工具会全部进入模型工具列表，注意知识库暴露的工具数量与权限范围。
- 生成后的 patch 在 `.dsh/runtime/mcp.patch.json`，展开后的 token 会落在这个文件里，`.dsh/` 要按敏感目录保护。

### 为什么“以后支持 OAuth2”不等于多用户隔离

OAuth2 解决的是「怎么拿 token」，不是「这个连接被谁复用」。是否串号取决于**授权态的作用域**：

| 形态 | 是否串号 |
|---|---|
| 单 runtime + 进程级单 OAuth 授权 | **会**，所有会话共享同一个身份 |
| 单 runtime + 每 session 独立 MCP 连接/OAuth 授权 | 不会 |
| 每用户一个 runtime + 各自 OAuth | 不会 |
| 宿主按 session 持 token 调 MCP（当前内部桥） | 不会 |

所以即使 mcp-client 以后支持 OAuth2，也要确认它是 **per-session 的凭据与连接**；否则仍然需要
「每用户 runtime」或「宿主桥」。当前内部桥已经是按 session 取 token 的，知识库 MCP 如果要按用户鉴权，
优先扩展桥（再加一个按用户 token 复用的 MCP client 池），而不是等 mcp-client 的 OAuth。

### PageAgent 能不能接？

PageAgent 是「in-page GUI agent」：一段跑在网页里的 JS，读文本化 DOM，用 LLM 决定
`click_element_by_index` / `input_text` / `select_dropdown_option` / `scroll` / `execute_javascript`。
它不是服务端浏览器，也不是 headless。官方 README 明确写了它是 client-side web enhancement，不是 server-side automation。

两条路径：

**A. 嵌入 pc + 宿主桥（适合操作本系统页面，已实现）**

- pc 安装 `@page-agent/core`，按需创建 `PageAgentCore`；通过 `/agent` 的 SSE 连到 agent 服务（见第十一章）。
- agent 暴露 `page_operate({ instruction })` → 宿主下发任务 → 浏览器执行 → 返回 `{ success, data, steps, path }`。
- 只能操作当前同源 SPA：路由、按钮、表单、弹窗；不能操作外部网站或别的标签页。
- LLM key 不要放浏览器：把 PageAgent 的 `baseURL` 指向 agent 的 `/agent/llm` 代理，由服务端注入 key。
- 安全：`customTools` 把 `execute_javascript` 设为 `null`；`maxSteps` 由服务端下发（默认 20，上限 40）；
  `transformPageContent` 脱敏手机号/邮箱/身份证/银行卡；默认不做任务级确认，执行前自动收起智能助手抽屉。

**B. Chrome 扩展 + `@page-agent/mcp`（适合操作任意网页，但仅限本地/桌面）**

- 扩展 + Hub + 本地 MCP 进程；暴露 `execute_task` / `get_status` / `stop_task` 三个工具。
- 我们的 `mcp.config.json` 已能加 stdio server（示例里已有 disabled 的 `page-agent` 条目），
  dsh 会看到 `mcp__page_agent__execute_task`。
- 但 MCP 进程必须在**用户浏览器所在的机器**上；当前 agent 是服务端进程，生产环境没法替远程用户启动它。
  只适合本地开发、Electron/Tauri 桌面端，或每用户装一个本地 companion。
- 扩展权限很大（可操作任意标签页），建议专用浏览器 profile。

**不推荐**用它做无人值守的服务端自动化；那种场景用 Playwright/Puppeteer 更合适。

结论：如果目标是「让助手操作我们自己的管理后台」，走 A；如果是「操作任意外部网站」，走 B，
但要接受每用户本地安装扩展/MCP。当前只加了 B 的示例配置（disabled），A 的 WS 桥还没实现。

## 十、图表（ECharts）

模型本身不能“画图”，它只能输出图表配置；真正的渲染在 `pc` 侧完成。当前支持两种输出形式：

### 1. `echarts` 代码块（推荐）

````markdown
```echarts
{
  "title": { "text": "月度新增用户" },
  "tooltip": { "trigger": "axis" },
  "xAxis": { "type": "category", "data": ["2026-09"] },
  "yAxis": { "type": "value", "name": "人" },
  "series": [{ "type": "bar", "data": [1] }]
}
```
````

- 标准 Markdown、对模型最稳、内容是惰性代码（不走 HTML 解析），安全性最好；
- `AgentEChartsBlock.vue` 覆盖 `code_block`，只接管 `echarts` / `chart` / 带 `series` 的 `json`，其余代码块走默认渲染（已验证 GraphQL 代码块正常）。

### 2. `<echarts>` 自定义标签（灵活，但走 HTML 面）

```html
<echarts height="320px">
{ "xAxis": { "type": "category", "data": ["A", "B"] }, "series": [{ "type": "bar", "data": [1, 2] }] }
</echarts>
```

- 需要 `custom-html-tags` + `setCustomComponents("agent", { echarts: ... })`；
- 可以带 `height` / `width` 属性，适合单独控制尺寸；
- 属于原始 HTML 解析面，模型被提示词注入后理论上可以输出其他标签；当前只注册了 `echarts` / `chart`，并且技能明确要求优先用代码块。

### 约束

- `series[].type` 只注册了 `bar` / `line` / `pie` / `funnel`（见 `pc/src/utils/echarts.ts`）；要加 `map`、`radar` 等需同时注册模块并改 `CHART_TYPES`。
- 只接受纯 JSON：不能有函数、注释、单引号、尾逗号；模型不能输出 `formatter` 函数。
- 前端会做最小校验（`series` 存在、类型受支持、单 series ≤ 2000 点、配置 ≤ 200KB），失败时展示“图表配置无效”和原始 JSON，不会白屏。
- 模型看不到渲染结果，所以技能 `chart-report` 要求它保守配置、先查数据、数据不足时退回表格。

### Mermaid（流程图 / 时序图 / ER 图）

`markstream-vue` 自带 `MermaidBlockNode`，`pc` 已安装 `mermaid@12.2.0`，模型输出 ` ```mermaid ` 代码块即可渲染。

- 默认 **strict**：`securityLevel: 'strict'` + DOMPurify，禁用 HTML label 和 Mermaid `click` 交互；LLM 输出必须保持这个默认值。
- `MarkdownRender` 上传了 `mermaid-props`：`fitPreviewHeight: true`（渲染完贴合实际高度，避免宽扁图留下大块空白）、`maxHeight: '520px'`。
- 组件自带源码/预览切换、复制源码、导出 SVG、全屏缩放与拖拽。
- 技能 `mermaid-diagram` 约束输出：`flowchart` / `sequenceDiagram` / `stateDiagram-v2` / `erDiagram` / `classDiagram`，
  节点 ≤ 20、id 用 ASCII、中文 label 用双引号、不要 HTML 标签或 `click`。
- 数据趋势/占比仍用 ECharts（`chart-report`），不要用 Mermaid 画柱状图/饼图。

## 十一、页面操作（PageAgent）

智能体可以操作用户当前浏览器里的系统页面：点按钮、填表单、选下拉、提交、开关弹窗。
用的是阿里 `page-agent`（in-page GUI Agent，不截图、不开 headless 浏览器），**只能操作当前同源 SPA**。

### 链路

```
dsh 工具 page_operate(instruction)
  → 内部桥（按 dsh sessionId 反查 usrId）
  → pageHub：给该用户的浏览器连接下发 task 帧
  → 浏览器 PageAgentCore.execute(instruction)
       ├─ 读取文本化 DOM
       ├─ 调模型：POST /agent/llm/v1/chat/completions（宿主注入 DEEPSEEK_API_KEY）
       └─ 执行 click / input / select / scroll
  → 浏览器 POST /agent/api/page-agent/tasks/:id/result
  → 工具返回 { success, data, steps, path }
```

浏览器和宿主之间用 **SSE 下发 + POST 回传**，不用 WebSocket：这样可以沿用同一套
`Authorization: Bearer` 鉴权，token 不进 query、不进 dsh 子进程。

### 对外工具

| 工具 | 作用 |
| --- | --- |
| `page_status` | 通道是否在线、当前路由、打开的标签数 |
| `page_operate` | 执行一次页面操作；参数 `instruction`、可选 `max_steps`（默认 20，上限 40） |

### 配置

```dotenv
AGENT_PAGE_OPERATE=true      # false 时两个工具直接拒绝
AGENT_PAGE_TIMEOUT_MS=180000 # 单次任务宿主等待上限
AGENT_PAGE_MAX_STEPS=20      # 默认步数
AGENT_LLM_PROXY=true         # 关闭后 /agent/llm 返回 404
DEEPSEEK_BASE_URL=https://api.deepseek.com/v1
```

前端（`pc`）可选：

```dotenv
VITE_AGENT_PAGE_CONFIRM=never  # always | risky | never，默认 never
VITE_AGENT_PAGE_MODEL=deepseek-v4-flash
```

- `never`：不弹确认，任务直接执行（默认）；
- `risky`：命中删除、提交、审批、支付等词才弹；
- `always`：每个任务执行前弹「允许执行 / 拒绝」。

任务开始前会自动收起右下角的智能助手抽屉（如果它开着），等收起动画结束再扫描页面，
所以操作过程中不会挡住要点的元素。

`page_operate` **不受** `AGENT_TOOL_READONLY` 限制，那个开关只管 GraphQL。要整体关闭用 `AGENT_PAGE_OPERATE=false`。

### 安全边界

- 模型只拿到脱敏后的页面文本：手机号、邮箱、身份证、银行卡、JWT 形字符串在 `transformPageContent` 里替换。
- 页面 agent 的系统提示约束它不打开站外链接、不注入脚本；`experimentalScriptExecutionTool` 保持关闭。
- `ask_user` 只在模型缺少关键信息时弹 Element Plus 输入框；默认不做任务级确认，
  需要时用 `VITE_AGENT_PAGE_CONFIRM=risky|always`（实现在 `pc/src/utils/pageAgentBridge.ts`）。
- 不启用视觉遮罩（`enableMask: false`）：遮罩的 `z-index: 2147483641` 会盖住确认框/页面提示。
- 多标签页时按「有焦点 → 可见 → 最近心跳」挑标签页；同一时刻只允许一个页面任务。

### 已知限制

- 每个任务是一次独立的 `execute()`，没有跨任务的页面记忆；需要连续操作时把步骤写进同一条 instruction。
- PageAgent 是**第二个 LLM 循环**，比纯工具调用慢（实测 6 步约 50 秒），也更费 token。
- 虚拟滚动表格、复杂级联选择器可能定位失败；先搜索缩小范围再操作。
- 用户中途手动点页面会打乱元素索引，建议操作期间不要干预。
- 宿主重启会断开 SSE，浏览器会在 3~30 秒内自动重连；进行中的任务按失败返回。

### 文件

- `agent/src/page-hub.ts`：连接注册、任务下发、超时与取消
- `agent/src/llm-proxy.ts`：`/agent/llm` 模型代理（固定模型、JWT 鉴权、key 不下发）
- `agent/src/index.ts`：SSE、结果回传、心跳接口
- `agent/src/bridge.ts`：`page_operate` / `page_status` 路由
- `agent/dsh/tool-plugin.mjs`：工具注册
- `pc/src/utils/pageAgentBridge.ts`：浏览器侧连接、收起抽屉、脱敏、执行
- `agent/skills/page-operation/SKILL.md`：使用规范

## 十二、长期记忆（跨会话）

dsh **没有内置记忆模块**。npm 上 `@deepseek-ai/*` 的 250 个包里没有 memory 相关包；
dsh 官方只提供了「接第三方记忆 MCP」的参考配置（Memorix / MCP Reference Memory / Engram），
三者都是 stdio + 单数据目录，作用域是整个 runtime，多用户会串号。

所以这里做成**宿主侧、按用户隔离**的记忆，复用现有内部桥，不额外起进程：

```
dsh 工具 memory_save / memory_search / memory_list / memory_forget
  → 内部桥（sessionId → usrId）
  → MemoryStore：agent/.dsh/memory.json，按 usrId 分桶
```

### 行为

- **首轮自动注入**：每个新会话的第一条消息，会把该用户最近 10 条记忆以 `<user_memory>` 块
  拼进模型输入；前端展示和转录仍是用户原文，不会看到这段前缀。
- **主动保存**：用户说“记住 / 以后都 / 我的习惯是”时模型必须调用 `memory_save`；
  稳定的偏好、身份、输出约定也会主动保存。技能 `memory-usage` 定义了边界。
- **检索**：`memory_search` 按关键词 + 标签打分，不做 embedding，零外部依赖。
- **去重**：同一句话重复保存只更新时间，不会堆两条。
- **敏感信息**：JWT、`Bearer xxx`、`password=`、`密码是` 等模式直接在工具层拒绝。
- **容量**：每用户最多 300 条，单条 500 字，超出按更新时间淘汰最旧的。

### 配置

```dotenv
AGENT_MEMORY=true              # false 时工具与自动注入都关闭
AGENT_MEMORY_DIGEST_LIMIT=10   # 首轮注入条数
```

存储文件 `agent/.dsh/memory.json`，结构：

```json
{ "users": { "<usrId>": [ { "id": "mem_...", "text": "...", "tags": ["偏好"], "updatedAt": 0 } ] } }
```

### 为什么不用现成的记忆 MCP

| 方案 | 结论 |
| --- | --- |
| `@modelcontextprotocol/server-memory` | 单 JSONL 文件、单进程；所有登录用户共享一份，会串号 |
| Memorix / Engram | 按 cwd/git 项目分域，不按登录用户；同样不适合单 runtime 多用户 |
| 每用户起一个 MCP 进程 | dsh 的 mcp-client 是启动时静态配置，不支持按会话拉起 |

如果以后确定只服务单一用户/内部部署，也可以直接在 `mcp.config.json` 里加参考记忆 MCP，
和这套宿主记忆并存（模型会看到两套工具）。

### 已知限制

- 没有向量检索：换了说法（“表格” vs “tabular”）可能搜不到，靠标签缓解。
- 记忆是“用户说了什么”，不自动从数据库事实里学习；需要沉淀业务知识时用技能或 AGENTS.md。
- 首轮注入的是最近 10 条，不是最相关的 10 条；记忆多了以后需要改成按当前问题检索。

## 十三、模型配置（官方 DeepSeek / 自定义网关）

### 优先级

| 顺序 | 条件 | 实际使用 |
| --- | --- | --- |
| 1 | `DEEPSEEK_API_KEY` 非空 | `deepseek-official` + `DSH_MODEL` |
| 2 | 上一项为空，且 `CUSTOM_LLM_API_KEY / CUSTOM_LLM_BASE_URL / CUSTOM_LLM_MODEL` 都填了 | 自定义 OpenAI 兼容网关 |
| 3 | 都没有 | **启动直接失败**，日志给出缺哪几个变量 |

注意：只要 `DEEPSEEK_API_KEY` 有值，就**不会**使用自定义配置，避免两套 key 混用。

### 自定义模型

```dotenv
CUSTOM_LLM_API_KEY=sk-xxx
CUSTOM_LLM_BASE_URL=https://dashscope.aliyuncs.com/compatible-mode/v1
CUSTOM_LLM_MODEL=qwen3-max
# 可选
CUSTOM_LLM_PROVIDER=custom       # 路由名，小写+连字符
CUSTOM_LLM_NAME=通义千问           # 仅显示用
CUSTOM_LLM_CONTEXT_WINDOW=131072
```

`BASE_URL` 要写到 `/v1`（网关的 OpenAI 兼容根路径），不要带 `/chat/completions`。

实现方式是给 dsh 的 `llm-pi-ai` 插件加一条 **hand-declared gateway**：

```json
[
  {
    "id": "llm-pi-ai",
    "config": {
      "providers": {
        "custom": {
          "api": "openai-completions",
          "baseURL": "https://.../v1",
          "apiKeyEnv": "CUSTOM_LLM_API_KEY",
          "models": [{ "id": "qwen3-max", "contextWindow": 131072 }]
        }
      }
    }
  }
]
```

这段 overlay 在启动时写到 `.dsh/runtime/llm.patch.json`，与 `dsh/patch.yml` 一起叠加；
官方 DeepSeek 模式不会生成这个文件。

### 对页面操作的影响

浏览器里的 PageAgent 通过 `/agent/llm` 代理调模型，代理也走同一套优先级；
切到自定义网关后，页面操作的内层模型也会自动使用它（不再依赖 `DEEPSEEK_API_KEY`）。

### 要求

- 自定义网关必须支持 **OpenAI Chat Completions + tool calling**（智能体依赖工具调用）。
- 模型名必须和网关上的 id 一致；`CUSTOM_LLM_CONTEXT_WINDOW` 只影响上下文预算，不会探测真实值。
- `CUSTOM_LLM_API_KEY` 只通过 launch env 传给 dsh，不写进配置文件。

### 排查

- 启动日志 `model route` 会打印 `kind / provider / model / base`。
- `GET /agent/api/health` 返回当前 `provider` 与 `model`，可以用于部署自检。
- 报 `MISSING_CREDENTIAL`：`CUSTOM_LLM_API_KEY` 没传进 dsh 进程，检查 `.env` 是否被加载。

## 十四、构建与部署

### 本地构建

```bash
cd agent
pnpm build-prod
```

产出 `agent/dist/`，是**自包含**的部署包：

```
dist/
  index.js 等编译产物（源码里的 .ts 相对导入已被重写成 .js）
  dsh/            patch.yml + tool-plugin.mjs
  skills/         技能目录
  workspace/      dsh 工作目录（沙箱根）
  deploy/         nginx 配置示例
  mcp.config.example.json
  .env.example
  package.json    只含生产依赖，start 脚本是 node index.js
```

`rootDir` 的判定：源码在 `src/` 时取上一级；其余情况（构建产物）取自身目录。
所以 `dist` 的内容就是服务器上的应用根，直接上传即可。

### 服务器部署

```bash
# 1. 上传 dist 里的内容到 /opt/nest-agent（保留 .env / .dsh / mcp.config.json 时只覆盖代码）
# 2. 安装依赖
cd /opt/nest-agent
npm install --omit=dev --ignore-scripts

# 3. 配置
cp .env.example .env
vi .env

# 4. 启动
node index.js          # 或 npm start
# 可选：AGENT_HOME=/opt/nest-agent node index.js
```

必须改的环境变量：

```dotenv
AGENT_HOST=127.0.0.1
AGENT_PORT=4002
AGENT_PUBLIC_ORIGIN=https://your.domain   # 前端实际访问的源，用于 Origin 校验
DEEPSEEK_API_KEY=sk-...
APP_MCP_URL=http://127.0.0.1:4001/mcp
APP_GRAPHQL_URL=http://127.0.0.1:4001/graphql
```

- `AGENT_HOME` 要作为**系统环境变量**传入（systemd 的 `Environment=`），放在 `.env` 里无效：
  它决定 `.env` 从哪读。
- `.dsh/`（会话、转录、记忆）和 `workspace/` 必须可写。
- 需要外接 MCP 时，`cp mcp.config.example.json mcp.config.json` 再改。

### systemd

```ini
[Unit]
Description=Nest Agent
After=network.target

[Service]
Type=simple
WorkingDirectory=/opt/nest-agent
Environment=NODE_ENV=production
Environment=AGENT_HOME=/opt/nest-agent
ExecStart=/usr/bin/node index.js
Restart=always
RestartSec=3
# 只允许自己写 .dsh / workspace
ReadWritePaths=/opt/nest-agent/.dsh /opt/nest-agent/workspace

[Install]
WantedBy=multi-user.target
```

### Nginx

见 `deploy/nginx.conf.example`。核心是 `/agent/` 反代到 `127.0.0.1:4002`，并且：

```nginx
proxy_buffering off;
proxy_cache off;
proxy_read_timeout 3600s;
```

否则聊天和页面操作的 SSE 不会实时推送。

### 升级

```bash
systemctl stop nest-agent
# 覆盖 dist 内容，但保留 .env / .dsh / mcp.config.json
npm install --omit=dev --ignore-scripts
systemctl start nest-agent
```

### 注意

- `--ignore-scripts` 是故意的：dsh 依赖 `koffi` / `node-pty` 等原生模块，服务器没有 CMake/MinGW 时
  安装脚本会失败；本服务不用 shell/PTY，忽略脚本后实测可启动。
- 不要只上传 `index.js`：`dsh/patch.yml` 用相对路径引用 `tool-plugin.mjs`，技能目录按
  `process.cwd()` 的上一级解析，`skills/`、`workspace/` 必须跟代码在一起。
- 构建产物已实测：用 `node dist/index.js` 起服务，真实模型对话 + `memory_list` 工具调用正常。

## 十五、里程碑

1. 目录 + workspace + 依赖安装，dsh `--dump-config` 通过。
2. 单 runtime + 内部桥，`session_me` 工具打通（不带模型，直接调桥）。
3. 一次真实对话（DeepSeek 模型 + 只读 `schema_search`）。
4. 前端 `/agent` 代理 + 聊天面板 + tool 卡片。
5. 只读校验、审计、配额、多轮 resume。
6. 生产反代与部署。
