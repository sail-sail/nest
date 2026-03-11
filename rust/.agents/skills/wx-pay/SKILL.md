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

> 参考 Skill: `graphql-api` 创建完整的 graphql → resolver → service 三层接口

在业务模块的 `*_service.rs` 中调用 `transactions_jsapi`:

```rust
use crate::wx::pay_transactions_jsapi::pay_transactions_jsapi_model::{
  TransactionsJsapiInput,
  RequestPaymentOptions,
};
use crate::wx::pay_transactions_jsapi::pay_transactions_jsapi_dao::transactions_jsapi;

pub async fn pay_xxx(
  options: Option<Options>,
) -> Result<RequestPaymentOptions> {
  
  // 1. 业务校验 & 创建待支付记录
  let record_id = create_xxx_record(...).await?;
  
  // 2. 构造 attach2（回调时用于识别业务）
  let attach2 = serde_json::json!({
    "action": "pay_xxx",           // 业务标识
    "payload": {
      "record_id": record_id,      // 回调时需要的数据
    },
  }).to_string();
  
  // 3. 调用统一下单
  let request_payment_options = transactions_jsapi(
    TransactionsJsapiInput {
      description: "订单支付".to_string(),  // 支付描述
      amount,                                // Decimal 金额(元)
      attach2,
      ..Default::default()
    },
    options,
  ).await?;
  
  Ok(request_payment_options)
}
```

### Step 2: 后端 - 支付回调处理

**2.1** 在 `app/wx/wx_pay_notice/wx_pay_notice_service.rs` 的 `wx_pay_notify` 函数末尾添加 `if action ==` 分支:

```rust
// 在 wx_pay_notify 函数末尾的 if action == "..." 区域添加
} else if action == "pay_xxx" {
  let payload = &attach2_obj["payload"];
  let record_id = payload.get("record_id")
    .and_then(|v| v.as_str())
    .ok_or_else(|| eyre!("record_id not found"))?;
  let record_id = XxxRecordId::from(record_id);
  
  use crate::{mod}::{table}_service::pay_xxx_callback;
  pay_xxx_callback(
    record_id,
    amt,
    success_time,
    transaction_id,
    options,
  ).await?;
}
```

**2.2** 在业务模块 `app/{mod}/{table}_service.rs` 实现回调处理:

```rust
/// 支付成功回调处理
pub async fn pay_xxx_callback(
  record_id: XxxRecordId,
  amt: Decimal,
  pay_time: NaiveDateTime,
  transaction_id: SmolStr,
  options: Option<Options>,
) -> Result<()> {
  // 更新业务记录状态
  update_by_id_xxx(
    record_id,
    XxxInput {
      pay_status: Some(PayStatus::Paid),
      pay_amount: Some(amt),
      pay_time: Some(pay_time),
      transaction_id: Some(transaction_id),
      ..Default::default()
    },
    options,
  ).await?;
  
  // 其他业务逻辑...
  Ok(())
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
  const maxRetries = 30; // 最多轮询30次
  let trade_state: PayTransactionsJsapiTradeState | undefined;
  let trade_state_desc = "";
  
  for (let i = 0; i < maxRetries; i++) {
    const result = await tradeStatePayTransactionsJsapi(
      requestPaymentOptions.out_trade_no,
    );
    trade_state = result.trade_state;
    trade_state_desc = result.trade_state_desc;
    
    if (trade_state === PayTransactionsJsapiTradeState.Success) {
      // 支付成功，跳出循环
      break;
    }
    
    // 如果还没到最后一次，等待200ms后继续
    if (i < maxRetries - 1) {
      await new Promise(
        resolve => setTimeout(resolve, 200)
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
| Rust | `app/{mod}/xxx_service.rs` | 统一下单函数 |
| Rust | `app/{mod}/xxx_service.rs` | 回调处理函数 |
| Rust | `app/wx/wx_pay_notice/wx_pay_notice_service.rs` | 添加 `if action ==` 分支 |
| Uni | `src/pages/{table}/Api2.ts` | 支付接口函数 |
| Uni | `src/pages/{table}/*.vue` | 支付调用逻辑 |
