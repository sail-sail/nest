// deno-lint-ignore no-explicit-any
export type ClientSocketMap = Map<string, WebSocket>;

export const socketMap = new Map<string, ClientSocketMap>();

export const clientIdTopicsMap = new Map<string, string[]>();

export const topicClientIdsMap = new Map<string, string[]>();
