# Nest - 全栈代码生成系统

# 工作区 [AGENTS.md](../AGENTS.md)

## 工作空间结构

| 模块 | 说明 |
|------|------|
| `deno/` | GraphQL API 后端 |
| `pc/` | Vue 3 管理界面 |
| `uni/` | Uni-app 移动端 |
| `codegen/` | 代码生成引擎 (原理是生成代码覆盖到 `codegen/__out__` 目录, 然后再 `git diff` `git patch` 到工程目录) |
| `codegen/src/tables/` | 数据库表定义和配置 |
| `codegen/src/tables/{mod}/{mod}.sql` | 此模块的建表语句, `base`为系统基础模块, `wx`为微信模块(若有) |
| `codegen/src/tables/{mod}/{mod}.ts` | 表的相关配置,外键等 |
| `codegen/src/tables/{mod}/{mod}_{table}.sql.csv` | 表的初始数据 |

⚠️ `codegen/__out__` 目录为代码生成输出目录，禁止修改；日常无需读取；仅在 codegen 合并冲突时允许作为 diff 对照查看

## 代码格式规范
- 无论是前端还是后端, 函数调用, 定义的参数和前端标签属性都尽量拆行, 例:

```ts
pay_order(booking_order_id, amt, success_time);
```

应改为:

```ts
pay_order(
  booking_order_id,
  amt,
  success_time
);
```

## mcp 相关规范
- 可用 utcp 查询工具

## UTCP Code-Mode 规则

⚠️ **命名空间直接访问**：工具通过命名空间暴露，**禁止使用 `manual.` 前缀,`manual.tool` 只是语法占位符,运行时不存在 manual 对象**

```ts
// ❌ 错误
await manual.chrome_devtools_mcp.tool()

// ✅ 正确  
await chrome_devtools_mcp.chrome_devtools_tool()
```
