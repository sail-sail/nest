import {
  uuid,
} from "@/utils/StringUtil";

const isSSL = location.protocol === 'https:';

const clientId = uuid();

const PWD = "0YSCBr1QQSOpOfi6GgH34A";

const url = (isSSL ? 'wss://' : 'ws://') + location.host + '/api/websocket/upgrade?pwd='+ PWD + '&clientId=' + encodeURIComponent(clientId);

let socket: WebSocket | undefined = undefined;
const topicCallbackMap = new Map<string, ((data: any) => void)[]>();

let reConnectNum = 0;

function socketPing() {
  if (socket && socket.readyState === WebSocket.OPEN) {
    socket.send("ping");
  }
  setTimeout(socketPing, 60000);
}
socketPing();

async function reConnect() {
  if (socket && (socket.readyState === WebSocket.OPEN || socket.readyState === WebSocket.CONNECTING)) {
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
  if (!socket || (socket.readyState !== WebSocket.OPEN && socket.readyState !== WebSocket.CONNECTING)) {
    // console.log(url);
    socket = new WebSocket(url);
    socket.onmessage = function(event) {
      // console.log(`websocket: clientId ${ clientId } onmessage`);
      const eventData = event.data;
      // console.log(eventData);
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
    };
    socket.onclose = function() {
      // console.log('websocket: onclose');
      socket = undefined;
      reConnect();
    };
    socket.onerror = function(err0) {
      const err = err0 as ErrorEvent;
      try {
        socket!.close();
      } catch (_err) {
      }
      socket = undefined;
      reConnect();
    };
    await new Promise((resolve) => {
      if (!socket) {
        resolve(undefined);
        return;
      }
      if (socket.readyState === WebSocket.OPEN) {
        resolve(undefined);
        return;
      }
      socket.onopen = function() {
        // console.log('websocket: onopen');
        resolve(undefined);
      };
    });
    for (const [ topic ] of topicCallbackMap) {
      socket?.send(JSON.stringify({
        action: "subscribe",
        data: {
          topics: [ topic ],
        },
      }));
    }
  }
  if (!socket || (socket.readyState !== WebSocket.OPEN && socket.readyState !== WebSocket.CONNECTING)) {
    return;
  }
  if (socket && socket.readyState === WebSocket.CONNECTING) {
    while (true) {
      if (!socket || socket.readyState !== WebSocket.CONNECTING) {
        break;
      }
      await new Promise((resolve) => setTimeout(resolve, 100));
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
  let socket: WebSocket | undefined;
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
  socket.send(JSON.stringify({
    action: "subscribe",
    data: {
      topics: [ topic ],
    },
  }));
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
    socket.send(JSON.stringify({
      action: "unSubscribe",
      data: {
        topics: [ topic ],
      },
    }));
  }
  
  closeSocketTimeout = setTimeout(() => {
    if (topicCallbackMap.size === 0) {
      try {
        socket?.close();
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
  socket0?.send(JSON.stringify({
    action: "publish",
    data,
  }));
  
  closeSocketTimeout = setTimeout(() => {
    if (topicCallbackMap.size === 0) {
      try {
        socket?.close();
      } catch (err) {
        console.log(err);
      } finally {
        socket = undefined;
      }
    }
  }, 600000);
}
