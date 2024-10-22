<template>
<view class="content">
  <view class="text-area">
    <text class="title text-[#0FF]">{{ title }}</text>
  </view>
  <AppLoading></AppLoading>
</view>
</template>

<script setup lang="ts">
import AppLoading from "@/components/AppLoading/AppLoading.vue";

const title = ref("hello");

</script>

<style scoped lang="scss">

</style>
