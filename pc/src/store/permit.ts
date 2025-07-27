import type {
  GetUsrPermits,
} from "@/typings/types";

const permits = useStorage<Pick<GetUsrPermits, "code" | "route_path">[]>("store.permit.permits", [ ]);

const usrStore = useUsrStore();

export default function() {
  
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
      if (usrStore.isAdmin()) {
        return true;
      }
      return permitObj.value[code];
    };
  }
  
  return {
    get permits() {
      return permits.value;
    },
    set permits(value: Pick<GetUsrPermits, "code" | "route_path">[]) {
      permits.value = value;
    },
    getPermit,
  };
  
};
