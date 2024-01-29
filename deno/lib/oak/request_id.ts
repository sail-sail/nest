import {
  ServiceException,
} from "/lib/exceptions/service.exception.ts";

const requestIdMap = new Map<string, number>();

export function handleRequestId(requestId?: string | null) {
  if (!requestId) {
    return;
  }
  if (requestIdMap.has(requestId)) {
    if (requestIdMap.get(requestId)) {
      clearTimeout(requestIdMap.get(requestId));
    }
    requestIdMap.set(requestId, setTimeout(() => {
      requestIdMap.delete(requestId);
    }, 1000 * 60 * 2));
    throw new ServiceException(`Request ID is duplicated: ${ requestId }`, "request_id_duplicated");
  }
  requestIdMap.set(requestId, setTimeout(() => {
    requestIdMap.delete(requestId);
  }, 1000 * 60 * 2));
}
