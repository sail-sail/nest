
export async function sha1(str: string): Promise<string> {
  // 将字符串转换为Uint8Array，因为crypto.subtle.digest需要ArrayBuffer或TypedArray作为输入
  const encoder = new TextEncoder();
  const data = encoder.encode(str);

  // 使用SHA-1算法计算哈希
  const hashBuffer = await crypto.subtle.digest("SHA-1", data);

  // 将ArrayBuffer转换为十六进制字符串
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

  return hashHex;
}
