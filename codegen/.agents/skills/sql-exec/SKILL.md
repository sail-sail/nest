---
name: sql-exec
description: 仅在代码已写完、需要查库验证数据写入结果时使用。不要用于探索数据库结构或代替阅读代码
---

# SQL 验证工具

**用途限定**：该工具仅用于**闭环验证**——代码/数据变更已完成后，查库确认结果符合预期。禁止用于以下场景：
- 探索数据库结构、了解有哪些表/字段
- 代替阅读代码或配置文件来理解业务逻辑
- 在项目初期做数据调研

## 适用时机

- 写完代码后，验证数据是否写入成功
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

### 确认规则分级

| SQL 类型 | 要求 |
|----------|------|
| `SELECT` 查询 | 必须贴出完整 SQL，获得人工确认后才可执行 |
| `INSERT/UPDATE/DELETE/ALTER/DROP/TRUNCATE` 变更语句 | 必须贴出完整 SQL + 说明预期影响范围，获得人工确认后才可执行 |
