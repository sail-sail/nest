pub mod wx_app_token_model;
pub mod wx_app_token_resolver;
pub mod wx_app_token_graphql;
pub mod wx_app_token_service;
pub mod wx_app_token_dao;

pub fn init() {
  crate::base::usr::usr_sync_dao::add_sync_usr_lbl_by_usr_id_callback(wx_app_token_dao::sync_usr_lbl_by_usr_id_wx_app_token);
}
