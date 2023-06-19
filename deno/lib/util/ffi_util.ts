let _libSuffix = "";

/**
 * 获取动态库后缀
 * @returns 
 */
export function getLibSuffix() {
  if (_libSuffix) {
    return _libSuffix;
  }
  switch (Deno.build.os) {
    case "windows":
      _libSuffix = "dll";
      break;
    case "darwin":
      _libSuffix = "dylib";
      break;
    default:
      _libSuffix = "so";
      break;
  }
  return _libSuffix;
}

// deno-lint-ignore no-explicit-any
export function readPointer(v: any): Uint8Array {
  const ptr = new Deno.UnsafePointerView(v)
  const lengthBe = new Uint8Array(4)
  const view = new DataView(lengthBe.buffer)
  ptr.copyInto(lengthBe, 0)
  const buf = new Uint8Array(view.getUint32(0))
  ptr.copyInto(buf, 4)
  return buf
}
