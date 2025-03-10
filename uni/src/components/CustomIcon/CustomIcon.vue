<template>
<view
  v-if="props.modelValue && isSvg"
  :style="{
    'mask-image': `url(${ props.modelValue })`,
    '-webkit-mask-image': `url(${ props.modelValue })`,
  }"
  class="iconfont"
></view>
<image
  v-else-if="props.modelValue"
  :src="props.modelValue"
  class="iconfont"
></image>
</template>

<script setup lang="ts">

const props = withDefaults(
  defineProps<{
    modelValue?: string | null;
  }>(),
  {
    modelValue: undefined,
  },
);

const isSvg = computed(() => {
  return props.modelValue?.startsWith("data:image/svg+xml;");
});
</script>

<style scoped lang="scss">
.iconfont {
  // -webkit-mask: var(--un-icon) no-repeat;
  // mask-image: var(--un-icon) no-repeat;
  -webkit-mask-size: 100% 100%;
  mask-repeat: no-repeat;
  mask-size: 100% 100%;
  background-color: currentColor;
  color: inherit;
  display: inline-block;
  vertical-align: middle;
  width: 1.2em;
  height: 1.2em;
}
</style>
