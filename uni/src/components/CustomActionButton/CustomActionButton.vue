<template>
<view
  class="custom-action-button"
  :class="{
    'custom-action-button--block': block,
  }"
>
  <tm-button
    v-bind="$attrs"
    :block="block"
    :color="color"
    :disabled="disabled"
    @click="onClick"
  >
    <slot></slot>
  </tm-button>
</view>
</template>

<script setup lang="ts">
import {
  inject,
  onBeforeUnmount,
  onMounted,
} from "vue";

import {
  actionBarRegistryKey,
} from "../CustomActionBar/context";

defineOptions({
  name: "CustomActionButton",
  inheritAttrs: false,
});

const props = withDefaults(
  defineProps<{
    /**
     * 是否向父级 CustomActionBar 上报为业务按钮
     * 默认 false, 业务按钮需显式设置为 true
     */
    report?: boolean;
    block?: boolean;
    color?: string;
    disabled?: boolean;
  }>(),
  {
    report: false,
    block: true,
    color: undefined,
    disabled: undefined,
  },
);

const emit = defineEmits<{
  click: [evt: MouseEvent];
}>();

const registry = inject(actionBarRegistryKey, undefined);

onMounted(() => {
  if (props.report) {
    registry?.register();
  }
});

onBeforeUnmount(() => {
  if (props.report) {
    registry?.unregister();
  }
});

function onClick(evt: MouseEvent) {
  emit("click", evt);
}
</script>

<style lang="scss" scoped>
.custom-action-button {
  width: 100%;

  &--block {
    flex: 1 1 0;
    min-width: 0;
  }
}
</style>
