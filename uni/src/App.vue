<script setup lang="ts">

// #ifdef H5
import {
  initWxWorkCfg,
} from "./utils/WxWorkUtil";
// #endif

onLaunch((async(options?: App.LaunchShowOption) => {
  const indexStore = useIndexStore();
  indexStore.setLaunchOptions(options);
  
  // #ifdef H5
  await initWxWorkCfg();
  // #endif
  
}));

</script>

<style lang="scss">

/* 图标必须 */
@import url(./uni_modules/tmui/css/remixicon.min.css);
/* 自定预处理类，可选 */
@import url(./uni_modules/tmui/css/tmui.css);

@import "./assets/style/common.scss";

</style>
