import {
  // log,
  error,
} from "/lib/context.ts";

import {
  callbacksMap,
  socketMap,
  clientIdTopicsMap,
} from "./websocket.constants.ts";

/** 订阅主题topic */
export function subscribe<T>(
  topic: string,
  callback: (data: T) => void,
) {
  let callbacks = callbacksMap.get(topic);
  if (!callbacks) {
    callbacks = [ ];
    callbacksMap.set(topic, callbacks);
  }
  if (!callbacks.includes(callback)) {
    callbacks.push(callback);
  }
}

/** 发布消息 */
export async function publish<T>(
  data: {
    topic: string;
    payload: T;
  },
  isValidCurrClientId?: boolean,
) {
  const topic = data.topic;
  if (isValidCurrClientId) {
    const callbacks = callbacksMap.get(topic);
    if (callbacks && callbacks.length > 0) {
      for (const callback of callbacks) {
        await callback(data.payload);
      }
    }
  }
  const dataStr = JSON.stringify(data);
  for (const [ clientId, topics ] of clientIdTopicsMap) {
    if (!topics.includes(topic)) {
      continue;
    }
    const sockets = socketMap.get(clientId);
    if (!sockets || sockets.length === 0) {
      continue;
    }
    for (const socket of sockets) {
      if (socket.readyState !== WebSocket.OPEN) {
        socketMap.set(clientId, sockets.filter((item) => item !== socket));
        clientIdTopicsMap.delete(clientId);
        try {
          socket.close();
        } catch (_err) {
          error(_err);
        }
        continue;
      }
      socket.send(dataStr);
    }
  }
}

/** 取消订阅主题topic */
export function unSubscribe<T>(topic: string, callback: (data: T) => void) {
  const callbacks = callbacksMap.get(topic);
  if (callbacks && callbacks.length > 0) {
    // deno-lint-ignore no-explicit-any
    const index = callbacks.indexOf(callback as any);
    if (index >= 0) {
      callbacks.splice(index, 1);
    }
  }
  if (!callbacks || callbacks.length === 0) {
    callbacksMap.delete(topic);
  }
};

/** 关闭客户端 */
export function closeClient() {
  callbacksMap.clear();
};
