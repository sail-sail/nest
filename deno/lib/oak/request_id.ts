import {
  redisClient,
} from "/lib/context.ts";

import {
  ServiceException,
} from "/lib/exceptions/service.exception.ts";

import {
  getEnv,
} from "/lib/env.ts";

const requestIdMap = new Map<string, number>();
const requestTimeoutSec = 60;
const requestTimeout = requestTimeoutSec * 1000;

export async function handleRequestId(requestId?: string | null) {
  if (!requestId) {
    return;
  }
  if (requestIdMap.has(requestId)) {
    clearTimeout(requestIdMap.get(requestId));
    requestIdMap.set(requestId, setTimeout(() => {
      requestIdMap.delete(requestId);
    }, requestTimeout));
    throw new ServiceException(`x-request-id is duplicated: ${ requestId }`, "request_id_duplicated");
  }
  requestIdMap.set(requestId, setTimeout(() => {
    requestIdMap.delete(requestId);
  }, requestTimeout));
  const cache_enable = (await getEnv("cache_enable")) === "true";
  if (!cache_enable) {
    return;
  }
  const cache_x_request_id = await getEnv("cache_x_request_id");
  if (!cache_x_request_id) {
    return;
  }
  const client = await redisClient();
  if (!client) {
    return;
  }
  const isExists = await client.hexists(cache_x_request_id, requestId);
  if (isExists) {
    throw new ServiceException(`x-request-id is duplicated: ${ requestId }`, "request_id_duplicated");
  }
  await client.set(
    cache_x_request_id,
    requestId,
    {
      ex: requestTimeoutSec,
    },
  );
}
