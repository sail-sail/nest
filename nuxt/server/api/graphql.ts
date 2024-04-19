const serverHost = useRuntimeConfig().serverHost;

export default defineEventHandler(async (event) => {
  let body: any;
  const method = event.method;
  if (method === "GET") {
    body = getRouterParams(event);
  } else if (method === "POST") {
    body = await readBody(event);
  }
  const res = await fetch(`${ serverHost }/graphql`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
  const data = await res.json();
  return data;
})
