<template>
<tm-picker-date
  v-bind="$attrs"
  v-model="modelValue"
  v-model:model-str="modelValueStr"
  :format="props.format"
  :format-sync-value="props.formatSyncValue"
  class="custom_date"
  :class="{
    'custom_date_readonly': readonly,
    'custom_date_page_inited': props.pageInited,
  }"
  :disabled="readonly"
>
  <CustomInput
    v-model="modelValueStr"
    readonly
    :clearable="props.clearable == null ? (readonly ? false : true) : props.clearable"
    :readonly-placeholder="(readonly || !props.pageInited) ? (props.pageInited ? props.readonlyPlaceholder : '') : props.placeholder"
    :color="props.color"
    :font-color="readonly ? 
      (modelValue ? 'var(--color-readonly)' :'var(--color-placeholder)') :
      (modelValue ? props.fontColor || 'var(--font-color)' : 'var(--color-placeholder)')"
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
    format?: string;
    formatSyncValue?: boolean;
  }>(),
  {
    readonly: undefined,
    pageInited: true,
    clearable: undefined,
    placeholder: undefined,
    readonlyPlaceholder: undefined,
    color: "transparent",
    fontColor: undefined,
    format: "YYYY-MM-DD",
    formatSyncValue: false,
  },
);

const tmFormItemReadonly = inject<ComputedRef<boolean> | undefined>("tmFormItemReadonly", undefined);

const readonly = $computed(() => {
  if (props.readonly != null) {
    return props.readonly;
  }
  if (tmFormItemReadonly) {
    return tmFormItemReadonly.value;
  }
  return;
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const modelValue = defineModel<any>();
const modelValueStr = defineModel<string>("modelValueStr");

</script>

<style lang="scss" scoped>
.custom_date {
  cursor: pointer;
}
.custom_date_readonly {
  cursor: default;
}
</style>
