use color_eyre::eyre::Result;

use generated::base::message::message_dao::find_by_id_message;
use generated::base::message::message_dao2::{
  get_current_user_unread_message_count,
  send_message as send_message_dao2,
};
use generated::base::message::message_model::{MessageId, MessageInput, MessageModel};
use generated::base::message_receiver::message_receiver_dao::{
  find_by_id_message_receiver,
  find_one_message_receiver,
  update_by_id_message_receiver,
};
use generated::base::message_receiver::message_receiver_model::{
  MessageReceiverId,
  MessageReceiverInput,
  MessageReceiverModel,
  MessageReceiverSearch,
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

/// 按消息ID标记当前用户已读, 并联动它关联的站内消息
/// 企微卡片的链接只带企微消息ID, 而消息中心展示的是 sys_message_id 指向的站内消息
/// 两条记录都要有当前用户的接收记录才允许操作, 避免用别人的消息ID清掉未读
pub async fn mark_my_message_read_by_message_id(
  message_id: MessageId,
  options: Option<Options>,
) -> Result<bool> {
  let usr_id = get_auth_id_ok()?;
  let Some(message) = find_by_id_message(message_id, options).await? else {
    return Ok(false);
  };

  let receiver = find_one_message_receiver(
    MessageReceiverSearch {
      message_id: Some(vec![message_id]),
      receiver_usr_id: Some(vec![usr_id]),
      ..Default::default()
    }.into(),
    None,
    options,
  ).await?;
  let Some(receiver) = receiver else {
    return Ok(false);
  };
  mark_receiver_read(receiver, options).await?;

  // 联动这条企微消息对应的站内消息, 同样只更新当前用户自己的接收记录
  let sys_message_id = message.sys_message_id.trim();
  if !sys_message_id.is_empty() {
    let sys_message_id = MessageId::from(sys_message_id.to_string());
    if sys_message_id != message_id {
      let sys_receiver = find_one_message_receiver(
        MessageReceiverSearch {
          message_id: Some(vec![sys_message_id]),
          receiver_usr_id: Some(vec![usr_id]),
          ..Default::default()
        }.into(),
        None,
        options,
      ).await?;
      if let Some(sys_receiver) = sys_receiver {
        mark_receiver_read(sys_receiver, options).await?;
      }
    }
  }

  Ok(true)
}

/// 幂等标记单条接收记录已读
async fn mark_receiver_read(
  receiver: MessageReceiverModel,
  options: Option<Options>,
) -> Result<()> {
  if receiver.is_read == 1 {
    return Ok(());
  }

  let input = MessageReceiverInput {
    id: Some(receiver.id),
    is_read: Some(1),
    read_time: Some(get_now().into()),
    ..Default::default()
  };
  update_by_id_message_receiver(receiver.id, input, options).await?;
  Ok(())
}

