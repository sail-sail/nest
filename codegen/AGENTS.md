# Nest - 全栈代码生成系统

# 工作区 [AGENTS.md](../AGENTS.md)

## 工作空间结构

| 模块 | 说明 | 指令文件 |
|------|------|---------|
| `rust/` | GraphQL API 后端 | [指令](../../rust/.github/copilot-instructions.md) |
| `pc/` | Vue 3 管理界面 | [指令](../../pc/.github/copilot-instructions.md) |
| `uni/` | Uni-app 移动端 | [指令](../../uni/.github/copilot-instructions.md) |
| `codegen/` | 代码生成引擎 | [指令](../../codegen/.github/copilot-instructions.md) |

⚠️ `codegen/__out__` 目录为代码生成输出目录，禁止修改

## 全局配置

- **MCP 配置**：`/.utcp_config.json`
- **代码生成**：所有 CRUD 通过 `codegen/` 生成，禁止手写

## mcp 相关规范
- 尽量使用 utcp 查询工具

## UTCP Code-Mode 规则

⚠️ **命名空间直接访问**：工具通过命名空间暴露，**禁止使用 `manual.` 前缀,`manual.tool` 只是语法占位符,运行时不存在 manual 对象**

```typescript
// ❌ 错误
await manual.chrome_devtools_mcp.tool()

// ✅ 正确  
await chrome_devtools_mcp.chrome_devtools_tool()
```