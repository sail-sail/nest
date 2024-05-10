import {
  queryOne,
} from "/lib/context.ts";

export async function healthCheck() {
  const res = await queryOne("select 1 a");
  if (res?.a !== "1") {
    throw new Error("health check failed");
  }
}
