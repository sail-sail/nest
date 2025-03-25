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
  const errMsg = payRes.errMsg;
  let isPaySuccess = false;
  if (errMsg === "requestPayment:fail cancel") {
    await uni.showModal({
      content: "取消支付!",
    });
  } else if (errMsg.startsWith("requestPayment:fail")) {
    await uni.showModal({
      content: "支付失败!",
    });
  } else if (errMsg === "requestPayment:ok") {
    isPaySuccess = true;
    await uni.showModal({
      content: "支付成功!",
    });
  }
  if (!isPaySuccess) {
    return;
  }
  console.log("支付成功!");
}

</script>
