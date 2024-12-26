<script setup lang="ts">

onLaunch((async(options?: App.LaunchShowOption) => {
  const indexStore = useIndexStore();
  indexStore.setLaunchOptions(options);
}));

</script>

<style lang="scss">

/* 图标必须 */
@import url(./uni_modules/tmui/css/remixicon.min.css);
/* 自定预处理类，可选 */
@import url(./uni_modules/tmui/css/tmui.css);

@import "./assets/style/common.scss";

</style>
