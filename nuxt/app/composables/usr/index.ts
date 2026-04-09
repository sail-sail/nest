
export const useAuthorization = () => useCookie<string>(
  "authorization",
  {
    default: () => "",
    watch: true,
  },
);
