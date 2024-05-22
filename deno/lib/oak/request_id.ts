import {
  ServiceException,
} from "/lib/exceptions/service.exception.ts";

const requestIdMap = new Map<string, number>();
const requestTimeout = 1000 * 60;

export function handleRequestId(requestId?: string | null) {
  if (!requestId) {
    return;
  }
  if (requestIdMap.has(requestId)) {
    clearTimeout(requestIdMap.get(requestId));
    requestIdMap.set(requestId, setTimeout(() => {
      requestIdMap.delete(requestId);
    }, requestTimeout));
    throw new ServiceException(`Request ID is duplicated: ${ requestId }`, "request_id_duplicated");
  }
  requestIdMap.set(requestId, setTimeout(() => {
    requestIdMap.delete(requestId);
  }, requestTimeout));
}
