<script setup lang="ts">
import cfg from "@/utils/config";
import { onLaunch } from "@dcloudio/uni-app";
import { uniqueID } from "@/utils/StringUtil";

// #ifdef MP
import { checkLogin } from "./pages/index/Api";
// #endif

onLaunch((async(options: any) => {
  const indexStore = useIndexStore(cfg.pinia);
  indexStore.launchOptions = options;
  
  const systemInfo = uni.getSystemInfoSync();
  indexStore.systemInfo = systemInfo;
  
  let _uid: string | undefined = undefined;
  try {
    _uid = (await uni.getStorage({
      key: "_uid"
    })).data;
  } catch (err) {
  }
  if (!_uid) {
    _uid = uniqueID();
    await uni.setStorage({
      key: "_uid",
      data: _uid
    });
  }
  indexStore.setUid(_uid);
  
  // #ifdef MP
  await checkLogin();
  // #endif
}));
</script>
<style lang="scss">
/* #ifdef APP-NVUE */
@import "./tmui/scss/nvue.css";
/* #endif */
/* #ifndef APP-NVUE */
@import "./tmui/scss/noNvue.css";
/* #endif */

@import "./assets/style/common.scss";
</style>
