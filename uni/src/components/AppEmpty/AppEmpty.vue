<template>
<view
  un-flex="~ [1_0_0] col"
  un-justify-center
  un-items-center
>
  <image
    src="/static/img/Document.png"
    :draggable="false"
    :style="customStyle"
  ></image>
  <text
    un-text="gray"
  >
    {{ text }}
  </text>
</view>
</template>

<script lang="ts" setup>

defineProps({
  customStyle: {
    type: Object || String,
    default: undefined,
  },
  text: {
    type: String,
    default: "列表为空",
  },
});
</script>
