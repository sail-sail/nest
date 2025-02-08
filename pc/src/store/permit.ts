import type {
  GetUsrPermits,
} from "@/typings/types";

export default defineStore("permit", function() {
  
  const usrStore = useUsrStore();
  
  const permits = ref<Pick<GetUsrPermits, "code" | "route_path">[]>([ ]);
  
  function getPermit(route_path?: string) {
    if (!route_path) {
      const route = useRoute();
      route_path = route.path;
    }
    const permitObj = computed(() => permits.value
      .filter((permit) => permit.route_path === route_path)
      .map((permit) => ({
        [permit.code]: true,
      })).reduce((prev, curr) => ({ ...prev, ...curr }), {})
    );
    
    return function(code: string, lbl?: string) {
      if (usrStore.username === "admin") {
        return true;
      }
      return permitObj.value[code];
    };
  }
  
  return {
    permits,
    getPermit,
  };
  
},
{
  persist: {
    key: "permit",
  },
});
