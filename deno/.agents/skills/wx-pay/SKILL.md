---
name: wx-pay
description: 微信支付流程开发. 需要实现支付功能时使用
---

# 微信支付流程

## 概述

```
统一下单 → 前端调起支付 → 微信回调 → 业务处理
```

## 系统自带（无需开发）

| 模块 | 说明 |
|------|------|
| `wx_wx_pay` | 微信支付配置表 |
| `wx_pay_transactions_jsapi` | 统一下单记录表 |
| `wx_wx_pay_notice` | 支付通知记录表 |
| `transactions_jsapi()` | 统一下单函数 |
| `tradeStatePayTransactionsJsapi` | 查询支付状态接口 |

## 开发步骤

### Step 1: 后端 - 统一下单接口

> 参考 Skill: `deno-graphql-backend` 创建完整的 graphql → resolver → service 三层接口

在业务模块的 `{table}.service.ts` 中调用 `transactions_jsapi`:

```typescript
import {
  transactions_jsapi,
} from "/src/wx/pay_transactions_jsapi/pay_transactions_jsapi.dao.ts";

import type {
  RequestPaymentOptions,
} from "/gen/types.ts";

export async function payXxx(
  appid: string,
): Promise<RequestPaymentOptions> {

  // 1. 业务校验 & 创建待支付记录
  const record_id = await createXxxRecord(...);

  // 2. 构造 attach2（回调时用于识别业务）
  const attach2 = JSON.stringify({
    action: "pay_xxx",           // 业务标识
    payload: {
      record_id,                 // 回调时需要的数据
    },
  });

  // 3. 调用统一下单
  const requestPaymentOptions = await transactions_jsapi(
    appid,
    {
      description: "订单支付",   // 支付描述
      amount: {
        total: 1,                // 订单总金额, 单位为分
      },
    },
    {
      attach2,
    },
  );

  return requestPaymentOptions;
}
```

### Step 2: 后端 - 支付回调处理

**2.1** 在 `src/wx/wx_pay_notice/wx_pay_notice.service.ts` 的 `pay_notice` 函数末尾添加 `if (action ===` 分支:

```typescript
// 在 pay_notice 函数末尾的 if (action === "..." 区域添加
} else if (action === "pay_xxx") {
  const payload = attach2Obj.payload;
  const record_id = payload.record_id as XxxRecordId;

  const {
    payXxxCallback,
  } = await import("/src/{mod}/{table}/{table}.service.ts");

  await payXxxCallback(
    record_id,
    amt,
    success_time,
    transaction_id,
  );
}
```

**2.2** 在业务模块 `src/{mod}/{table}/{table}.service.ts` 实现回调处理:

```typescript
import {
  updateByIdXxx,
} from "/gen/{mod}/{table}/{table}.dao.ts";

import type {
  XxxRecordId,
} from "/gen/types.ts";

import {
  Decimal,
} from "decimal.js";

/**
 * 支付成功回调处理
 */
export async function payXxxCallback(
  record_id: XxxRecordId,
  amt: Decimal,
  success_time: string | undefined,
  transaction_id: string,
) {
  // 更新业务记录状态
  await updateByIdXxx(
    record_id,
    {
      pay_status: "paid",
      pay_amount: amt,
      pay_time: success_time,
      transaction_id,
    },
  );

  // 其他业务逻辑...
}
```

### Step 3: 前端 - 调用支付

在业务模块的 `Api2.ts` 中添加支付接口:

```typescript
import type {
  Mutation,
  RequestPaymentOptions,
} from "#/types.ts";

/** 发起支付 */
export async function payXxx(
  opt?: GqlOpt,
): Promise<RequestPaymentOptions> {

  const res: {
    payXxx: Mutation["payXxx"],
  } = await mutation({
    query: `
      mutation {
        payXxx {
          out_trade_no
          timeStamp
          nonceStr
          package
          signType
          paySign
        }
      }
    `,
  }, opt);

  const data = res.payXxx;

  return data;
}
```

在页面中调用支付:

```typescript
import {
  PayTransactionsJsapiTradeState,
} from "#/types";

import {
  tradeStatePayTransactionsJsapi,
} from "../pay_transactions_jsapi/Api";

async function onPay() {
  // 1. 获取支付方式
  const providerRes = await uni.getProvider({ service: "payment" });
  const provider = providerRes.provider[0] as 'wxpay';

  if (!provider) {
    uni.showToast({
      title: "没有可用的支付方式",
      icon: "error",
    });
    return;
  }

  // 2. 调用统一下单
  const requestPaymentOptions = await payXxx();

  // 3. 调起微信支付
  let errMsg = "";
  try {
    const res = await uni.requestPayment({
      provider,
      orderInfo: "",
      ...requestPaymentOptions,
    });
    errMsg = res.errMsg;
  } catch (err) {
    errMsg = (err as { errMsg: string }).errMsg;
  }

  // 4. 处理支付结果
  if (errMsg === "requestPayment:fail cancel") {
    uni.showToast({
      title: "支付取消",
      icon: "error",
    });
    return;
  }

  if (errMsg !== "requestPayment:ok") {
    uni.showToast({
      title: "支付失败",
      icon: "error",
    });
    return;
  }

  // 5. 查询支付状态（等待回调处理完成，最多轮询30次）
  const maxRetries = 30;
  let trade_state: PayTransactionsJsapiTradeState | undefined;
  let trade_state_desc = "";

  for (let i = 0; i < maxRetries; i++) {
    const result = await tradeStatePayTransactionsJsapi(
      requestPaymentOptions.out_trade_no,
    );
    trade_state = result.trade_state;
    trade_state_desc = result.trade_state_desc;

    if (trade_state === PayTransactionsJsapiTradeState.Success) {
      break;
    }

    if (i < maxRetries - 1) {
      await new Promise(
        resolve => setTimeout(resolve, 200),
      );
    }
  }

  // 检查最终支付状态
  if (trade_state !== PayTransactionsJsapiTradeState.Success) {
    uni.showToast({
      title: "未查询到支付结果，请稍后再刷新",
      icon: "none",
      duration: 3000,
    });
    return;
  }

  await uni.showModal({
    content: "支付成功!",
    showCancel: false,
  });

  // 6. 支付成功的后续处理, 比如:刷新页面数据
  // ...
}
```

## attach2 结构

```json
{
  "action": "业务标识",
  "payload": {
    "record_id": "回调时需要的业务ID"
  }
}
```

## 文件清单

| 端 | 文件 | 开发内容 |
|----|------|----------|
| Deno | `src/{mod}/{table}/{table}.service.ts` | 统一下单函数 |
| Deno | `src/{mod}/{table}/{table}.service.ts` | 回调处理函数 |
| Deno | `src/wx/wx_pay_notice/wx_pay_notice.service.ts` | 添加 `if (action ===` 分支 |
| Uni | `src/pages/{table}/Api2.ts` | 支付接口函数 |
| Uni | `src/pages/{table}/*.vue` | 支付调用逻辑 |
