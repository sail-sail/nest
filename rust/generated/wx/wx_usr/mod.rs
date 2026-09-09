pub mod wx_usr_model;
pub mod wx_usr_resolver;
pub mod wx_usr_graphql;
pub mod wx_usr_service;
pub mod wx_usr_dao;

pub fn init() {
  crate::base::usr::usr_sync_dao::add_sync_usr_lbl_by_usr_id_callback(wx_usr_dao::sync_usr_lbl_by_usr_id_wx_usr);
}
