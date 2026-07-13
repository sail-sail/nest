import {
  getUsrPermits,
} from "../store/Api.ts";

const permitStore = usePermitStore();

let authorization: string = uni.getStorageSync("authorization") || "";

export async function refreshPermits() {
  if (!authorization) {
    permitStore.permits = [ ];
  } else {
    permitStore.permits = uni.getStorageSync("permits") || [ ];
    const permits = await getUsrPermits({
      notLoading: true,
    });
    permitStore.permits = permits;
    uni.setStorage({
      key: "permits",
      data: permits,
    });
  }
}