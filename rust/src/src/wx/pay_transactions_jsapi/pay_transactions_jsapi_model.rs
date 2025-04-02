use async_graphql::SimpleObject;
use serde::{Serialize, Deserialize};
use rust_decimal::Decimal;

#[derive(
  SimpleObject,
  Debug,
  Default,
  Serialize,
  Deserialize,
  Clone,
)]
pub struct RequestPaymentOptions {
  #[graphql(name = "out_trade_no")]
  pub out_trade_no: String,
  #[graphql(name = "timeStamp")]
  pub time_stamp: String,
  #[graphql(name = "nonceStr")]
  pub nonce_str: String,
  #[graphql(name = "package")]
  pub package: String,
  #[graphql(name = "signType")]
  pub sign_type: String,
  #[graphql(name = "paySign")]
  pub pay_sign: String,
}

#[derive(
  Debug,
  Default,
  Serialize,
  Deserialize,
  Clone,
)]
pub struct TransactionsJsapiInput {
  
  pub appid: String,
  
  pub description: String,
  
  pub amount: Decimal,
  
  /// 【交易结束时间】 订单失效时间，遵循rfc3339标准格式，格式为yyyy-MM-DDTHH:mm:ss+TIMEZONE，yyyy-MM-DD表示年月日，T出现在字符串中，表示time元素的开头，HH:mm:ss表示时分秒，TIMEZONE表示时区（+08:00表示东八区时间，领先UTC8小时，即北京时间）。例如：2015-05-20T13:29:35+08:00表示，北京时间2015年5月20日13点29分35秒。
  pub time_expire: Option<String>,
  
  /// 【附加数据】 附加数据，在查询API和支付通知中原样返回，可作为自定义参数使用，实际情况下只有支付完成状态才会返回该字段。
  pub attach: Option<String>,
  
  pub attach2: String,
  
  /// 开发票入口开放标识，传入Y时，支付成功消息和支付详情页将出现开票入口。
  pub receipt: Option<String>,
  
  /// 【是否指定分账】 是否指定分账， true：是 false：否
  pub profit_sharing: Option<bool>,
  
}

#[derive(Default, Copy, Clone, Eq, PartialEq, Debug, Serialize, Deserialize)]
pub enum TransactionsJsapiActionEnum {
  #[serde(rename = "test")]
  #[default]
  Test,
}
