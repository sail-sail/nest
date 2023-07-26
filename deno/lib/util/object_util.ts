

// deno-lint-ignore no-explicit-any
export function deepCompare(a: any, b: any, strict = false): boolean {
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
    if (strict) {
      if (keys.length !== Object.keys(b).length) {
        return false;
      }
    }
    for (const key of keys) {
      if (!deepCompare(a[key], b[key])) {
        return false;
      }
    }
    return true;
  }
  return false;
}
