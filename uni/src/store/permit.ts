import type {
  GetUsrPermits,
} from "#/types.ts";

const _permits = uni.getStorageSync<Pick<GetUsrPermits, "code" | "route_path">[]>("store.permit.permits") || [ ];
const permits = ref<Pick<GetUsrPermits, "code" | "route_path">[]>(_permits);

const usrStore = useUsrStore();

export default function() {
  
  function getPermit(route_path: string) {
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
