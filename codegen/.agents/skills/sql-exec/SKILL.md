---
name: sql-exec
description: 需要执行sql、验证写入结果、核对联表数据时使用
---

# SQL 验证工具

当需要让 AI 直接查库做闭环验证时，使用 `codegen` 里的 SQL 工具。

## 用途

- 写完代码后，查数据是否写入成功
- 校验字段值、关联关系、联表结果是否符合预期
- 排查后端接口、前端联调、初始化数据导入后的数据库状态

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

- 该工具只允许执行单条 SQL，禁止多语句
- AI 在执行任何 SQL 前，必须先向人工明确确认
- 只有获得人工确认后，才能追加 `--confirm` 执行
- 对 `insert/update/delete/alter/drop/truncate` 等变更语句，AI 必须先贴出将要执行的 SQL，再等待人工确认，确认后才能执行
