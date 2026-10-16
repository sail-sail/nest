<script setup lang="ts">
import {
  useTmConfig,
} from "./uni_modules/tm-ui/libs/config";

const tm = useTmConfig()
tm.config.mode = "light";

uni.onThemeChange(({ theme }) => {
  tm.config.mode = theme === 'dark' ? 'dark' : 'light'
});

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
  
  await checkLogin(options);
  
}));

</script>

<style lang="scss">

/* 图标必须 */
@use "./uni_modules/tm-ui/css/remixicon.min.css";
/* 自定预处理类，可选 */
// @use "./uni_modules/tm-ui/css/tmui.min.css";

@use "./assets/style/common.scss";

</style>
