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
