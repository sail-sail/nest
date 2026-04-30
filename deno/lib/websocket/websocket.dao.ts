import {
  // log,
  error,
} from "/lib/context.ts";

import {
  socketMap,
  clientIdTopicsMap,
  topicClientIdsMap,
} from "./websocket.constants.ts";

export function addSocketConnection(
  clientId: string,
  connectionId: string,
  socket: WebSocket,
) {
  if (!clientId || !connectionId) {
    return;
  }
  let sockets = socketMap.get(clientId);
  if (!sockets) {
    sockets = new Map();
    socketMap.set(clientId, sockets);
  }
  sockets.set(connectionId, socket);
}

export function getSocketConnections(
  clientId: string,
) {
  if (!clientId) {
    return;
  }
  return socketMap.get(clientId);
}

export function removeSocketConnection(
  clientId: string,
  connectionId: string,
) {
  if (!clientId || !connectionId) {
    return 0;
  }
  const sockets = socketMap.get(clientId);
  if (!sockets) {
    return 0;
  }
  const socket = sockets.get(connectionId);
  if (socket) {
    sockets.delete(connectionId);
    if (
      socket.readyState !== WebSocket.CLOSED &&
      socket.readyState !== WebSocket.CLOSING
    ) {
      try {
        socket.close(1000, `websocket: clientId ${ clientId } remove connection`);
      } catch (err) {
        error(err);
      }
    }
  }
  const leftLen = sockets.size;
  if (leftLen === 0) {
    socketMap.delete(clientId);
  }
  return leftLen;
}

export function subscribeClientTopics(
  clientId: string,
  topics: string[],
) {
  if (!clientId || !topics || topics.length === 0) {
    return;
  }
  let clientTopics = clientIdTopicsMap.get(clientId);
  if (!clientTopics) {
    clientTopics = [ ];
    clientIdTopicsMap.set(clientId, clientTopics);
  }
  const newTopics: string[] = [ ];
  for (const topic of topics) {
    if (!topic || clientTopics.includes(topic)) {
      continue;
    }
    clientTopics.push(topic);
    newTopics.push(topic);
  }
  if (newTopics.length === 0) {
    return;
  }
  for (const topic of newTopics) {
    let clientIds = topicClientIdsMap.get(topic);
    if (!clientIds) {
      clientIds = [ ];
      topicClientIdsMap.set(topic, clientIds);
    }
    if (!clientIds.includes(clientId)) {
      clientIds.push(clientId);
    }
  }
}

export function unSubscribeClientTopics(
  clientId: string,
  topics: string[],
) {
  if (!clientId || !topics || topics.length === 0) {
    return;
  }
  const clientTopics = clientIdTopicsMap.get(clientId);
  if (!clientTopics || clientTopics.length === 0) {
    return;
  }
  const topicsToRemove: string[] = [ ];
  for (const topic of topics) {
    if (!topic || !clientTopics.includes(topic)) {
      continue;
    }
    topicsToRemove.push(topic);
  }
  if (topicsToRemove.length === 0) {
    return;
  }
  const nextTopics = clientTopics.filter((item) => !topicsToRemove.includes(item));
  if (nextTopics.length === 0) {
    clientIdTopicsMap.delete(clientId);
  } else {
    clientIdTopicsMap.set(clientId, nextTopics);
  }
  for (const topic of topicsToRemove) {
    const clientIds = topicClientIdsMap.get(topic);
    if (!clientIds || clientIds.length === 0) {
      continue;
    }
    const nextClientIds = clientIds.filter((item) => item !== clientId);
    if (nextClientIds.length === 0) {
      topicClientIdsMap.delete(topic);
    } else {
      topicClientIdsMap.set(topic, nextClientIds);
    }
  }
}

export function removeClientTopics(
  clientId: string,
) {
  if (!clientId) {
    return;
  }
  const topics = clientIdTopicsMap.get(clientId);
  if (!topics || topics.length === 0) {
    clientIdTopicsMap.delete(clientId);
    return;
  }
  clientIdTopicsMap.delete(clientId);
  for (const topic of topics) {
    const clientIds = topicClientIdsMap.get(topic);
    if (!clientIds || clientIds.length === 0) {
      continue;
    }
    const nextClientIds = clientIds.filter((item) => item !== clientId);
    if (nextClientIds.length === 0) {
      topicClientIdsMap.delete(topic);
    } else {
      topicClientIdsMap.set(topic, nextClientIds);
    }
  }
}

/** 发布消息 */
export async function publish<T>(
  topic: string,
  payload: T,
): Promise<void>;
export async function publish<T>(
  data: {
    topic: string;
    payload: T;
  },
) : Promise<void>;
export async function publish<T>(
  topicOrData: string | {
    topic: string;
    payload: T;
  },
  payload?: T,
) {
  const data = typeof topicOrData === "string"
    ? {
      topic: topicOrData,
      payload: payload as T,
    }
    : topicOrData;
  const topic = data.topic;
  if (!topic) {
    return;
  }
  const clientIds = topicClientIdsMap.get(topic)?.slice() || [ ];
  if (clientIds.length === 0) {
    return;
  }
  const dataStr = JSON.stringify(data);
  for (const clientId of clientIds) {
    const sockets = getSocketConnections(clientId);
    if (!sockets || sockets.size === 0) {
      removeClientTopics(clientId);
      continue;
    }
    const staleConnectionIds: string[] = [ ];
    for (const [ connectionId, socket ] of sockets) {
      if (socket.readyState !== WebSocket.OPEN) {
        staleConnectionIds.push(connectionId);
        continue;
      }
      try {
        socket.send(dataStr);
      } catch (err) {
        error(err);
        staleConnectionIds.push(connectionId);
      }
    }
    for (const connectionId of staleConnectionIds) {
      const leftLen = removeSocketConnection(
        clientId,
        connectionId,
      );
      if (leftLen === 0) {
        removeClientTopics(clientId);
      }
    }
  }
}
