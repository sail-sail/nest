export function initClientAuthorization() {
  const url = useRequestURL();
  const query = new URLSearchParams(url.search);
  const authorization = query.get("authorization");
  if (authorization) {
    useAuthorization().value = authorization;
  }
}

export const useAuthorization = () => useCookie<string>(
  "authorization",
  {
    default: () => "",
    watch: true,
  },
);
