use color_eyre::eyre::Result;
use generated::common::context::Options;
use generated::base::usr::usr_model::UsrId;
use generated::base::message::message_model::{MessageId, MessageInput, MessageModel};

use super::wxw_msg_model::SendCardMsgInput;

pub async fn send_card_msg(input: SendCardMsgInput, options: Option<Options>) -> Result<bool> {
  generated::wxwork::wxw_msg::wxw_msg_dao2::send_card_msg(input, options).await
}

pub async fn send_message_wxwork(
  input: MessageInput,
  receiver_usr_ids: Vec<UsrId>,
  sys_message_id: Option<MessageId>,
  options: Option<Options>,
) -> Result<MessageModel> {
  generated::wxwork::wxw_msg::wxw_msg_dao2::send_message_wxwork(
    input,
    receiver_usr_ids,
    sys_message_id,
    options,
  ).await
}
