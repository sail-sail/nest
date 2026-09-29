import {
  getUsrPermits,
} from "../store/Api.ts";

import type {
  GetUsrPermits,
} from "#/types.ts";

const permitStore = usePermitStore();

let authorization: string = uni.getStorageSync("authorization") || "";
let permits: GetUsrPermits[] = $ref(uni.getStorageSync("permits") || [ ]);

let initPermitsPromise: Promise<void> | undefined = undefined;

export async function refreshPermits(
  force: boolean = false,
) {
  if (!authorization) {
    permitStore.clear();
    return;
  }
  if (!force && permits && permits.length > 0) {
    permitStore.permits = permits;
    return;
  }
  if (initPermitsPromise) {
    return await initPermitsPromise;
  }
  initPermitsPromise = (async function() {
    permits = await getUsrPermits({
      notLoading: true,
    });
    permitStore.permits = permits;
    uni.setStorage({
      key: "permits",
      data: permits,
    });
  })();
  return await initPermitsPromise;
}