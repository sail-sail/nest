import {
  // log,
  error,
} from "/lib/context.ts";

import {
  Router,
} from "oak";

import { wsClient } from "./websocket.dao.ts";

const router = new Router({
  prefix: "/api/websocket/",
});

const socketMap = new Map<string, WebSocket>();
// deno-lint-ignore no-explicit-any
const callbacksMap = new Map<string, ((data: any) => void)[]>();
const clientIdTopicsMap = new Map<string, string[]>();

wsClient.subscribe = function(topic: string, callback: (data: string) => void) {
  let callbacks = callbacksMap.get(topic);
  if (!callbacks) {
    callbacks = [ ];
    callbacksMap.set(topic, callbacks);
  }
  if (!callbacks.includes(callback)) {
    callbacks.push(callback);
  }
};

wsClient.publish = function<T>(
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
        callback(data.payload);
      }
    }
  }
  const dataStr = JSON.stringify(data);
  for (const [ clientId, topics ] of clientIdTopicsMap) {
    if (!topics.includes(topic)) {
      continue;
    }
    const socket = socketMap.get(clientId);
    if (!socket) {
      continue;
    }
    if (socket.readyState !== WebSocket.OPEN) {
      socketMap.delete(clientId);
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
};

// deno-lint-ignore ban-types
wsClient.unSubscribe = function(topic: string, callback: Function) {
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

wsClient.closeClient = function() {
  callbacksMap.clear();
};

function onopen(socket: WebSocket, clientId: string) {
  const socketOld = socketMap.get(clientId);
  if (socketOld) {
    if (socketOld.readyState === WebSocket.OPEN) {
      const msg = `websocket: clientId ${ clientId } close and reconnect`;
      // log(msg);
      socketOld.close(1000, msg);
    }
    // else {
    //   const msg = `websocket: clientId ${ clientId } reconnect`;
    //   log(msg);
    // }
    socketMap.delete(clientId);
    clientIdTopicsMap.delete(clientId);
  }
  // log(`websocket: clientId ${ clientId } onopen`);
  socketMap.set(clientId, socket);
}

router.get("upgrade", async function(ctx) {
  const request = ctx.request;
  const response = ctx.response;
  const clientId = request.url.searchParams.get("clientId");
  if (!clientId) {
    const errMsg = "clientId is required!";
    error(errMsg);
    response.status = 400;
    response.body = {
      code: 400,
      data: errMsg,
    };
    return;
  }
  const socket = await ctx.upgrade();
  socket.onopen = function() {
    try {
      onopen(socket, clientId);
    } catch (err) {
      error(err);
      try {
        if (socket.readyState === WebSocket.OPEN) {
          socket.close(1000, err.message);
        }
      } catch (_err) {
        error(_err);
      }
    }
  };
  socket.onclose = function() {
    // log(`websocket: clientId ${ clientId } onclose`);
    socketMap.delete(clientId);
    clientIdTopicsMap.delete(clientId);
  };
  socket.onerror = function(err0) {
    const err = err0 as ErrorEvent;
    // log(`websocket: clientId ${ clientId } onerror`);
    error(err);
    try {
      if (socket.readyState === WebSocket.OPEN) {
        socket.close(1000, err.message);
      }
    } catch (_err) {
      error(_err);
    }
    socketMap.delete(clientId);
    clientIdTopicsMap.delete(clientId);
  }
  socket.onmessage = function(event) {
    const eventData = event.data;
    if (eventData === "ping") {
      socket.send("pong");
      return;
    }
    if (typeof eventData !== "string") {
      return;
    }
    // log(eventData);
    try {
      const obj = JSON.parse(eventData as string);
      const action = obj.action;
      const data = obj.data;
      if (action === "subscribe") {
        const topics = data.topics;
        if (!topics || topics.length === 0) {
          return;
        }
        let oldTopics = clientIdTopicsMap.get(clientId);
        if (!oldTopics) {
          oldTopics = [ ];
          clientIdTopicsMap.set(clientId, oldTopics);
        }
        for (const topic of topics) {
          if (oldTopics.includes(topic)) {
            continue;
          }
          oldTopics.push(topic);
        }
        clientIdTopicsMap.set(clientId, oldTopics);
        return;
      } else if (action === "publish") {
        const topic = data.topic;
        const callbacks = callbacksMap.get(topic);
        if (callbacks && callbacks.length > 0) {
          for (const callback of callbacks) {
            callback(data.payload);
          }
        }
        const dataStr = JSON.stringify(data);
        for (const [ clientId2, topics ] of clientIdTopicsMap) {
          if (clientId2 === clientId) {
            continue;
          }
          if (!topics.includes(topic)) {
            continue;
          }
          const socket = socketMap.get(clientId2);
          if (!socket) {
            continue;
          }
          if (socket.readyState !== WebSocket.OPEN) {
            socketMap.delete(clientId2);
            clientIdTopicsMap.delete(clientId2);
            try {
              socket.close();
            } catch (_err) {
              error(_err);
            }
            continue;
          }
          socket.send(dataStr);
        }
        return;
      } else if (action === "unSubscribe") {
        const topics = data.topics;
        if (!topics || topics.length === 0) {
          return;
        }
        const oldTopics = clientIdTopicsMap.get(clientId);
        if (!oldTopics) {
          return;
        }
        const newTopics = oldTopics.filter((item) => !topics.includes(item));
        clientIdTopicsMap.set(clientId, newTopics);
      }
    } catch (err) {
      error(err);
    }
  }
  response.body = {
    code: 0,
    data: null,
  };
});

export default router;
