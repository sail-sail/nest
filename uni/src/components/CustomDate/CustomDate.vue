<template>
<tm-picker-date
  v-model="modelValue"
  format="YYYY-MM-DD"
  format-sync-value
  un-cursor="pointer"
  class="custom_date"
  :class="{
    'custom_date_readonly': props.readonly,
    'custom_date_page_inited': props.pageInited,
  }"
  :disabled="props.readonly"
>
  <CustomInput
    v-model="modelValue"
    readonly
    :clearable="props.clearable == null ? (props.readonly ? false : true) : props.clearable"
    :readonly-placeholder="(props.readonly || !props.pageInited) ? (props.pageInited ? props.readonlyPlaceholder : '') : props.placeholder"
    :color="props.color"
    :font-color="props.fontColor ? props.fontColor : (props.readonly ? 'var(--color-readonly)' : 'var(--font-color)')"
    type="text"
  ></CustomInput>
</tm-picker-date>
</template>

<script lang="ts" setup>

const props = withDefaults(
  defineProps<{
    readonly?: boolean;
    pageInited?: boolean;
    clearable?: boolean;
    placeholder?: string;
    readonlyPlaceholder?: string;
    color?: string;
    fontColor?: string;
  }>(),
  {
    readonly: undefined,
    pageInited: true,
    clearable: undefined,
    placeholder: undefined,
    readonlyPlaceholder: undefined,
    color: "transparent",
    fontColor: undefined,
  },
);
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const modelValue = defineModel<any>();
</script>

<style lang="scss" scoped>
.custom_date_readonly {
  cursor: default;
}
</style>
