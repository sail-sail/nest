export function isEmpty(str?: string | null): boolean {
  return str === undefined || str === null || str === "" || str.trim() === "";
}

export function isNotEmpty(str?: string | null): str is string {
  return !(str === undefined || str === null || str === "" || str.trim() === "");
}

let UID = Date.now();

export function uniqueID() {
  return (UID++).toString(36);
}

const _randomUUID: unknown = window.crypto?.randomUUID;

export function uuid() {
  if (typeof crypto !== "undefined" && _randomUUID) {
    return crypto.randomUUID();
  }
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0,
      v = c == "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}
