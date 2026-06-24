#![allow(clippy::clone_on_copy)]
#![allow(clippy::redundant_clone)]

use color_eyre::eyre::Result;
use serde_json::json;

use crate::base::message::message_dao::create_return_message;
use crate::base::message::message_model::{MessageInput, MessageModel};
use crate::base::message_receiver::message_receiver_dao::{
  creates_message_receiver,
  find_count_message_receiver,
};
use crate::base::message_receiver::message_receiver_model::{
  MessageReceiverInput,
  MessageReceiverSearch,
};
use crate::common::context::{
  Options,
  get_auth_id,
  get_auth_id_ok,
};
use crate::common::websocket::websocket_dao::publish;
use crate::base::usr::usr_model::UsrId;

/// 获取当前用户未读消息数量
pub async fn get_current_user_unread_message_count(
  options: Option<Options>,
) -> Result<u64> {
  let usr_id = get_auth_id_ok()?;

  let search = Some(MessageReceiverSearch {
    receiver_usr_id: Some(vec![usr_id]),
    is_read: Some(vec![0]),
    ..Default::default()
  });

  find_count_message_receiver(search, options).await
}

/// 发送消息
pub async fn send_message(
  input: MessageInput,
  receiver_usr_ids: Vec<UsrId>,
) -> Result<MessageModel> {
  let sender_usr_id = get_auth_id();
  let mut receiver_inputs = Vec::with_capacity(receiver_usr_ids.len());

  let mut message_input = input;
  message_input.sender_usr_id = sender_usr_id.clone().map(Into::into);
  message_input.route_path = message_input.route_path.or_else(|| Some("/base/message".into()));
  message_input.route_query = message_input.route_query.or_else(|| Some("".into()));
  message_input.is_sys_msg = message_input.is_sys_msg.or_else(|| Some(0));
  message_input.is_pinned = message_input.is_pinned.or_else(|| Some(0));

  let title = message_input.title.clone().unwrap_or_default().to_string();
  let content = message_input.content.clone().unwrap_or_default().to_string();
  let route_path = message_input.route_path.clone().unwrap_or_default().to_string();
  let route_query = message_input.route_query.clone().unwrap_or_default().to_string();
  let tenant_id = message_input.tenant_id;

  let message = create_return_message(message_input, None).await?;

  for receiver_usr_id in &receiver_usr_ids {
    receiver_inputs.push(MessageReceiverInput {
      message_id: Some(message.id.clone()),
      receiver_usr_id: Some(receiver_usr_id.clone().into()),
      is_read: Some(0),
      tenant_id,
      ..Default::default()
    });
  }

  if !receiver_inputs.is_empty() {
    creates_message_receiver(receiver_inputs, None).await?;
  }

  let payload = json!({
    "messageId": message.id,
    "title": title,
    "content": content,
    "routePath": route_path,
    "routeQuery": route_query,
    "receiverUsrIds": receiver_usr_ids,
  });
  publish("message".to_string(), Some(payload)).await;

  Ok(message)
}

#[cfg(test)]
mod tests {
  use super::*;
  use crate::base::message_receiver::message_receiver_model::MessageReceiverSearch;
  use crate::common::context::{
    Ctx,
    Options,
  };

  #[tokio::test]
  async fn test_send_message_creates_message_and_receivers() -> Result<()> {
    Ctx::test_builder()
      .with_silent_mode()
      .build()
      .scope(async {
        let options = Options::new()
          .set_is_silent_mode(Some(true));
        let options = Some(options);

        let message = send_message(
          MessageInput {
            title: Some("test-title".into()),
            content: Some("test-content".into()),
            tenant_id: Some("ZDbZlC1OT8KaDg6soxMCBQ".into()),
            ..Default::default()
          },
          vec!["9LmnqhLITzKskFO/lcXRqA".into()],
        )
        .await?;

        assert!(!message.id.to_string().is_empty());

        let receiver_models = crate::base::message_receiver::message_receiver_dao::find_all_message_receiver(
          Some(MessageReceiverSearch {
            message_id: Some(vec![message.id.clone()]),
            ..Default::default()
          }),
          None,
          None,
          options,
        )
        .await?;

        assert_eq!(receiver_models.len(), 1);
        Ok(())
      })
      .await
  }
}
