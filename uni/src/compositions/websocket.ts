import {
  uuid,
} from "@/utils/StringUtil";

import cfg from "@/utils/config";

import type {
  SocketTask,
} from "@uni-helper/uni-use";

const clientId = uuid();

const PWD = "0YSCBr1QQSOpOfi6GgH34A";

const url = cfg.wss + '/api/websocket/upgrade?pwd='+ PWD + '&clientId=' + encodeURIComponent(clientId);

let socket: SocketTask | undefined = undefined;
const topicCallbackMap = new Map<string, ((data: any) => void)[]>();

let reConnectNum = 0;

async function socketPing() {
  if (socket) {
    socket.send({
      data: "ping",
    });
  }
  setTimeout(socketPing, 60000);
}
socketPing();

async function reConnect() {
  if (socket) {
    return socket;
  }
  if (topicCallbackMap.size === 0) {
    return;
  }
  reConnectNum++;
  let time = 200;
  if (reConnectNum > 10) {
    time = 5000;
  } else {
    time = reConnectNum * 200;
  }
  await new Promise((resolve) => setTimeout(resolve, time));
  await connect();
}

async function connect() {
  let isNewSocket = false;
  if (!socket) {
    await new Promise((resolve) => {
      socket = uni.connectSocket({
        url,
        success() {
        },
        fail() {
          socket = undefined;
        },
      });
      socket.onOpen(() => {
        resolve(undefined);
      });
    });
    isNewSocket = true;
  }
  if (!socket) {
    return;
  }
  if (isNewSocket) {
    socket.onMessage(function(event) {
      const eventData = event.data;
      if (typeof eventData !== "string") {
        return;
      }
      if (eventData === "pong") {
        return;
      }
      const obj = JSON.parse(eventData as string);
      const topic = obj.topic;
      const payload = obj.payload;
      const callbacks = topicCallbackMap.get(topic);
      if (callbacks && callbacks.length > 0) {
        for (const callback of callbacks) {
          callback(payload);
        }
      }
    });
    socket.onClose(function() {
      socket = undefined;
      reConnect();
    });
    socket.onError(function(err) {
      try {
        socket?.close({ });
      } catch (_err) {
        console.log(_err);
      }
    });
    for (const [ topic ] of topicCallbackMap) {
      socket.send({
        data: JSON.stringify({
          action: "subscribe",
          data: {
            topics: [ topic ],
          },
        }),
      });
    }
  }
  return socket;
}

/** 订阅主题topic */
export async function subscribe<T>(
  topic: string,
  callback: ((data: T | undefined) => void),
) {
  if (closeSocketTimeout) {
    clearTimeout(closeSocketTimeout);
    closeSocketTimeout = undefined;
  }
  let socket: SocketTask | undefined;
  socket = await connect();
  if (!socket) {
    return;
  }
  let callbacks = topicCallbackMap.get(topic);
  if (!callbacks) {
    callbacks = [ ];
    topicCallbackMap.set(topic, callbacks);
  }
  callbacks.push(callback);
  socket.send({
    data: JSON.stringify({
      action: "subscribe",
      data: {
        topics: [ topic ],
      },
    }),
  });
}

/** 取消订阅 */
export async function unSubscribe(
  topic: string,
  callback: Function,
) {
  if (closeSocketTimeout) {
    clearTimeout(closeSocketTimeout);
    closeSocketTimeout = undefined;
  }
  const callbacks = topicCallbackMap.get(topic);
  if (callbacks && callbacks.length > 0) {
    const index = callbacks.indexOf(callback as any);
    if (index >= 0) {
      callbacks.splice(index, 1);
    }
  }
  if (!callbacks || callbacks.length === 0) {
    topicCallbackMap.delete(topic);
    const socket = await connect();
    if (!socket) {
      return;
    }
    socket.send({
      data: JSON.stringify({
        action: "unSubscribe",
        data: {
          topics: [ topic ],
        },
      }),
    });
  }
  
  closeSocketTimeout = setTimeout(() => {
    if (topicCallbackMap.size === 0) {
      try {
        socket?.close({ });
      } catch (err) {
        console.log(err);
      } finally {
        socket = undefined;
      }
    }
  }, 600000);
}

let closeSocketTimeout: NodeJS.Timeout | undefined = undefined;

/** 发布消息 */
export async function publish(
  data: {
    topic: string;
    payload: any;
  },
  option?: {
    isValidCurrClientId?: boolean;
  },
) {
  if (closeSocketTimeout) {
    clearTimeout(closeSocketTimeout);
    closeSocketTimeout = undefined;
  }
  if (option?.isValidCurrClientId) {
    const callbacks = topicCallbackMap.get(data.topic);
    if (callbacks && callbacks.length > 0) {
      for (const callback of callbacks) {
        callback(data.payload);
      }
    }
  }
  const socket0 = await connect();
  socket0?.send({
    data: JSON.stringify({
      action: "publish",
      data,
    }),
  });
  
  closeSocketTimeout = setTimeout(() => {
    if (topicCallbackMap.size === 0) {
      try {
        socket?.close({ });
      } catch (err) {
        console.log(err);
      } finally {
        socket = undefined;
      }
    }
  }, 600000);
}
