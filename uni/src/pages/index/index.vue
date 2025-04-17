<template>
<view class="content">
  <view class="text-area">
    <text class="title n-text-[#0FF]">
      {{ title }}
    </text>
    <button
      @click="checkLoginEfc"
    >
      点击登录
    </button>
  </view>
  <AppLoading></AppLoading>
</view>
</template>

<script setup lang="ts">
import AppLoading from "@/components/AppLoading/AppLoading.vue";

import {
  checkLogin,
} from "./Api";

const title = ref("hello");

async function checkLoginEfc() {
  const res = await checkLogin();
  console.log(res);
}

</script>

<style scoped lang="scss">

</style>
