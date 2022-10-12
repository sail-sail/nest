<template>
<view class="app_empty_view">
  <image
    src="/static/img/Document.png"
    :draggable="false"
    :mode="mode"
    :style="customStyle"
  ></image>
  <text style="color: gray;">
    {{ text }}
  </text>
</view>
</template>

<script lang="ts" setup>

defineProps({
  mode: {
    type: String,
    default: "scaleToFill",
  },
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

<style lang="scss" scoped>
.app_empty_view {
  flex: 1 0 0;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}
</style>
