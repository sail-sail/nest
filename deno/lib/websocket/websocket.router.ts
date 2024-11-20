import {
  // log,
  error,
  newContext,
  runInAsyncHooks,
} from "/lib/context.ts";

import {
  Router,
} from "@oak/oak";

import {
  callbacksMap,
  socketMap,
  clientIdTopicsMap,
} from "./websocket.constants.ts";

const router = new Router({
  prefix: "/api/websocket/",
});

function onopen(socket: WebSocket, clientId: string) {
  let socketOlds = socketMap.get(clientId);
  if (!socketOlds) {
    socketOlds = [ ];
    socketMap.set(clientId, socketOlds);
  }
  socketOlds.push(socket);
  
  for (const socket2 of socketOlds) {
    if (socket2.readyState !== WebSocket.OPEN) {
      socket2.close(1000, `websocket: clientId ${ clientId } reconnect`);
    }
  }
}

const PWD = "0YSCBr1QQSOpOfi6GgH34A";

router.get("upgrade", function(ctx) {
  const request = ctx.request;
  const response = ctx.response;
  const pwd = request.url.searchParams.get("pwd");
  if (pwd !== PWD) {
    response.status = 401;
    response.body = {
      code: 401,
      data: "Unauthorized",
    };
    return;
  }
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
  const socket = ctx.upgrade();
  socket.onopen = function() {
    try {
      onopen(socket, clientId);
    } catch (err0) {
      const err = err0 as Error;
      error(err);
      try {
        if (socket.readyState !== WebSocket.OPEN) {
          socket.close(1000, err.message);
        }
      } catch (_err) {
        error(_err);
      }
    }
  };
  socket.onclose = function() {
    // log(`websocket: clientId ${ clientId } onclose`);
    // socketMap.delete(clientId);
    for (const [ clientId2, sockets ] of socketMap) {
      if (sockets.includes(socket)) {
        socketMap.set(clientId2, sockets.filter((item) => item !== socket));
      }
    }
    clientIdTopicsMap.delete(clientId);
  };
  socket.onerror = function(err0) {
    const err = err0 as ErrorEvent;
    // log(`websocket: clientId ${ clientId } onerror`);
    // error(err);
    try {
      if (socket.readyState === WebSocket.OPEN) {
        socket.close(1000, err.message);
      }
    } catch (_err) {
      // error(_err);
    }
    // socketMap.delete(clientId);
    for (const [ clientId2, sockets ] of socketMap) {
      if (sockets.includes(socket)) {
        socketMap.set(clientId2, sockets.filter((item) => item !== socket));
      }
    }
    clientIdTopicsMap.delete(clientId);
  }
  socket.onmessage = async function(event) {
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
      const obj = JSON.parse(eventData);
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
            const context = newContext(ctx);
            await runInAsyncHooks(context, async function() {
              await callback(data.payload);
            });
          }
        }
        const dataStr = JSON.stringify(data);
        for (const [ clientId2, topics ] of clientIdTopicsMap) {
          // if (clientId2 === clientId) {
          //   continue;
          // }
          if (!topics.includes(topic)) {
            continue;
          }
          const sockets = socketMap.get(clientId2);
          if (!sockets || sockets.length === 0) {
            continue;
          }
          for (const socket2 of sockets) {
            if (socket2.readyState !== WebSocket.OPEN) {
              socketMap.set(clientId2, sockets.filter((item) => item !== socket2));
              clientIdTopicsMap.delete(clientId2);
              try {
                socket2.close();
              } catch (_err) {
                error(_err);
              }
              continue;
            }
            socket2.send(dataStr);
          }
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
