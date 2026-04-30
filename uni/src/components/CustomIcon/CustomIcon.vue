<template>
<view
  v-if="props.modelValue && useMaskMode"
  :style="{
    'mask-image': `url('${ props.modelValue }')`,
    '-webkit-mask-image': `url('${ props.modelValue }')`,
  }"
  class="custom_icon custom_icon_mask"
></view>
<image
  v-else-if="props.modelValue"
  :src="props.modelValue"
  mode="aspectFit"
  class="custom_icon custom_icon_image"
></image>
</template>

<script setup lang="ts">
import {
  shouldMaskSvg,
} from "@/utils/svg_icon.ts";

const props = withDefaults(
  defineProps<{
    modelValue?: string | null;
  }>(),
  {
    modelValue: undefined,
  },
);

const useMaskMode = computed(() => {
  return shouldMaskSvg(props.modelValue);
});
</script>

<style scoped lang="scss">
.custom_icon {
  display: inline-block;
  vertical-align: middle;
  width: 1.2em;
  height: 1.2em;
}

.custom_icon_mask {
  // -webkit-mask: var(--un-icon) no-repeat;
  // mask-image: var(--un-icon) no-repeat;
  -webkit-mask-size: 100% 100%;
  mask-repeat: no-repeat;
  mask-size: 100% 100%;
  background-color: currentColor;
}

.custom_icon_image {
  width: 1.2em;
  height: 1.2em;
}
</style>
