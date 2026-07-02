use color_eyre::eyre::Result;

use generated::base::message::message_dao2::{
  get_current_user_unread_message_count,
  send_message as send_message_dao2,
};
use generated::base::message::message_model::{MessageInput, MessageModel};
use generated::base::usr::usr_model::UsrId;

/// 获取当前用户未读消息数量
pub async fn get_my_unread_message_count() -> Result<u64> {
  get_current_user_unread_message_count(None).await
}

/// 发送消息
pub async fn send_message(
  input: MessageInput,
  receiver_usr_ids: Vec<UsrId>,
) -> Result<MessageModel> {
  send_message_dao2(input, receiver_usr_ids).await
}
