export function hex(data: Uint8Array): string {
  return [...data]
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export async function sha256Hex(data: string | Uint8Array): Promise<string> {
  if (typeof data === "string") {
    data = new TextEncoder().encode(data);
  }
  const hash = await crypto.subtle.digest("SHA-256", data);
  return hex(new Uint8Array(hash));
}

export async function hmacSha256(
  keyData: string | Uint8Array,
  data: string,
): Promise<Uint8Array> {
  if (typeof keyData === "string") {
    keyData = new TextEncoder().encode(keyData);
  }

  const key = await crypto.subtle.importKey(
    "raw",
    keyData,
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );

  const mac = await crypto.subtle.sign(
    { name: "HMAC", hash: "SHA-256" },
    key,
    new TextEncoder().encode(data),
  );

  return new Uint8Array(mac);
}
