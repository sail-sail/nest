#![forbid(unsafe_code)]

pub mod aliyun_call;
pub mod aliyun_dao;
pub mod aliyun_model;

mod http;

pub use aliyun_dao::send_sms;
pub use aliyun_model::SendSmsResponse;
pub use color_eyre::eyre::Result;