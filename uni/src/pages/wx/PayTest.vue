<template>
<view>
  <button
    @click="onRequestPayment"
  >
    微信支付测试
  </button>
  <AppLoading></AppLoading>
</view>
</template>

<script setup lang="ts">
import {
  getTestPayOpt,
} from "./Api.ts";

async function onRequestPayment() {
  const res = await getTestPayOpt();
  console.log(res);
  const payRes = await uni.requestPayment({
    provider: "wxpay",
    orderInfo: "",
    timeStamp: res.timeStamp,
    nonceStr: res.nonceStr,
    package: res.package,
    signType: res.signType,
    paySign: res.paySign,
  });
  console.log(payRes);
}

</script>
