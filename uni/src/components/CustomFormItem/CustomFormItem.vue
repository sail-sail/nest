<template>
<tm-form-item
  v-bind="$attrs"
  :margin="props.margin"
  :err-height="props.errHeight"
>
  <template #default>
    <slot name="default"></slot>
  </template>
</tm-form-item>
</template>

<script lang="ts" setup>

const props = withDefaults(
  defineProps<{
    margin?: number[];
    errHeight?: number;
  }>(),
  {
    margin: () => [20, 0],
    errHeight: undefined,
  },
);
</script>
