# Nest - 全栈代码生成系统

# 工作区 [AGENTS.md](../AGENTS.md)

## 工作空间结构

| 模块 | 说明 | 指令文件 |
|------|------|---------|
| `rust/` | GraphQL API 后端 | [指令](../../rust/.github/copilot-instructions.md) |
| `pc/` | Vue 3 管理界面 | [指令](../../pc/.github/copilot-instructions.md) |
| `uni/` | Uni-app 移动端 | [指令](../../uni/.github/copilot-instructions.md) |
| `codegen/` | 代码生成引擎 | [指令](../../codegen/.github/copilot-instructions.md) |
| `codegen/src/tables/` | 数据库表定义和配置 |  |
| `codegen/src/tables/{mod}/{mod}.sql` | 此模块的建表语句, `base`为系统基础模块, `wx`为微信模块(若有) |  |
| `codegen/src/tables/{mod}/{mod}.ts` | 表的相关配置,外键等 |  |
| `codegen/src/tables/{mod}/{mod}_{table}.sql.csv` | 表的初始数据 |  |

⚠️ `codegen/__out__` 目录为代码生成输出目录，禁止修改

## 可用 Skills (.github/skills/)

- `create-module` - 创建新的业务模块。当需要添加新模块如 ec、crm 时使用
- `create-table` - 数据库建表规范。创建新表时必须遵循
- `dict` - 系统字典和业务字典配置。建表需要枚举字段或给表添加枚举类字段时使用
- `table-config` - 表字段配置规范。建表后配置 src/tables/{mod}/{mod}.ts 文件时使用

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