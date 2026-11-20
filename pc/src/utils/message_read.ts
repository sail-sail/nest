import { markMyMessageReadByMessageId } from "@/views/base/message/Api2";

/** 最近一次触发过已读的消息, 用于避免原地刷新重复请求 */
const LAST_READ_MESSAGE_ID_KEY = "last_read_message_id";

/** 从 query 中取 _message_id, 兼容数组与空值 */
function pickMessageId(value: unknown) {
  const raw = Array.isArray(value) ? value[0] : value;
  return typeof raw === "string" ? raw.trim() : "";
}

function readStoredMessageId() {
  try {
    return localStorage.getItem(LAST_READ_MESSAGE_ID_KEY) || "";
  } catch (e) {
    return "";
  }
}

function storeMessageId(messageId: string) {
  try {
    localStorage.setItem(LAST_READ_MESSAGE_ID_KEY, messageId);
  } catch (e) {
    // 隐私模式下不可用, 退化成每次都请求(接口幂等)
    console.error("记录消息已读标记失败:", e);
  }
}

function clearStoredMessageId(messageId: string) {
  try {
    if (localStorage.getItem(LAST_READ_MESSAGE_ID_KEY) === messageId) {
      localStorage.removeItem(LAST_READ_MESSAGE_ID_KEY);
    }
  } catch (e) {
    console.error("清除消息已读标记失败:", e);
  }
}

/**
 * 落地页带 _message_id 时标记该消息已读(企微消息会联动关联的站内消息)
 * 与本地记录相同则跳过, 原地刷新不会重复请求; 失败时回滚记录以便下次刷新重试
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

  markMyMessageReadByMessageId(messageId as MessageId).then((ok) => {
    if (!ok) {
      clearStoredMessageId(messageId);
      return;
    }
    window.dispatchEvent(new CustomEvent("message-count-changed"));
  }).catch((err) => {
    console.error(err);
    clearStoredMessageId(messageId);
  });
}
