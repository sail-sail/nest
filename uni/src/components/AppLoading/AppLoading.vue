<template>
<view
  v-if="loading > 0"
  class="app_loading"
>
  <i
    un-i="iconfont-loading"
    un-h="12"
    un-w="12"
    un-mb="2"
    un-text="gray"
    class="loop_icon"
  ></i>
</view>
</template>

<script lang="ts" setup>
import cfg from "@/utils/config";

const indexStore = useIndexStore(cfg.pinia);

let loading = $computed(() => {
  return indexStore.getLoading();
});
</script>

<style scoped>
.app_loading {
  z-index: 999999;
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  justify-content: center;
  align-items: center;
}
.loop_icon {
  animation: loop_icon 1s linear infinite;
}
@keyframes loop_icon{
  0% {
    transform: rotate(0deg);
  }
  25% {
    transform: rotate(90deg);
  }
  50% {
    transform: rotate(180deg);
  }
  75% {
    transform: rotate(270deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
