/* eslint-disable @typescript-eslint/no-explicit-any */
const serverHost = useRuntimeConfig().serverHost;

export default defineEventHandler(async (event) => {
  let body: any;
  const method = event.method;
  if (method === "GET") {
    body = getRouterParams(event);
  } else if (method === "POST") {
    body = await readBody(event);
  }
  const headers = event.headers;
  headers.set("Content-Type", "application/json");
  const res = await fetch(`${ serverHost }/graphql`, {
    method: "POST",
    headers,
    body: JSON.stringify(body),
  });
  const data = await res.json();
  if (data.errors) {
    console.error(data.errors);
  }
  return data;
})
