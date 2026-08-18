use color_eyre::eyre::Result;
use tracing::info;
use generated::common::context::Options;

use generated::base::message::message_model::{MessageInput, MessageModel};
use generated::base::message_receiver::message_receiver_model::MessageReceiverId;
use generated::common::context::get_req_id;
use generated::base::usr::usr_model::UsrId;

use super::message_service;

/// 获取当前用户未读消息数量
#[function_name::named]
pub async fn get_my_unread_message_count() -> Result<u64> {
  info!(
    "{req_id} {function_name}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );

  message_service::get_my_unread_message_count().await
}

/// 发送消息
#[function_name::named]
pub async fn send_message(
  input: MessageInput,
  receiver_usr_ids: Vec<UsrId>,
  options: Option<Options>,
) -> Result<MessageModel> {
  info!(
    "{req_id} {function_name}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );

  message_service::send_message(input, receiver_usr_ids, options).await
}

/// 标记消息接收记录为已读
#[function_name::named]
pub async fn mark_message_receiver_as_read(
  id: MessageReceiverId,
  options: Option<Options>,
) -> Result<bool> {
  info!(
    "{req_id} {function_name}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );

  message_service::mark_message_receiver_as_read(id, options).await
}
