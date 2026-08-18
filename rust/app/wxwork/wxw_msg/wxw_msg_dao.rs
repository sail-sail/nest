use color_eyre::eyre::Result;
use generated::common::context::Options;
use generated::base::usr::usr_model::UsrId;
use generated::base::message::message_model::{MessageInput, MessageModel};

use super::wxw_msg_model::SendCardMsgInput;

pub async fn send_card_msg(input: SendCardMsgInput, options: Option<Options>) -> Result<bool> {
  generated::wxwork::wxw_msg::wxw_msg_dao2::send_card_msg(input, options).await
}

pub async fn send_message_wxwork(
  input: MessageInput,
  receiver_usr_ids: Vec<UsrId>,
  options: Option<Options>,
) -> Result<MessageModel> {
  generated::wxwork::wxw_msg::wxw_msg_dao2::send_message_wxwork(
    input,
    receiver_usr_ids,
    options,
  ).await
}
