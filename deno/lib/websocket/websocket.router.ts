import {
  // log,
  error,
} from "/lib/context.ts";

import {
  Router,
} from "@oak/oak";

import {
  addSocketConnection,
  removeClientTopics,
  removeSocketConnection,
  subscribeClientTopics,
  unSubscribeClientTopics,
} from "./websocket.dao.ts";

function getTopics(
  data: unknown,
) {
  if (!data || typeof data !== "object") {
    return [ ];
  }
  const topics = (data as {
    topics?: unknown;
  }).topics;
  if (!Array.isArray(topics) || topics.length === 0) {
    return [ ];
  }
  const nextTopics: string[] = [ ];
  for (const topic of topics) {
    if (typeof topic !== "string" || !topic || nextTopics.includes(topic)) {
      continue;
    }
    nextTopics.push(topic);
  }
  return nextTopics;
}

function closeSocket(
  socket: WebSocket,
  message?: string,
) {
  if (
    socket.readyState === WebSocket.CLOSED ||
    socket.readyState === WebSocket.CLOSING
  ) {
    return;
  }
  try {
    socket.close(1000, message);
  } catch (_err) {
    // empty
  }
}

function cleanupConnection(
  clientId: string,
  connectionId: string,
) {
  if (!clientId || !connectionId) {
    return;
  }
  const leftLen = removeSocketConnection(
    clientId,
    connectionId,
  );
  if (leftLen === 0) {
    removeClientTopics(clientId);
  }
}

const router = new Router({
  prefix: "/api/websocket/",
});

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
  const connectionId = crypto.randomUUID();
  let isCleaned = false;

  function cleanupCurrentConnection() {
    if (!clientId || !connectionId) {
      return;
    }
    if (isCleaned) {
      return;
    }
    isCleaned = true;
    cleanupConnection(
      clientId,
      connectionId,
    );
  }

  socket.onopen = function() {
    try {
      addSocketConnection(
        clientId,
        connectionId,
        socket,
      );
    } catch (err0) {
      const err = err0 as Error;
      error(err);
      cleanupCurrentConnection();
      closeSocket(socket, err.message);
    }
  };
  socket.onclose = function() {
    cleanupCurrentConnection();
  };
  socket.onerror = function(err0) {
    const err = err0 as ErrorEvent;
    cleanupCurrentConnection();
    closeSocket(socket, err.message);
  };
  socket.onmessage = async function(event) {
    const eventData = event.data;
    if (eventData === "ping") {
      if (socket.readyState === WebSocket.OPEN) {
        socket.send("pong");
      }
      return;
    }
    if (typeof eventData !== "string" || !eventData) {
      return;
    }
    try {
      const obj = JSON.parse(eventData);
      const action = typeof obj?.action === "string" ? obj.action : "";
      const data = obj?.data;
      if (action === "subscribe") {
        const topics = getTopics(data);
        if (topics.length === 0) {
          return;
        }
        subscribeClientTopics(
          clientId,
          topics,
        );
        return;
      } else if (action === "unSubscribe") {
        const topics = getTopics(data);
        if (topics.length === 0) {
          return;
        }
        unSubscribeClientTopics(
          clientId,
          topics,
        );
        return;
      }
    } catch (err) {
      error(err);
    }
  };
  response.body = {
    code: 0,
    data: null,
  };
});

export default router;
