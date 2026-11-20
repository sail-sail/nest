import { mutation } from "@/utils/graphql";

/** 最近一次触发过已读的消息, 与电脑端共用同一个 key */
const LAST_READ_MESSAGE_ID_KEY = "last_read_message_id";

/** 从 query 中取 _message_id, 兼容数组与空值 */
function pickMessageId(value: unknown) {
  const raw = Array.isArray(value) ? value[0] : value;
  return typeof raw === "string" ? raw.trim() : "";
}

function readStoredMessageId() {
  try {
    return String(uni.getStorageSync(LAST_READ_MESSAGE_ID_KEY) || "");
  } catch (e) {
    return "";
  }
}

function storeMessageId(messageId: string) {
  try {
    uni.setStorageSync(LAST_READ_MESSAGE_ID_KEY, messageId);
  } catch (e) {
    // 存储不可用时退化成每次都请求(接口幂等)
    console.error("记录消息已读标记失败:", e);
  }
}

function clearStoredMessageId(messageId: string) {
  try {
    if (String(uni.getStorageSync(LAST_READ_MESSAGE_ID_KEY) || "") === messageId) {
      uni.removeStorageSync(LAST_READ_MESSAGE_ID_KEY);
    }
  } catch (e) {
    console.error("清除消息已读标记失败:", e);
  }
}

/** 按消息ID标记已读, 企微消息会同时把关联的站内消息标记已读 */
async function markRead(messageId: string) {
  const data = await mutation({
    query: /* GraphQL */ `
      mutation($messageId: MessageId!) {
        markMyMessageReadByMessageId(message_id: $messageId)
      }
    `,
    variables: {
      messageId,
    },
  }, {
    notLoading: true,
  });
  return data?.markMyMessageReadByMessageId === true;
}

/**
 * 落地页带 _message_id 时标记该消息已读
 * 与本地记录相同则跳过, 原地刷新不会重复请求; 失败时回滚记录以便下次进入重试
 */
export function handleMessageReadFromQuery(query?: Record<string, unknown> | null) {
  const messageId = pickMessageId(query?._message_id);
  if (!messageId) {
    return;
  }
  if (readStoredMessageId() === messageId) {
    return;
  }
  storeMessageId(messageId);

  markRead(messageId).then((ok) => {
    if (!ok) {
      clearStoredMessageId(messageId);
    }
  }).catch((err) => {
    console.error(err);
    clearStoredMessageId(messageId);
  });
}
