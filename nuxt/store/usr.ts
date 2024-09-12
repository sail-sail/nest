
export const uesAuthorization = () => useCookie<string>(
  "authorization",
  {
    default: () => "",
    watch: true,
  },
);
