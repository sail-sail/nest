pub mod usr_model;
pub mod usr_resolver;
pub mod usr_graphql;
pub mod usr_service;
pub mod usr_dao;
pub mod usr_sync_dao;

pub fn init() {
  crate::base::usr::usr_sync_dao::add_sync_usr_lbl_by_usr_id_callback(usr_dao::sync_usr_lbl_by_usr_id_usr);
}
