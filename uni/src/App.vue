<script setup lang="ts">
import { onLaunch } from "@dcloudio/uni-app";
import { uniqueID } from "@/utils/StringUtil";
import { uniLogin } from "@/utils/request";

import useIndexStore from "@/store/index";
import useUsrStore from "@/store/usr";

// #ifdef H5
import {
  initWxWorkCfg,
} from "./utils/WxWorkUtil";
// #endif

onLaunch((async(options: any) => {
  const indexStore = useIndexStore();
  const usrStore = useUsrStore();
  indexStore.setLaunchOptions(options);
  
  const systemInfo = await uni.getSystemInfo();
  indexStore.setSystemInfo(systemInfo);
  
  // #ifdef H5
  await initWxWorkCfg();
  // #endif
  
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
