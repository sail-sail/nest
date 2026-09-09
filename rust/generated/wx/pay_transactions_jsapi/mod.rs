pub mod pay_transactions_jsapi_model;
pub mod pay_transactions_jsapi_resolver;
pub mod pay_transactions_jsapi_graphql;
pub mod pay_transactions_jsapi_service;
pub mod pay_transactions_jsapi_dao;

pub fn init() {
  crate::base::usr::usr_sync_dao::add_sync_usr_lbl_by_usr_id_callback(pay_transactions_jsapi_dao::sync_usr_lbl_by_usr_id_pay_transactions_jsapi);
}
