pub mod message_model;
pub mod message_resolver;
pub mod message_graphql;
pub mod message_service;
pub mod message_dao;

pub fn init() {
  crate::base::usr::usr_sync_dao::add_sync_usr_lbl_by_usr_id_callback(message_dao::sync_usr_lbl_by_usr_id_message);
}
