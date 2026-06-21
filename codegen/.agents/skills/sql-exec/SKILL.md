---
name: sql-exec
description: SQL执行查验工具，适用于闭环验证代码或数据变更后的数据库数据
---

# SQL 查验工具

## 命令

在 `codegen/` 目录执行：

```bash
npm run sql -- --confirm "SELECT * FROM base_usr LIMIT 3"
```

如果当前不在 `codegen/` 目录，可先切过去再执行：

```bash
cd ../codegen
npm run sql -- --confirm "SELECT * FROM base_usr LIMIT 3"
```

也支持文件方式：

```bash
npm run sql -- --confirm --file ./tmp/check.sql
```

## 返回结果

- 返回单行精简 JSON，适合 AI 继续读取和分析
- 默认最多返回 20 行预览
- 如需更多结果，使用 `--limit 100`

## 强制规则

1. 只允许执行单条 SQL，禁止多语句。
2. 执行任何 SQL 前，必须先向人工贴出完整 SQL 并明确请求确认。
3. 只有获得人工确认后，才能追加 `--confirm` 执行。

### 确认规则分级

| SQL 类型 | 要求 |
|----------|------|
| `SELECT` 查询 | 必须贴出完整 SQL，获得人工确认后才可执行 |
| `INSERT/UPDATE/DELETE/ALTER/DROP/TRUNCATE` 变更语句 | 必须贴出完整 SQL + 说明预期影响范围，获得人工确认后才可执行 |
