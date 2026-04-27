---
name: wx-pay
description: 微信支付/退款流程开发. 实现支付、退款、支付通知、退款通知时使用
---

# 微信支付与退款流程

## 概述

```
支付: 统一下单 → 前端调起支付 → 微信支付回调 → 业务处理
退款: 业务发起退款 → refund() 写入 wx_refund → 微信退款异步通知 → wx_refund_notice 分发 → 业务回调处理
```

> 退款不是同步完成。`refund()` 返回成功只代表微信侧已受理退款请求; 业务表状态更新应以 `wx_refund_notice` 收到 `Success` 通知后的回调为准。

## 系统自带（无需开发）

凡是已接入 `wx_` 模块的项目, 通常都已经具备下列表和通用函数, 业务模块只需要接入自己的 action 和 callback:

| 模块 | 说明 |
|------|------|
| `wx_wx_pay` | 微信支付配置表 |
| `wx_pay_transactions_jsapi` | 统一下单记录表 |
| `wx_wx_pay_notice` | 支付通知记录表 |
| `wx_wx_refund` | 微信退款记录表 |
| `wx_wx_refund_notice` | 退款通知记录表 |
| `transactions_jsapi()` | 统一下单函数 |
| `tradeStatePayTransactionsJsapi` | 查询支付状态接口 |
| `refund()` | 微信退款函数 |
| `tradeStateWxRefund` | 查询退款状态接口 |

## 支付开发步骤

### Step 1: 后端 - 统一下单接口

> 参考 Skill: `backend-api` 创建完整的 graphql → resolver → service 三层接口

在业务模块的 `*_service.rs` 中调用 `transactions_jsapi`:

```rust
use crate::wx::pay_transactions_jsapi::pay_transactions_jsapi_model::{
  TransactionsJsapiInput,
  RequestPaymentOptions,
};
use crate::wx::pay_transactions_jsapi::pay_transactions_jsapi_dao::transactions_jsapi;
use crate::wx::wx_pay_notice::wx_pay_notice_model::WX_PAY_NOTICE_ACTION_PAY_XXX;

pub async fn pay_xxx(
  options: Option<Options>,
) -> Result<RequestPaymentOptions> {
  
  // 业务校验 & 创建待支付记录
  let record_id = create_xxx_record(...).await?;
  
  // 构造 attach2（回调时用于识别业务）
  let attach2 = serde_json::json!({
    "action": WX_PAY_NOTICE_ACTION_PAY_XXX,
    "payload": {
      "record_id": record_id,      // 回调时需要的数据
    },
  }).to_string();
  
  // 调用统一下单
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

先在 `app/wx/wx_pay_notice/wx_pay_notice_model.rs` 定义共享 action 常量，避免下单与回调两处字符串漂移:

```rust
pub static WX_PAY_NOTICE_ACTION_PAY_XXX: &str = "pay_xxx";
```

**2.1** 在 `app/wx/wx_pay_notice/wx_pay_notice_service.rs` 的 `wx_pay_notify` 函数末尾添加 `if action ==` 分支:

```rust
// 在 wx_pay_notify 函数末尾的 if action == "..." 区域添加
} else if action == WX_PAY_NOTICE_ACTION_PAY_XXX {
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
    uni.showToast({ title: "没有可用的支付方式", icon: "error" });
    return;
  }
  
  // 2. 统一下单
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
    uni.showToast({ title: "支付取消", icon: "error" });
    return;
  }
  if (errMsg !== "requestPayment:ok") {
    uni.showToast({ title: "支付失败", icon: "error" });
    return;
  }
  
  // 5. 轮询支付状态（最多30次，间隔200ms）
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
        resolve => setTimeout(resolve, 200)
      );
    }
  }
  
  // 检查最终状态
  if (trade_state !== PayTransactionsJsapiTradeState.Success) {
    uni.showToast({
      title: "暂未查询到支付结果，请稍后再刷新",
      icon: "none",
      duration: 3000,
    });
    return;
  }
  
  await uni.showModal({
    content: "支付成功!",
    showCancel: false,
  });
  
  // 6. 后续处理: 刷新页面数据等
}
```

## 退款开发步骤

### 先记住这几个约束

- `refund()` 只负责调用微信退款接口并落表 `wx_refund`, 不会直接完成业务退款闭环
- 业务回调入口在 `app/wx/wx_refund_notice/wx_refund_notice_service.rs` 的 `wx_refund_notify`
- 默认只有 `refund_status == Success` 才会进入业务回调; `Closed`、`Processing`、`Abnormal` 只会写入 wx 表
- `transaction_id` 必填, `refund()` 会通过它反查原支付单的 `out_trade_no`
- `WxRefundInput.amount_refund` 和 `amount_total` 都是分
- `amount_total` 必须传原微信订单总金额, 通常来自 `wx_pay_transactions_jsapi.total_fee`, 不要传业务侧当前剩余金额
- `out_refund_no` 一般不需要业务自己生成, 系统会在 `refund()` 内自动生成
- `attach2` 要带上业务回调所需的最小 payload, 例如业务单 id、部分退款区间、退款申请 id 等

### Step 1: 后端 - 业务退款接口

> 参考现有业务实现: 先做业务校验, 再把本地状态更新为处理中, 最后调用 `refund()` 发起退款

```rust
use color_eyre::eyre::{Result, eyre};
use rust_decimal::Decimal;

use generated::common::context::Options;
use crate::wx::wx_refund::wx_refund_service::refund;
use crate::wx::wx_refund_notice::wx_refund_notice_model::WX_REFUND_NOTICE_ACTION_REFUND_XXX;

use smol_str::ToSmolStr;

use generated::wx::pay_transactions_jsapi::pay_transactions_jsapi_dao::find_one_ok_pay_transactions_jsapi;
use generated::wx::pay_transactions_jsapi::pay_transactions_jsapi_model::PayTransactionsJsapiSearch;
use generated::wx::wx_refund::wx_refund_model::WxRefundInput;

pub async fn refund_xxx(
  record_id: XxxRecordId,
  options: Option<Options>,
) -> Result<()> {
  
  let xxx_model = find_by_id_ok_xxx(
    record_id,
    options,
  ).await?;
  
  let transaction_id = xxx_model.transaction_id;
  if transaction_id.is_empty() {
    return Err(eyre!("微信支付订单号不能为空"));
  }
  
  let pay_transactions_jsapi_model = find_one_ok_pay_transactions_jsapi(
    Some(PayTransactionsJsapiSearch {
      transaction_id: Some(transaction_id.clone()),
      ..Default::default()
    }),
    None,
    options,
  ).await?;
  
  let total_fee = pay_transactions_jsapi_model.total_fee;
  let refund_amt = xxx_model.refund_amt;
  let refund_amt_fen = (
    refund_amt * Decimal::from(100)
  ).round_dp(0).to_string().parse::<u32>()?;
  
  let attach2 = serde_json::json!({
    "action": WX_REFUND_NOTICE_ACTION_REFUND_XXX,
    "payload": {
      "record_id": record_id.to_string(),
    },
  }).to_smolstr();
  
  update_by_id_xxx(
    record_id,
    XxxInput {
      refund_status: Some(XxxRefundStatus::Processing),
      ..Default::default()
    },
    options,
  ).await?;
  
  refund(
    WxRefundInput {
      transaction_id: Some(transaction_id),
      reason: Some("订单退款".into()),
      attach2: Some(attach2),
      amount_refund: Some(refund_amt_fen),
      amount_total: Some(total_fee),
      ..Default::default()
    },
    options,
  ).await?;
  
  Ok(())
}
```

### Step 2: 后端 - 退款通知分发

先在 `app/wx/wx_refund_notice/wx_refund_notice_model.rs` 定义共享 action 常量, 避免发起退款与回调分发两处字符串漂移:

```rust
pub static WX_REFUND_NOTICE_ACTION_REFUND_XXX: &str = "refund_xxx";
```

然后在 `app/wx/wx_refund_notice/wx_refund_notice_service.rs` 的 `wx_refund_notify` 中添加业务分支:

```rust
if action == WX_REFUND_NOTICE_ACTION_REFUND_XXX {
  
  let record_id = payload.get("record_id")
    .and_then(|v| v.as_str())
    .ok_or_else(|| eyre!("record_id not found"))?;
  let record_id = XxxRecordId::from(record_id);
  
  let amt = Decimal::from(amount_refund) / Decimal::from(100);
  
  use crate::{mod}::{table}_service::refund_xxx_callback;
  refund_xxx_callback(
    record_id,
    amt,
    SmolStr::new(&wx_refund_resource.refund_id),
    success_time,
    options,
  ).await?;
  
  return Ok(());
}
```

如果是部分退款, 把回调后仍要用到的区间、明细 id、退款申请 id 等一起放进 `attach2.payload`, 然后在这里解析。

### Step 3: 后端 - 业务退款成功回调

```rust
pub async fn refund_xxx_callback(
  record_id: XxxRecordId,
  refund_amt: Decimal,
  refund_id: SmolStr,
  refund_success_time: Option<NaiveDateTime>,
  options: Option<Options>,
) -> Result<()> {
  
  let xxx_model = find_by_id_ok_xxx(
    record_id,
    options,
  ).await?;
  
  let remain_amt = (
    xxx_model.pay_amt - refund_amt
  ).round_dp(2);
  
  update_by_id_xxx(
    record_id,
    XxxInput {
      refund_amt: Some(refund_amt),
      remain_amt: Some(remain_amt),
      refund_id: Some(refund_id),
      refund_status: Some(XxxRefundStatus::Success),
      refund_success_time,
      ..Default::default()
    },
    options,
  ).await?;
  
  Ok(())
}
```

全额退款和部分退款的差异, 一般都在这个 callback 里收口处理:

- 全额退款: 更新业务状态为已退款/已关闭
- 部分退款: 回写剩余金额、剩余区间或剩余可履约内容

### Step 4: 前端/管理端 - 调用退款接口

在业务模块的 `Api2.ts` 中添加退款接口:

```typescript
import type {
  Mutation,
} from "#/types.ts";

/** 发起退款 */
export async function refundXxx(
  id: XxxId,
  input: XxxInput,
  opt?: GqlOpt,
) {
  
  const res: {
    refundXxx: Mutation["refundXxx"],
  } = await mutation({
    query: /* GraphQL */ `
      mutation($id: XxxId!, $input: XxxInput!) {
        refundXxx(id: $id, input: $input)
      }
    `,
    variables: {
      id,
      input,
    },
  }, opt);
  
  return res.refundXxx;
}
```

前端要注意:

- mutation 成功只代表退款请求已受理, 不代表业务退款已经完成
- 页面提示通常应该是“退款处理中”而不是“退款成功”
- 如果页面需要主动刷新退款状态, 可以调用系统自带 `tradeStateWxRefund`; 但业务最终状态仍建议以后端通知回调落库为准

## attach2 结构

支付与退款共用同一套约定: `action` 用于通知分发, `payload` 放业务回调需要的数据

支付示例:

```json
{
  "action": "pay_xxx",
  "payload": {
    "record_id": "回调时需要的业务ID"
  }
}
```

退款示例:

```json
{
  "action": "refund_xxx",
  "payload": {
    "record_id": "业务单ID",
    "refund_apply_id": "可选: 退款申请ID",
    "extra": "可选: 部分退款回调还需要的数据"
  }
}
```

## 文件清单

| 端 | 文件 | 开发内容 |
|----|------|----------|
| Rust | `app/{mod}/xxx_service.rs` | 统一下单函数 / 业务退款函数 / 支付回调 / 退款成功回调 |
| Rust | `app/wx/wx_pay_notice/wx_pay_notice_service.rs` | 添加 `if action ==` 分支 |
| Rust | `app/wx/wx_refund_notice/wx_refund_notice_service.rs` | 添加退款 `if action ==` 分支 |
| Rust | `app/wx/wx_refund_notice/wx_refund_notice_model.rs` | 退款 action 常量 |
| Uni | `src/pages/{table}/Api2.ts` | 支付接口函数 |
| PC / Uni | `Api2.ts` | 退款接口函数 |
| PC / Uni | `*.vue` | 支付调起 / 退款状态展示 |
