
export function isEmpty(str: any): boolean {
  if (str === undefined || str === null || str === "" || str === 0) return true;
  const type = typeof(str);
  if (type === "string" && str.trim() === "") return true;
  if (Array.isArray(type) && str.length === 0) return true;
  return false;
}

let UID = Date.now();

export function uniqueID() {
  return (UID++).toString(36);
};
