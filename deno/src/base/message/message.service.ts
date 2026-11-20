import "/gen/base/message/message.model.ts";
import "/gen/base/message_receiver/message_receiver.model.ts";
import "/gen/base/usr/usr.model.ts";

import {
  get_usr_id,
} from "/lib/auth/auth.dao.ts";

import {
  findByIdMessage,
} from "/gen/base/message/message.dao.ts";

import {
  getCurrentUserUnreadMessageCount,
  sendMessage as sendMessageDao2,
} from "/gen/base/message/message.dao2.ts";

import {
  findByIdMessageReceiver,
  findOneMessageReceiver,
  updateByIdMessageReceiver,
} from "/gen/base/message_receiver/message_receiver.dao.ts";

export async function getMyUnreadMessageCount(): Promise<number> {
  return await getCurrentUserUnreadMessageCount();
}

export async function sendMessage(
  input: MessageInput,
  receiver_usr_ids: UsrId[],
): Promise<MessageModel> {
  return await sendMessageDao2(input, receiver_usr_ids);
}

export async function markMessageReceiverAsRead(id: MessageReceiverId): Promise<boolean> {
  if (!id) {
    return false;
  }

  const usr_id = await get_usr_id(false);
  const receiver_model = await findByIdMessageReceiver(id, {
    is_debug: false,
  });

  if (!receiver_model) {
    return false;
  }

  if (receiver_model.receiver_usr_id !== usr_id) {
    return false;
  }

  await markReceiverRead(receiver_model);

  return true;
}

/**
 * 按消息ID标记当前用户已读, 并联动它关联的站内消息
 * 企微卡片的链接只带企微消息ID, 而消息中心展示的是 sys_message_id 指向的站内消息
 * 两条记录都要有当前用户的接收记录才允许操作, 避免用别人的消息ID清掉未读
 */
export async function markMyMessageReadByMessageId(message_id: MessageId): Promise<boolean> {
  if (!message_id) {
    return false;
  }

  const usr_id = await get_usr_id(false);
  const message_model = await findByIdMessage(message_id, {
    is_debug: false,
  });
  if (!message_model) {
    return false;
  }

  const receiver_model = await findOneMessageReceiver(
    {
      message_id: [ message_id ],
      receiver_usr_id: [ usr_id ],
    },
    undefined,
    {
      is_debug: false,
    },
  );
  if (!receiver_model) {
    return false;
  }
  await markReceiverRead(receiver_model);

  // 联动这条企微消息对应的站内消息, 同样只更新当前用户自己的接收记录
  const sys_message_id = (message_model.sys_message_id ?? "").trim();
  if (sys_message_id) {
    const sys_message_id2 = sys_message_id as MessageId;
    if (sys_message_id2 !== message_id) {
      const sys_receiver_model = await findOneMessageReceiver(
        {
          message_id: [ sys_message_id2 ],
          receiver_usr_id: [ usr_id ],
        },
        undefined,
        {
          is_debug: false,
        },
      );
      if (sys_receiver_model) {
        await markReceiverRead(sys_receiver_model);
      }
    }
  }

  return true;
}

/** 幂等标记单条接收记录已读 */
async function markReceiverRead(receiver_model: MessageReceiverModel): Promise<void> {
  if (receiver_model.is_read === 1) {
    return;
  }

  const read_time = new Date().toISOString().slice(0, 19).replace("T", " ");
  await updateByIdMessageReceiver(
    receiver_model.id,
    {
      is_read: 1,
      read_time,
    },
    {
      is_debug: false,
    },
  );
}
