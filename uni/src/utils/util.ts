
export function isEmpty(str: string) {
  if (str === undefined || str === null || str === "" || String(str).trim() === "") return true;
  return false;
};

let UID = Date.now();

export function uniqueID() {
  return (UID++).toString(36);
};
