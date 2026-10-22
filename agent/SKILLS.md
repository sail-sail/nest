# 技能（Skills）

agent 的技能由 dsh 自带的三件套提供：`skill`（注册表）+ `skill-filesystem`（目录扫描）+ `tool-skill`（模型侧目录与加载工具）。
扫描目录在 `dsh/patch.yml` 的 `customSkillDirs` 中配置，当前指向 `agent/skills`。

## 目录约定

- 一个技能是 `skills/<name>/SKILL.md`，或顶层的 `skills/<name>.md`；
- **不会**递归扫描子目录，不要写成 `skills/a/b/SKILL.md`；
- 必须有 YAML frontmatter 的 `name`、`description`；可选 `whenToUse`、`metadata`、
  `user-invocable`、`disable-model-invocation`；
- 新增、改名、删除会被文件监听捕获，下一轮对话即可见，不需要重启 agent。

## 当前扫描范围

`dsh/patch.yml` 里设了 `includeDefaultRoots: false`，只扫描 `agent/skills`，不继承机器上的用户级技能和 dsh 内置技能。
需要 dsh 自带的 office 技能时，把 `includeDefaultRoots` 改回 `true`，或把技能目录复制进 `agent/skills`。

Windows 上模型目录里还会看到一个 `diagnose-windows-sandbox-acl`，它由 dsh 的 Windows 沙箱插件自带，
和本目录无关；只有加载时才会把正文放进上下文，平时只占一条目录摘要。

## 模型怎么用

1. 首轮请求前，模型会收到一份技能目录（name + description）；
2. 模型用 `skill` 工具按名字加载完整指令，再按指令执行；
3. 用户也可以直接输入 `/技能名` 触发，不需要模型先加载。

## 示例

```markdown
---
name: sales-report
description: 按客户/月份汇总销售订单，输出同比环比
whenToUse: 用户询问销售报表、业绩汇总、同比环比时
---

## 步骤

1. 用 schema_search 找到销售订单的 Query 与字段；
2. 用 graphql_execute 按月份聚合；
3. 输出表格 + 结论，金额保留两位小数。
```

业务查询的完整示例见 `skills/business-query/SKILL.md`；图表输出规范见 `skills/chart-report/SKILL.md`；
流程图/时序图/ER 图见 `skills/mermaid-diagram/SKILL.md`；页面操作见 `skills/page-operation/SKILL.md`；
长期记忆的保存/检索规范见 `skills/memory-usage/SKILL.md`。
