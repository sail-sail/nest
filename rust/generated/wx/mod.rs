pub mod pay_transactions_jsapi;
pub mod wx_app;
pub mod wx_app_token;
pub mod wx_pay;
pub mod wx_pay_notice;
pub mod wx_refund;
pub mod wx_refund_notice;
pub mod wx_usr;
pub mod wxo_app;
pub mod wxo_app_token;
pub mod wxo_usr;

use async_graphql::MergedObject;

#[derive(MergedObject, Default)]
pub struct WxQuery(
  self::pay_transactions_jsapi::pay_transactions_jsapi_graphql::PayTransactionsJsapiGenQuery,
  self::wx_app::wx_app_graphql::WxAppGenQuery,
  self::wx_app_token::wx_app_token_graphql::WxAppTokenGenQuery,
  self::wx_pay::wx_pay_graphql::WxPayGenQuery,
  self::wx_pay_notice::wx_pay_notice_graphql::WxPayNoticeGenQuery,
  self::wx_refund::wx_refund_graphql::WxRefundGenQuery,
  self::wx_refund_notice::wx_refund_notice_graphql::WxRefundNoticeGenQuery,
  self::wx_usr::wx_usr_graphql::WxUsrGenQuery,
  self::wxo_app::wxo_app_graphql::WxoAppGenQuery,
  self::wxo_app_token::wxo_app_token_graphql::WxoAppTokenGenQuery,
  self::wxo_usr::wxo_usr_graphql::WxoUsrGenQuery,
);

#[derive(MergedObject, Default)]
pub struct WxMutation(
  self::pay_transactions_jsapi::pay_transactions_jsapi_graphql::PayTransactionsJsapiGenMutation,
  self::wx_app::wx_app_graphql::WxAppGenMutation,
  self::wx_app_token::wx_app_token_graphql::WxAppTokenGenMutation,
  self::wx_pay::wx_pay_graphql::WxPayGenMutation,
  self::wx_pay_notice::wx_pay_notice_graphql::WxPayNoticeGenMutation,
  self::wx_refund::wx_refund_graphql::WxRefundGenMutation,
  self::wx_refund_notice::wx_refund_notice_graphql::WxRefundNoticeGenMutation,
  self::wx_usr::wx_usr_graphql::WxUsrGenMutation,
  self::wxo_app::wxo_app_graphql::WxoAppGenMutation,
  self::wxo_app_token::wxo_app_token_graphql::WxoAppTokenGenMutation,
  self::wxo_usr::wxo_usr_graphql::WxoUsrGenMutation,
);
