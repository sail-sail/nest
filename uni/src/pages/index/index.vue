<template>
<view class="content">
  <view class="text-area">
    <text class="title">{{ title }}</text>
  </view>
  <AppLoading></AppLoading>
</view>
</template>

<script setup lang="ts">

let title = $ref("hello");

</script>

<style scoped lang="scss">

</style>
