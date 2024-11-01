// deno-lint-ignore no-explicit-any
export const callbacksMap = new Map<string, ((data: any) => Promise<void> | void)[]>();

export const socketMap = new Map<string, WebSocket[]>();

export const clientIdTopicsMap = new Map<string, string[]>();
