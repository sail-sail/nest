---
name: uni-graphql-frontend
description: uni 前端自定义 GraphQL API 接口。需要在 uni 页面调用后端自定义接口时使用
compatibility: Uni-app + TypeScript
metadata:
  version: "1.0"
---

# uni 前端自定义 API 接口开发

## 文件结构

```text
src/pages/{table}/
├── Api.ts      # 自动生成, 不放手写自定义接口
└── Api2.ts     # 手写自定义 GraphQL 接口
```

## 手写接口约定

- `Api.ts` 为生成文件, 尽量不改
- 自定义 GraphQL 接口统一写到 `src/pages/{table}/Api2.ts`
- 页面里如果需要调用手写接口, 从当前目录的 `./Api2.ts` 导入, 避免和生成代码混改
- `query()`、`mutation()`、`request()`、`GqlOpt` 由自动导入提供, 一般不需要手动 `import`

## 核心规则

| 场景 | 调用方式 | 说明 |
|------|----------|------|
| GraphQL 查询 | `query()` | 不要改成 `request({ reqType: "graphql" })`, 也不要自己写 `uni.request` 打 `/graphql` |
| GraphQL 变更 | `mutation()` | 会自动补 `Request-ID`, 用于后端幂等和重复提交保护, 不要在业务代码里重复拼同类 header |
| 非 GraphQL 普通接口 | `request()` | 默认优先走这个封装 |
| 下载原始 html、附件、第三方地址 | `request()` 或 `uni.request` | 只有响应不是标准 GraphQL 结构时, 才直接用 `uni.request` |

- 禁止在 `Api2.ts` 里包一层 `try/catch`; 当前封装已经统一处理 loading、toast、鉴权失效、token 刷新、`TenantId` 和响应头里的 `authorization`
- `query()` 会在同一轮 microtask 里自动合并/去重 GraphQL 查询; 多个彼此独立的查询先一起发起, 再 `await Promise.all(...)`, 不要串行一个个等

## Query 模板

```ts
import type {
  Query,
} from "#/types.ts";

/** 接口描述 */
export async function getCurrentUsrCard(
  opt?: GqlOpt,
) {
  const res: {
    getCurrentUsrCard: Query["getCurrentUsrCard"];
  } = await query({
    query: /* GraphQL */ `
      query {
        getCurrentUsrCard {
          id
          lbl
        }
      }
    `,
  }, opt);

  return res.getCurrentUsrCard;
}
```

## Mutation 模板

```ts
import type {
  Mutation,
  CardRechargeInput,
} from "#/types.ts";

/** 接口描述 */
export async function payCardRecharge(
  input: CardRechargeInput,
  opt?: GqlOpt,
) {
  const res: {
    payCardRecharge: Mutation["payCardRecharge"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($input: CardRechargeInput!) {
        payCardRecharge(input: $input) {
          timeStamp
          nonceStr
          package
          signType
          paySign
        }
      }
    `,
    variables: {
      input,
    },
  }, opt);

  return res.payCardRecharge;
}
```

## 返回值与类型

- 返回值类型优先写成 `Query["xxx"]` 或 `Mutation["xxx"]`
- 标准生成模型通常已经是全局类型, 自定义输入和自定义返回字段优先从 `#/types.ts` 导入
- 函数名保持驼峰, GraphQL 参数名保持后端的蛇形命名

## 什么时候不用 GraphQL 封装

- 下载富文本 html 正文
- 拉取 OSS 或临时文件原始内容
- 访问第三方地址或微信原生能力返回的数据

这类场景通常不是 GraphQL 响应结构, 应改用 `request()` 或 `uni.request`, 不要硬塞进 `query()` / `mutation()`。