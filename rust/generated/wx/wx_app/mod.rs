pub mod wx_app_model;
pub mod wx_app_resolver;
pub mod wx_app_graphql;
pub mod wx_app_service;
pub mod wx_app_dao;

pub fn init() {
  crate::base::usr::usr_sync_dao::add_sync_usr_lbl_by_usr_id_callback(wx_app_dao::sync_usr_lbl_by_usr_id_wx_app);
}
