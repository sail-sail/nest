use color_eyre::eyre::Result;

use generated::base::message::message_dao2::{
  get_current_user_unread_message_count,
  send_message as send_message_dao2,
};
use generated::base::message::message_model::{MessageInput, MessageModel};
use generated::base::message_receiver::message_receiver_dao::{
  find_by_id_message_receiver,
  update_by_id_message_receiver,
};
use generated::base::message_receiver::message_receiver_model::{
  MessageReceiverId,
  MessageReceiverInput,
};
use generated::base::usr::usr_model::UsrId;
use generated::common::context::{
  Options,
  get_auth_id_ok,
  get_now,
};

/// 获取当前用户未读消息数量
pub async fn get_my_unread_message_count() -> Result<u64> {
  get_current_user_unread_message_count(None).await
}

/// 发送消息
pub async fn send_message(
  input: MessageInput,
  receiver_usr_ids: Vec<UsrId>,
  options: Option<Options>
) -> Result<MessageModel> {
  send_message_dao2(input, receiver_usr_ids, options).await
}

/// 标记消息接收记录为已读
pub async fn mark_message_receiver_as_read(
  id: MessageReceiverId,
  options: Option<Options>,
) -> Result<bool> {
  let usr_id = get_auth_id_ok()?;
  let receiver_model = match find_by_id_message_receiver(id, options).await? {
    Some(item) => item,
    None => return Ok(false),
  };

  if receiver_model.receiver_usr_id != usr_id {
    return Ok(false);
  }
  if receiver_model.is_read == 1 {
    return Ok(true);
  }

  let input = MessageReceiverInput {
    id: Some(id),
    is_read: Some(1),
    read_time: Some(get_now().into()),
    ..Default::default()
  };
  update_by_id_message_receiver(receiver_model.id, input, options).await?;
  Ok(true)
}

