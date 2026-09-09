pub mod message_receiver_model;
pub mod message_receiver_resolver;
pub mod message_receiver_graphql;
pub mod message_receiver_service;
pub mod message_receiver_dao;

pub fn init() {
  crate::base::usr::usr_sync_dao::add_sync_usr_lbl_by_usr_id_callback(message_receiver_dao::sync_usr_lbl_by_usr_id_message_receiver);
}
