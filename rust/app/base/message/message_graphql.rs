use async_graphql::{Context, Object};
use color_eyre::eyre::Result;

use generated::base::message::message_model::{MessageInput, MessageModel};
use generated::base::message_receiver::message_receiver_model::MessageReceiverId;
use generated::common::context::Ctx;
use generated::base::usr::usr_model::UsrId;

use super::message_resolver;

#[derive(Default)]
pub struct MessageQuery;

#[Object(rename_args = "snake_case")]
impl MessageQuery {
  /// 获取当前用户未读消息数量
  #[graphql(name = "getMyUnreadMessageCount")]
  async fn get_my_unread_message_count(&self, ctx: &Context<'_>) -> Result<u64> {
    Ctx::builder(ctx)
      .with_auth()?
      .build()
      .scope({
        message_resolver::get_my_unread_message_count()
      })
      .await
  }
}

#[derive(Default)]
pub struct MessageMutation;

#[Object(rename_args = "snake_case")]
impl MessageMutation {
  /// 发送消息
  #[graphql(name = "sendMessage")]
  async fn send_message(
    &self,
    ctx: &Context<'_>,
    input: MessageInput,
    receiver_usr_ids: Vec<UsrId>,
  ) -> Result<MessageModel> {
    Ctx::builder(ctx)
      .with_auth()?
      .build()
      .scope({
        message_resolver::send_message(input, receiver_usr_ids, None)
      }).await
  }

  /// 标记消息接收记录为已读
  #[graphql(name = "markMessageReceiverAsRead")]
  async fn mark_message_receiver_as_read(
    &self,
    ctx: &Context<'_>,
    id: MessageReceiverId,
  ) -> Result<bool> {
    Ctx::builder(ctx)
      .with_auth()?
      .build()
      .scope({
        message_resolver::mark_message_receiver_as_read(id, None)
      }).await
  }
}
