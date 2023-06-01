import {
  type GetUsrPermits,
} from "@/typings/types";

export default defineStore("permit", function() {
  
  let permits = $ref<Pick<GetUsrPermits, "code" | "is_visible" | "route_path">[]>([]);
  
  function getPermits(route_path?: string) {
    if (!route_path) {
      const route = useRoute();
      route_path = route.path;
    }
    return permits
      .filter((permit) => permit.route_path === route_path)
      .map((permit) => ({
        [permit.code]: permit.is_visible,
      })).reduce((prev, curr) => ({ ...prev, ...curr }), {})
    ;
  }
  
  return $$({
    permits,
    getPermits,
  });
  
}, { persist: true });
