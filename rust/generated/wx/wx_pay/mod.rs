pub mod wx_pay_model;
pub mod wx_pay_resolver;
pub mod wx_pay_graphql;
pub mod wx_pay_service;
pub mod wx_pay_dao;

pub fn init() {
  crate::base::usr::usr_sync_dao::add_sync_usr_lbl_by_usr_id_callback(wx_pay_dao::sync_usr_lbl_by_usr_id_wx_pay);
}
