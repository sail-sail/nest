---
name: code-exec
description: 在沙箱里写一段 Node 代码处理数据或大文件；会话目录可持久化，只把结论带回对话
whenToUse: 需要精确计算、解析/聚合大文件、批量清洗或转换、生成图表数据时（读接口数据用 graphql_execute，不要用本技能绕路）
---

# 代码执行沙箱

`exec_node` 给你一个受限制的 Node 环境。适合"要算准"和"数据量大到不能进上下文"的活。

## 什么时候用

- 精确计算：汇率、分摊、同比环比、加权平均、分位数。
- 解析附件或落盘文件：CSV / JSONL / 日志，几万行以上。
- 批量清洗：去重、正则替换、字段映射、格式转换。
- 为图表准备数据（`chart-report` 的 ` ```echarts ` JSON 可以直接由脚本生成）。
- 验证一段逻辑：与其在脑子里推，不如跑一遍。

## 什么时候不用

- 查业务数据 → `graphql_execute`。不要用脚本拼 SQL 绕路。
- 操作页面 → `page_operate`。
- 一两步心算能出结果的加减乘除 → 直接答，别为 3+5 开一次沙箱。
- 需要第三方库（pandas 类、csv-parse、lodash）→ 沙箱里**没有**，只能手写或用 Node 内置。

## 边界

| 能力 | 状态 |
|---|---|
| 读写会话目录（cwd） | ✅ 相对路径直接用 |
| 跨调用保留文件 | ✅ 同一会话的文件一直在 |
| 访问网络（fetch / net） | ✅ 放行 |
| 读会话目录以外的文件 | ❌ `ERR_ACCESS_DENIED` |
| `child_process` / `worker_threads` / 原生 addon | ❌ 拒绝 |
| `import` 第三方包 | ❌ 只能 `node:*` 内置模块 |

`ERR_ACCESS_DENIED` 不是权限 bug，是你在读写会话目录外面。改成相对路径即可，不要反复重试。

## 输出纪律

**这是最容易踩的坑：stdout 会进对话上下文并被裁剪。**

- 只打印结论：合计、行数、Top N、前 3 行样本。
- 中间结果写文件，不要 `console.log(JSON.stringify(全部数据))`。
- 需要看结构时：`console.log(JSON.stringify(obj).slice(0, 500))`，或只打印 `Object.keys`。
- 一次调用只做一件事，失败时错误信息会原样返回，据此改代码再来一次。

## 范式

### 大 CSV 按行聚合（不把文件读进内存）

```js
import { createReadStream } from "node:fs";
import { createInterface } from "node:readline";

const rl = createInterface({
  input: createReadStream("orders.csv"),
  crlfDelay: Infinity,
});

let header = null;
let rows = 0;
const total = new Map();

for await (const line of rl) {
  if (!header) {
    header = line.split(",");
    continue;
  }
  // 字段里有逗号或引号时，简单 split 会错位；先用 head -3 确认格式
  const cells = line.split(",");
  rows += 1;
  const region = cells[2];
  const amount = Number(cells[5]) || 0;
  total.set(region, (total.get(region) ?? 0) + amount);
}

console.log("rows:", rows);
console.log([...total].sort((a, b) => b[1] - a[1]).slice(0, 10));
```

### 把结果落盘，只回摘要

```js
import { writeFileSync, statSync } from "node:fs";

const result = { /* 很大的聚合结果 */ };
writeFileSync("summary.json", JSON.stringify(result));
console.log("wrote summary.json", statSync("summary.json").size, "bytes");
```

下一轮再写一段代码读 `summary.json` 取需要的切片，对话里始终只有摘要。

### 长任务

默认超时 15 秒。批量处理几万行以上时显式调大：

```json
{ "code": "...", "timeoutMs": 60000 }
```

上限 120 秒。真跑不完就分片：用文件名或行号区间做参数，一次跑一段。

### 生成图表数据

```js
// 按 chart-report 的约定直接产出 echarts option，再用 ```echarts 代码块回给用户
console.log(JSON.stringify({ xAxis: { type: "category", data: months }, series: [...] }));
```

## 安全

- 不要把凭据、token、密码写进代码——代码会进转录留档。
- 不要试图读会话目录之外的文件（`.env`、`../`），会被拒绝，也没有正当业务理由。
- 沙箱里的代码代表当前登录用户的身份执行，产出物要符合该用户的权限范围。
