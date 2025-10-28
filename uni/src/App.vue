<script setup lang="ts">

onLaunch((async(options?: App.LaunchShowOption) => {
  const indexStore = useIndexStore();
  indexStore.setLaunchOptions(options);
  
  // #ifdef H5
  await initWxoCfg();
  // #endif
  
}));

</script>

<style lang="scss">

/* 图标必须 */
@use "./uni_modules/tm-ui/css/remixicon.min.css";
/* 自定预处理类，可选 */
// @use "./uni_modules/tm-ui/css/tmui.min.css";

@use "./assets/style/common.scss";

</style>
