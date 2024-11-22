<script setup lang="ts">
import cfg from "@/utils/config";
import { onLaunch } from "@dcloudio/uni-app";
import { uniqueID } from "@/utils/StringUtil";

onLaunch((async(options?: App.LaunchShowOption) => {
  const indexStore = useIndexStore(cfg.pinia);
  indexStore.setLaunchOptions(options);
  
  const systemInfo = uni.getSystemInfoSync();
  indexStore.setSystemInfo(systemInfo);
  
  // #ifdef H5
  await initWxoCfg();
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
/* 图标必须 */
@import url(./uni_modules/tmui/css/remixicon.min.css);
/* 自定预处理类，可选 */
@import url(./uni_modules/tmui/css/tmui.css);

@import "./assets/style/common.scss";
</style>
