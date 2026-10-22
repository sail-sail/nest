\---  
name: chart-report  
description: 把业务数据画成 ECharts 图表：先查数据，再输出一个 \`\`\`echarts 代码块（纯 JSON），支持柱状图/折线图/饼图/漏斗图  
whenToUse: 用户要求画图、看趋势、做对比、看占比、可视化数据时  
\---

# 图表输出规范

## 输出格式

图表必须放在一个 `echarts` 代码块里，内容是**纯 JSON 对象**，不是 JS：

````markdown
```echarts
{
  "title": { "text": "2026 年月度新增用户" },
  "tooltip": { "trigger": "axis" },
  "grid": { "left": 48, "right": 24, "top": 56, "bottom": 40 },
  "xAxis": { "type": "category", "data": ["2026-01", "2026-02"] },
  "yAxis": { "type": "value", "name": "人" },
  "series": [{ "type": "bar", "name": "新增用户", "data": [12, 18] }]
}
```
````

图表后面用一句话给结论，例如「2 月新增 18 人，环比上升 50%」。

## 规则

1. **先查数据再画图**：用 `schema_search` / `schema_get` / `graphql_execute` 拿到真实数据，不要编造数据点。
2. `series[].type` 只支持 `bar`、`line`、`pie`、`funnel`；不要用 `map`、`graph`、`custom`、`sunburst` 等需要额外模块的类型。
3. JSON 里不能有函数、注释、单引号、尾逗号；不能用 `formatter` 函数、`rich` 富文本、`dataset`。
4. `series` 不超过 5 个，单 series 数据点不超过 200 个；超过先按月/按类聚合。
5. 轴名称带单位（人、元、万元、%）；金额超过 1 万时用「万元」并在标题里说明。
6. 饼图数据不超过 8 项，超过时合并成「其他」。
7. 数据为空、维度太多、或用户只是要明细时，**不要画图**，改用表格。
8. 不要在图表前后重复贴同一份 JSON；图表代码块本身就是输出。

## 常用模板

### 柱状图 / 折线图

```echarts
{
  "tooltip": { "trigger": "axis" },
  "legend": { "top": 0 },
  "grid": { "left": 48, "right": 24, "top": 48, "bottom": 40 },
  "xAxis": { "type": "category", "data": ["A", "B", "C"] },
  "yAxis": { "type": "value", "name": "数量" },
  "series": [
    { "type": "bar", "name": "本期", "data": [10, 20, 30] },
    { "type": "line", "name": "上期", "data": [8, 18, 25] }
  ]
}
```

### 饼图

```echarts
{
  "tooltip": { "trigger": "item" },
  "legend": { "bottom": 0 },
  "series": [{
    "type": "pie",
    "radius": ["40%", "68%"],
    "data": [
      { "value": 1048, "name": "搜索引擎" },
      { "value": 735, "name": "直接访问" },
      { "value": 580, "name": "邮件营销" }
    ]
  }]
}
```

## 注意

- 图表是给用户看的，不是给你自己校验的；你无法看到渲染结果，所以配置要保守、简单。
- 如果 JSON 解析失败，前端会显示「图表配置无效」并回退展示原始 JSON，用户会看到错误。
- 不要输出 `<echarts>` HTML 标签，统一用 \`\`\`echarts 代码块。
