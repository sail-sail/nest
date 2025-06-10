<template>
<tm-picker-date
  v-model="modelValue"
  format="YYYY-MM-DD"
  format-sync-value
  un-cursor="pointer"
  class="custom_date"
  :disabled="props.readonly"
>
  <CustomInput
    :model-value="modelValue"
    readonly
    :show-clear="props.showClear == null ? (props.readonly ? false : true) : props.showClear"
    :placeholder="(props.readonly || !props.pageInited) ? '' : props.placeholder"
    :color="props.color"
    :font-color="props.fontColor ? props.fontColor : (props.readonly ? '#888888' : undefined)"
    type="text"
  ></CustomInput>
</tm-picker-date>
</template>

<script lang="ts" setup>

const props = withDefaults(
  defineProps<{
    readonly?: boolean;
    pageInited?: boolean;
    showClear?: boolean;
    placeholder?: string;
    readonlyPlaceholder?: string;
    color?: string;
    fontColor?: string;
  }>(),
  {
    readonly: undefined,
    pageInited: true,
    showClear: undefined,
    placeholder: undefined,
    readonlyPlaceholder: undefined,
    color: "transparent",
    fontColor: undefined,
  },
);
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const modelValue = defineModel<any>();
</script>
