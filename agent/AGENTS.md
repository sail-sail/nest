# 业务智能体服务

- `graphql_execute` 默认只读，写操作必须走白名单；Rust MCP schema 变更后同步工具插件
- 技能约定见 `SKILLS.md`；涉及图表、页面操作、记忆或代码执行时加载对应技能
- 流式响应用 POST + `fetch`；浏览器请求通过 `/agent/llm` 代理，禁止注入密钥
- 记忆和 `exec_node` 必须按用户隔离；沙箱按用户和会话鉴权，不得仅依赖 cwd
- 附件优先用 `attachmentId`