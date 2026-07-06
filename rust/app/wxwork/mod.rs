pub mod wxw_app;
pub mod wxw_app_token;
pub mod wxw_msg;
pub mod wxw_usr;

use async_graphql::MergedObject;

#[derive(MergedObject, Default)]
pub struct WxworkAppQuery(
  self::wxw_usr::wxw_usr_graphql::WxwUsrQuery,
  self::wxw_app_token::wxw_app_token_graphql::WxwAppTokenQuery,
);

#[derive(MergedObject, Default)]
pub struct WxworkAppMutation(
  self::wxw_usr::wxw_usr_graphql::WxwUsrMutation,
);
