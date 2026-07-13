<script setup lang="ts">
import {
  refreshPermits,
} from "./utils/permit.ts";

onLaunch((async(options?: App.LaunchShowOption) => {
  const indexStore = useIndexStore();
  indexStore.setLaunchOptions(options);
  
  await checkLogin(options);
  
  refreshPermits();
  
}));

</script>

<style lang="scss">

/* 图标必须 */
@use "./uni_modules/tm-ui/css/remixicon.min.css";
/* 自定预处理类，可选 */
// @use "./uni_modules/tm-ui/css/tmui.min.css";

@use "./assets/style/common.scss";

</style>
