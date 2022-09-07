<template>
<view class="content">
  <view class="text-area">
    <text class="title text-blue-400">{{ title }}</text>
  </view>
  <AppLoading></AppLoading>
</view>
</template>

<script setup lang="ts">
import AppLoading from "@/components/AppLoading/AppLoading.vue";

let title = $ref("hello");

</script>

<style scoped lang="scss">

</style>
