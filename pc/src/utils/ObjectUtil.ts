/* eslint-disable @typescript-eslint/no-explicit-any */

export function deepCompare(a: any, b: any, strict = false, excludeKeys: string[] = [ ]): boolean {
  if (!strict) {
    if ((a || "") == (b || "")) {
      return true;
    }
  } else {
    if (a === b) {
      return true;
    }
  }
  if (a instanceof Date && b instanceof Date) {
    return a.getTime() === b.getTime();
  }
  if (a instanceof Array && b instanceof Array) {
    if (a.length !== b.length) {
      return false;
    }
    for (let i = 0; i < a.length; i++) {
      if (!deepCompare(a[i], b[i])) {
        return false;
      }
    }
    return true;
  }
  if (a instanceof Object && b instanceof Object) {
    const keys = Object.keys(a);
    for (const key of keys) {
      if (!deepCompare(a[key], b[key], strict, excludeKeys)) {
        return false;
      }
    }
    return true;
  }
  return false;
}
