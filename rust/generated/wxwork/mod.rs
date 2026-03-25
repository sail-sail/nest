pub mod wxw_app;
pub mod wxw_app_token;
pub mod wxw_msg;
pub mod wxw_usr;

use async_graphql::MergedObject;

#[derive(MergedObject, Default)]
pub struct WxworkQuery(
  self::wxw_app::wxw_app_graphql::WxwAppGenQuery,
  self::wxw_app_token::wxw_app_token_graphql::WxwAppTokenGenQuery,
  self::wxw_msg::wxw_msg_graphql::WxwMsgGenQuery,
  self::wxw_usr::wxw_usr_graphql::WxwUsrGenQuery,
);

#[derive(MergedObject, Default)]
pub struct WxworkMutation(
  self::wxw_app::wxw_app_graphql::WxwAppGenMutation,
  self::wxw_app_token::wxw_app_token_graphql::WxwAppTokenGenMutation,
  self::wxw_msg::wxw_msg_graphql::WxwMsgGenMutation,
  self::wxw_usr::wxw_usr_graphql::WxwUsrGenMutation,
);
