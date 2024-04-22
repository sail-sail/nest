const serverHost = useRuntimeConfig().serverHost;

export default defineEventHandler(async (event) => {
  const {
    pathname,
    search,
  } = getRequestURL(event);
  const url = new URL(`${ serverHost }${ pathname }${ search }`);
  const res = await fetch(url);
  return res;
})
